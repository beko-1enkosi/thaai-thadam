from pathlib import Path

from sqlalchemy import URL, create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

# Resolve from this file so the database location is independent of the terminal.
DATABASE_PATH = Path(__file__).resolve().parent.parent / "thaai_thadam.db"
DATABASE_URL = URL.create("sqlite", database=str(DATABASE_PATH))

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False)


class Base(DeclarativeBase):
    pass


def get_db():
    """Provide a session to future API routes and close it after each request."""
    with SessionLocal() as session:
        yield session


# No tables are created until product models are defined in a later task.
