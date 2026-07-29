# app/schemas/project.py
from pydantic import BaseModel
import uuid
from app.models.project import ProjectVisibility
from app.models.membership import MembershipRole


class ProjectOut(BaseModel):
    id: uuid.UUID
    name: str
    team: str | None
    visibility: ProjectVisibility
    access_reason: MembershipRole | None  # "active", "alumni", or None if public-only

    class Config:
        from_attributes = True