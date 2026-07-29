# app/services/ingestion.py — updated with idempotency + cleanup
import hashlib
from sqlalchemy.orm import Session
from app.models.document import Document
from app.services.embeddings import embed_text
from app.services.vector_store import upsert_chunk, ensure_collection, delete_points


def simple_chunk(text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:
    words = text.split()
    chunks = []
    start = 0
    while start < len(words):
        end = start + chunk_size
        chunks.append(" ".join(words[start:end]))
        start += chunk_size - overlap
    return chunks


def compute_hash(project_id: str, doc_name: str, text: str) -> str:
    raw = f"{project_id}:{doc_name}:{text}"
    return hashlib.sha256(raw.encode()).hexdigest()


def ingest_document(db: Session, project_id: str, doc_name: str, full_text: str) -> dict:
    ensure_collection()
    content_hash = compute_hash(project_id, doc_name, full_text)

    existing = (
        db.query(Document)
        .filter(Document.project_id == project_id, Document.doc_name == doc_name)
        .first()
    )

    # Same content already indexed — no-op, don't create duplicates
    if existing and existing.content_hash == content_hash:
        return {"status": "unchanged", "chunks_indexed": 0}

    # Content changed (or doesn't exist yet) — clean up old vectors first, then re-index
    if existing:
        old_point_ids = existing.qdrant_point_ids.split(",") if existing.qdrant_point_ids else []
        if old_point_ids:
            delete_points(old_point_ids)
        db.delete(existing)
        db.commit()

    chunks = simple_chunk(full_text)
    point_ids = []
    for chunk in chunks:
        embedding = embed_text(chunk)
        point_id = upsert_chunk(project_id=project_id, doc_name=doc_name, chunk_text=chunk, embedding=embedding)
        point_ids.append(point_id)

    doc_record = Document(
        project_id=project_id,
        doc_name=doc_name,
        content_hash=content_hash,
        qdrant_point_ids=",".join(point_ids),
    )
    db.add(doc_record)
    db.commit()

    return {"status": "indexed", "chunks_indexed": len(chunks)}