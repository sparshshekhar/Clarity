# app/models/membership.py
from sqlalchemy import Column, ForeignKey, Enum, DateTime
from sqlalchemy.dialects.postgresql import UUID
import uuid
import enum
from datetime import datetime
from app.database import Base

class MembershipRole(str, enum.Enum):
    active = "active"    # currently working on it, full access
    alumni = "alumni"    # rolled off, read-only historical access
    owner = "owner"      # active + can manage membership

class ProjectMembership(Base):
    __tablename__ = "project_memberships"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    role = Column(Enum(MembershipRole), nullable=False, default=MembershipRole.active)
    joined_at = Column(DateTime, default=datetime.utcnow)
    left_at = Column(DateTime, nullable=True)  # set when someone rolls off — becomes alumni