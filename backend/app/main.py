# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, projects, chat
from app.routers import auth, projects, chat, webhooks

app = FastAPI(title="Clarity API")
app.include_router(webhooks.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # your Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(chat.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}