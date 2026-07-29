# app/models/audit_log.py
from sqlalchemy import Column, String, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime, timezone
from app.database import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    action = Column(String, nullable=False)  # e.g. "chat.ask", "chat.ingest", "chat.ingest.denied"
    project_id = Column(UUID(as_uuid=True), nullable=True)
    detail = Column(JSON, nullable=True)  # e.g. {"question": "...", "sources_count": 2}
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))