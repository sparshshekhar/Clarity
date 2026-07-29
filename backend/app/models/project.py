# app/models/project.py
from sqlalchemy import Column, String, Enum
from sqlalchemy.dialects.postgresql import UUID
import uuid
import enum
from app.database import Base

class ProjectVisibility(str, enum.Enum):
    public = "public"
    restricted = "restricted"
    secret = "secret"

class Project(Base):
    __tablename__ = "projects"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    team = Column(String, nullable=True)
    visibility = Column(Enum(ProjectVisibility), nullable=False, default=ProjectVisibility.restricted)
    company_domain = Column(String, nullable=False)
    github_repo = Column(String, nullable=True)