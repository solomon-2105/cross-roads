import os

from sqlalchemy import create_engine, event
from sqlalchemy.engine import make_url
from sqlalchemy.orm import declarative_base, sessionmaker

from core.config import settings

_url = make_url(settings.DATABASE_URL)
if _url.get_backend_name() != "sqlite":
    raise RuntimeError(
        f"This project uses SQLite only. DATABASE_URL must start with 'sqlite:', got: {_url.drivername}"
    )

# Create the folder for the database file if it does not exist (needed for mounted volumes).
if _url.database and _url.database != ":memory:":
    os.makedirs(os.path.dirname(os.path.abspath(_url.database)), exist_ok=True)

# check_same_thread=False: FastAPI runs sync endpoints and background tasks in different threads.
# timeout: wait up to 30 s for a write lock instead of failing immediately.
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False, "timeout": 30},
)


@event.listens_for(engine, "connect")
def _set_sqlite_pragmas(dbapi_connection, _connection_record):
    cursor = dbapi_connection.cursor()
    # WAL lets the frontend poll the job status while the background task is writing the story.
    cursor.execute("PRAGMA journal_mode=WAL")
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    Base.metadata.create_all(bind=engine)