# app/models/document.py
from sqlalchemy import Column, String, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime, timezone
from app.database import Base


class Document(Base):
    __tablename__ = "documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    doc_name = Column(String, nullable=False)
    content_hash = Column(String, nullable=False, index=True)  # sha256 of project_id + doc_name + text
    qdrant_point_ids = Column(String, nullable=False)  # comma-separated point IDs, for cleanup on re-ingest
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))