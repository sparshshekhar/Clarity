# app/models/code_file.py
from sqlalchemy import Column, String, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime, timezone
from app.database import Base

class CodeFile(Base):
    __tablename__ = "code_files"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    path = Column(String, nullable=False)
    content_hash = Column(String, nullable=False, index=True)
    qdrant_point_ids = Column(String, nullable=False)
    last_commit_message = Column(String, nullable=True)
    last_synced_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))