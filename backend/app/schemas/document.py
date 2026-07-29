# app/schemas/document.py
from pydantic import BaseModel
import uuid
from datetime import datetime


class DocumentOut(BaseModel):
    id: uuid.UUID
    doc_name: str
    created_at: datetime

    class Config:
        from_attributes = True