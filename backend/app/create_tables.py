# app/create_tables.py
from app.config import settings
print("Using URL:", settings.database_url)

from app.database import engine, Base
from app.models import user, project, membership, document, audit_log, code_file

Base.metadata.create_all(bind=engine)
print("Tables created.")