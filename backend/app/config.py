# app/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    secret_key: str
    gemini_api_key: str
    qdrant_url: str = "http://localhost:6333"
    github_token: str = ""

    class Config:
        env_file = ".env"

settings = Settings()