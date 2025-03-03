from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from contextlib import contextmanager
import backoff

# For development, we'll use SQLite instead of PostgreSQL
engine = create_engine(
    "sqlite:///./energy_db.sqlite",
    connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

@contextmanager
@backoff.on_exception(backoff.expo, Exception, max_tries=3)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()