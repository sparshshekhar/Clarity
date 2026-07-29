# app/services/audit.py
from sqlalchemy.orm import Session
from app.models.audit_log import AuditLog


def log_action(db: Session, user_id, action: str, project_id=None, detail: dict | None = None):
    entry = AuditLog(user_id=user_id, action=action, project_id=project_id, detail=detail)
    db.add(entry)
    db.commit()