# app/routers/webhooks.py
from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.project import Project
from app.services.github_sync import sync_repo

router = APIRouter(prefix="/webhooks", tags=["webhooks"])


@router.post("/github")
async def github_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.json()
    repo_full_name = payload.get("repository", {}).get("full_name")

    if not repo_full_name:
        raise HTTPException(status_code=400, detail="Invalid payload")

    project = db.query(Project).filter(Project.github_repo == repo_full_name).first()
    if not project:
        return {"status": "ignored", "reason": "no project linked to this repo"}

    result = sync_repo(db, str(project.id), repo_full_name)
    return {"status": "synced", **result}