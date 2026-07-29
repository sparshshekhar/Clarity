# app/services/access_resolver.py
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.project import Project, ProjectVisibility
from app.models.membership import ProjectMembership, MembershipRole
from app.models.user import User


def get_visible_projects(db: Session, user: User) -> list[dict]:
    """
    Returns every project a user is allowed to see, tagged with *why*:
    - active: user has an active/owner membership right now
    - alumni: user had membership before but rolled off (left_at is set)
    - None: project is public and in the user's company domain, no membership needed

    Secret/restricted projects the user has no membership in are never included —
    this is the "invisible, not just inaccessible" rule from the design.
    """
    # 1. Projects the user has (or had) direct membership in
    memberships = (
        db.query(ProjectMembership, Project)
        .join(Project, Project.id == ProjectMembership.project_id)
        .filter(ProjectMembership.user_id == user.id)
        .all()
    )

    result = []
    seen_project_ids = set()

    for membership, project in memberships:
        reason = MembershipRole.alumni if membership.left_at else membership.role
        result.append({
            "id": project.id,
            "name": project.name,
            "team": project.team,
            "visibility": project.visibility,
            "access_reason": reason,
        })
        seen_project_ids.add(project.id)

    # 2. Public projects in the user's company domain, not already included above
    public_projects = (
        db.query(Project)
        .filter(
            Project.visibility == ProjectVisibility.public,
            Project.company_domain == user.company_domain,
            ~Project.id.in_(seen_project_ids) if seen_project_ids else True,
        )
        .all()
    )

    for project in public_projects:
        result.append({
            "id": project.id,
            "name": project.name,
            "team": project.team,
            "visibility": project.visibility,
            "access_reason": None,
        })

    return result


def user_can_access_project(db: Session, user: User, project_id) -> bool:
    """
    Used by any endpoint (chat, docs, logs) that needs a hard yes/no check
    before returning project-scoped content — not just for listing.
    """
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        return False

    if project.visibility == ProjectVisibility.public and project.company_domain == user.company_domain:
        return True

    membership = (
        db.query(ProjectMembership)
        .filter(ProjectMembership.user_id == user.id, ProjectMembership.project_id == project_id)
        .first()
    )
    return membership is not None

# app/services/access_resolver.py — add this function
def user_can_manage_project(db: Session, user: User, project_id) -> bool:
    """
    Only project owners can ingest/modify content for a project.
    Active/alumni members can read; only owners can write.
    """
    membership = (
        db.query(ProjectMembership)
        .filter(
            ProjectMembership.user_id == user.id,
            ProjectMembership.project_id == project_id,
            ProjectMembership.role == MembershipRole.owner,
        )
        .first()
    )
    return membership is not None