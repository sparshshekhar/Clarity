# app/services/github_sync.py
import requests
import hashlib
from sqlalchemy.orm import Session
from app.config import settings
from app.models.code_file import CodeFile
from app.services.embeddings import embed_text
from app.services.vector_store import upsert_chunk, ensure_collection, delete_points

GITHUB_API = "https://api.github.com"

# Only sync common source file types — skip binaries, images, lockfiles, etc.
ALLOWED_EXTENSIONS = {".py", ".ts", ".tsx", ".js", ".jsx", ".md", ".json", ".yml", ".yaml"}
MAX_FILE_SIZE_BYTES = 50_000  # skip huge generated files


def _github_headers():
    headers = {"Accept": "application/vnd.github+json"}
    if settings.github_token:
        headers["Authorization"] = f"Bearer {settings.github_token}"
    return headers


def _compute_hash(path: str, content: str) -> str:
    return hashlib.sha256(f"{path}:{content}".encode()).hexdigest()


def fetch_repo_tree(repo: str, branch: str = "main") -> list[dict]:
    """Returns the flat file tree of a repo at a given branch."""
    url = f"{GITHUB_API}/repos/{repo}/git/trees/{branch}?recursive=1"
    resp = requests.get(url, headers=_github_headers())
    resp.raise_for_status()
    tree = resp.json().get("tree", [])
    return [item for item in tree if item["type"] == "blob"]


def fetch_file_content(repo: str, path: str) -> str | None:
    url = f"{GITHUB_API}/repos/{repo}/contents/{path}"
    resp = requests.get(url, headers=_github_headers())
    if resp.status_code != 200:
        return None
    data = resp.json()
    import base64
    if data.get("encoding") == "base64":
        return base64.b64decode(data["content"]).decode("utf-8", errors="ignore")
    return None


def _get_last_commit_message(repo: str, path: str) -> str | None:
    url = f"{GITHUB_API}/repos/{repo}/commits?path={path}&per_page=1"
    resp = requests.get(url, headers=_github_headers())
    if resp.status_code != 200 or not resp.json():
        return None
    return resp.json()[0]["commit"]["message"]


def sync_repo(db: Session, project_id: str, repo: str, branch: str = "main") -> dict:
    ensure_collection()
    tree = fetch_repo_tree(repo, branch)

    synced = 0
    skipped = 0

    for item in tree:
        path = item["path"]
        ext = "." + path.split(".")[-1] if "." in path else ""
        if ext not in ALLOWED_EXTENSIONS:
            skipped += 1
            continue
        if item.get("size", 0) > MAX_FILE_SIZE_BYTES:
            skipped += 1
            continue

        content = fetch_file_content(repo, path)
        if not content:
            continue

        content_hash = _compute_hash(path, content)

        existing = db.query(CodeFile).filter(
            CodeFile.project_id == project_id, CodeFile.path == path
        ).first()

        # Unchanged — skip re-embedding entirely (idempotent, same principle as doc ingestion)
        if existing and existing.content_hash == content_hash:
            continue

        if existing:
            old_ids = existing.qdrant_point_ids.split(",") if existing.qdrant_point_ids else []
            if old_ids:
                delete_points(old_ids)
            db.delete(existing)
            db.commit()

        embedding = embed_text(content[:8000])  # cap what we embed per file for the prototype
        point_id = upsert_chunk(
            project_id=project_id,
            doc_name=path,
            chunk_text=content[:2000],  # store a preview, not the whole file, in the vector payload
            embedding=embedding,
        )

        commit_message = _get_last_commit_message(repo, path)

        db.add(CodeFile(
            project_id=project_id,
            path=path,
            content_hash=content_hash,
            qdrant_point_ids=point_id,
            last_commit_message=commit_message,
        ))
        db.commit()
        synced += 1

    return {"synced": synced, "skipped": skipped, "total_files": len(tree)}