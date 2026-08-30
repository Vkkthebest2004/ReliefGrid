"""
Database configuration and session management for ReliefGrid.
Uses SQLite for lightweight, self-contained local persistence.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from typing import Generator

# SQLite database connection URL
SQLALCHEMY_DATABASE_URL = "sqlite:///./reliefgrid.db"

# connect_args={"check_same_thread": False} is required for SQLite with FastAPI
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False}
)

# Factory for creating database sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative base class for SQLAlchemy models
Base = declarative_base()


def get_db() -> Generator:
    """
    Dependency-injected database session generator.
    Ensures that the database session is always closed after request lifecycle.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
