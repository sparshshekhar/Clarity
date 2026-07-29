# app/seed.py
from app.database import SessionLocal
from app.models.user import User
from app.models.project import Project, ProjectVisibility
from app.models.membership import ProjectMembership, MembershipRole
from app.core.security import hash_password
from datetime import datetime, timedelta

db = SessionLocal()

# Reuse your existing signed-up user, or create fresh ones
sparsh = db.query(User).filter(User.email == "sparsh@acme.com").first()

if not sparsh:
    sparsh = User(
        name="Sparsh",
        email="sparsh@acme.com",
        hashed_password=hash_password("testpass123"),
        company_domain="acme.com",
    )
    db.add(sparsh)
    db.commit()
    db.refresh(sparsh)

# A second user to test alumni / no-access scenarios
priya = db.query(User).filter(User.email == "priya@acme.com").first()
if not priya:
    priya = User(
        name="Priya",
        email="priya@acme.com",
        hashed_password=hash_password("testpass123"),
        company_domain="acme.com",
    )
    db.add(priya)
    db.commit()
    db.refresh(priya)

# Projects
checkout = Project(
    name="Checkout revamp",
    team="Payments team",
    visibility=ProjectVisibility.restricted,
    company_domain="acme.com",
)
onboarding = Project(
    name="Onboarding flow v2",
    team="Growth team",
    visibility=ProjectVisibility.restricted,
    company_domain="acme.com",
)
search_reindex = Project(
    name="Search reindexing",
    team="Infra team",
    visibility=ProjectVisibility.public,  # visible to whole company, no membership needed
    company_domain="acme.com",
)
secret_project = Project(
    name="Q4 stealth initiative",
    team="Leadership",
    visibility=ProjectVisibility.secret,  # sparsh has NO membership — should be invisible
    company_domain="acme.com",
)

db.add_all([checkout, onboarding, search_reindex, secret_project])
db.commit()
for p in [checkout, onboarding, search_reindex, secret_project]:
    db.refresh(p)

# Memberships
db.add_all([
    # app/seed.py — change Sparsh's membership roles
ProjectMembership(user_id=sparsh.id, project_id=checkout.id, role=MembershipRole.owner),
ProjectMembership(user_id=sparsh.id, project_id=onboarding.id, role=MembershipRole.owner),
    # Sparsh rolled off a project 3 months ago — should show as "alumni"
    ProjectMembership(
        user_id=sparsh.id,
        project_id=search_reindex.id,  # reuse for demo, though this one's public anyway
        role=MembershipRole.active,
        joined_at=datetime.utcnow() - timedelta(days=200),
        left_at=datetime.utcnow() - timedelta(days=90),
    ),
])
db.commit()

print("Seed complete.")
print(f"Sparsh: {sparsh.email}")
print(f"Priya: {priya.email}")
print("Projects: Checkout revamp (active), Onboarding flow v2 (active), Search reindexing (public), Q4 stealth initiative (secret, no access)")

db.close()