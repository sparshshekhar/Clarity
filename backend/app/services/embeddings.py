# app/services/embeddings.py
from google import genai
from app.config import settings

client = genai.Client(api_key=settings.gemini_api_key)

EMBEDDING_MODEL = "gemini-embedding-001"
EMBEDDING_DIM = 3072  # corrected — this model returns 3072-dim vectors, not 768


def embed_text(text: str) -> list[float]:
    result = client.models.embed_content(model=EMBEDDING_MODEL, contents=text)
    return result.embeddings[0].values


def embed_batch(texts: list[str]) -> list[list[float]]:
    return [embed_text(t) for t in texts]