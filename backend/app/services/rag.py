# app/services/rag.py
from google import genai
from app.config import settings
from app.services.embeddings import embed_text
from app.services.vector_store import search_scoped

client = genai.Client(api_key=settings.gemini_api_key)
GENERATION_MODEL = "gemini-3-flash-preview"


def answer_question(question: str, allowed_project_ids: list[str]) -> dict:
    query_embedding = embed_text(question)
    hits = search_scoped(query_embedding, allowed_project_ids, top_k=5)

    if not hits:
        return {
            "answer": "I couldn't find anything relevant in the projects you have access to.",
            "sources": [],
        }

    context_blocks = []
    sources = []
    for hit in hits:
        payload = hit.payload
        context_blocks.append(f"[{payload['doc_name']}]: {payload['text']}")
        sources.append({"doc_name": payload["doc_name"], "project_id": payload["project_id"]})

    context = "\n\n".join(context_blocks)

    prompt = f"""You are Clarity, an assistant that answers questions grounded strictly in the provided context.
Only use information from the context below. If the answer isn't in the context, say so clearly.

Context:
{context}

Question: {question}

Answer:"""

    response = client.models.generate_content(model=GENERATION_MODEL, contents=prompt)

    return {
        "answer": response.text,
        "sources": sources,
    }