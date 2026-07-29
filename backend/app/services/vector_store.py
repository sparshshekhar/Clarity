# app/services/vector_store.py
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchAny
import uuid
from app.config import settings
from app.services.embeddings import EMBEDDING_DIM
from qdrant_client.models import PointIdsList

client = QdrantClient(url=settings.qdrant_url)

COLLECTION_NAME = "clarity_docs"


def ensure_collection():
    collections = [c.name for c in client.get_collections().collections]
    if COLLECTION_NAME not in collections:
        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=EMBEDDING_DIM, distance=Distance.COSINE),
        )


def upsert_chunk(project_id: str, doc_name: str, chunk_text: str, embedding: list[float]):
    point_id = str(uuid.uuid4())
    client.upsert(
        collection_name=COLLECTION_NAME,
        points=[
            PointStruct(
                id=point_id,
                vector=embedding,
                payload={
                    "project_id": project_id,
                    "doc_name": doc_name,
                    "text": chunk_text,
                },
            )
        ],
    )
    return point_id


def search_scoped(query_embedding: list[float], allowed_project_ids: list[str], top_k: int = 5):
    """
    Permission-aware retrieval: the filter is applied INSIDE the vector search
    itself, not after. A project_id outside allowed_project_ids can never
    surface in results, regardless of semantic similarity.
    """
    if not allowed_project_ids:
        return []

    response = client.query_points(
        collection_name=COLLECTION_NAME,
        query=query_embedding,
        query_filter=Filter(
            must=[
                FieldCondition(
                    key="project_id",
                    match=MatchAny(any=allowed_project_ids),
                )
            ]
        ),
        limit=top_k,
    )
    return response.points

def delete_points(point_ids: list[str]):
    client.delete(collection_name=COLLECTION_NAME, points_selector=PointIdsList(points=point_ids))