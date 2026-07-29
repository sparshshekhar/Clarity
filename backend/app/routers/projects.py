# app/routers/projects.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.project import ProjectOut
from app.services.access_resolver import get_visible_projects, user_can_access_project
from app.models.document import Document
from app.schemas.document import DocumentOut
from app.models.code_file import CodeFile
from app.services.github_sync import sync_repo
from app.services.access_resolver import user_can_manage_project
from pydantic import BaseModel
from datetime import datetime
from app.models.project import Project
import uuid

router = APIRouter(prefix="/projects", tags=["projects"])

class CodeFileOut(BaseModel):
    id: uuid.UUID
    path: str
    last_commit_message: str | None
    last_synced_at: datetime

    class Config:
        from_attributes = True


@router.get("", response_model=list[ProjectOut])
def list_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_visible_projects(db, current_user)


@router.get("/{project_id}", response_model=ProjectOut)
def get_project(
    project_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not user_can_access_project(db, current_user, project_id):
        # 404, not 403 — this is the "invisible, not just inaccessible" rule:
        # a user with no access shouldn't even learn the project exists
        raise HTTPException(status_code=404, detail="Project not found")

    projects = get_visible_projects(db, current_user)
    match = next((p for p in projects if p["id"] == project_id), None)
    if not match:
        raise HTTPException(status_code=404, detail="Project not found")
    return match

@router.get("/{project_id}/documents", response_model=list[DocumentOut])
def list_documents(
    project_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not user_can_access_project(db, current_user, project_id):
        raise HTTPException(status_code=404, detail="Project not found")

    return db.query(Document).filter(Document.project_id == project_id).all()


# app/routers/projects.py — update the sync_github endpoint
@router.post("/{project_id}/sync-github")
def sync_github(
    project_id: uuid.UUID,
    branch: str = "main",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not user_can_manage_project(db, current_user, project_id):
        raise HTTPException(status_code=404, detail="Project not found")

    project = db.query(Project).filter(Project.id == project_id).first()
    if not project or not project.github_repo:
        raise HTTPException(status_code=400, detail="No GitHub repo linked to this project")

    result = sync_repo(db, str(project_id), project.github_repo, branch)
    return result


@router.get("/{project_id}/code-files", response_model=list[CodeFileOut])
def list_code_files(
    project_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not user_can_access_project(db, current_user, project_id):
        raise HTTPException(status_code=404, detail="Project not found")

    return db.query(CodeFile).filter(CodeFile.project_id == project_id).all()