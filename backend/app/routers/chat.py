# app/routers/chat.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.services.access_resolver import get_visible_projects, user_can_manage_project
from app.services.rag import answer_question
from app.services.ingestion import ingest_document
from app.services.audit import log_action

router = APIRouter(prefix="/chat", tags=["chat"])


class ChatRequest(BaseModel):
    question: str


class ChatResponse(BaseModel):
    answer: str
    sources: list[dict]


@router.post("/ask", response_model=ChatResponse)
def ask(
    payload: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    visible_projects = get_visible_projects(db, current_user)
    allowed_ids = [str(p["id"]) for p in visible_projects]

    result = answer_question(payload.question, allowed_ids)

    log_action(
        db,
        user_id=current_user.id,
        action="chat.ask",
        detail={"question": payload.question, "sources_count": len(result["sources"])},
    )

    return ChatResponse(**result)


class IngestRequest(BaseModel):
    project_id: str
    doc_name: str
    text: str


@router.post("/ingest")
def ingest(
    payload: IngestRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not user_can_manage_project(db, current_user, payload.project_id):
        log_action(
            db,
            user_id=current_user.id,
            action="chat.ingest.denied",
            project_id=payload.project_id,
            detail={"doc_name": payload.doc_name},
        )
        # 404, not 403 — same invisibility rule as project access
        raise HTTPException(status_code=404, detail="Project not found")

    result = ingest_document(db, payload.project_id, payload.doc_name, payload.text)

    log_action(
        db,
        user_id=current_user.id,
        action="chat.ingest",
        project_id=payload.project_id,
        detail={"doc_name": payload.doc_name, **result},
    )

    return result