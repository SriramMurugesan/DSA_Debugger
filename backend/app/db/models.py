from sqlalchemy import create_engine, Column, String, Integer, Text, DateTime, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
from app.core.config import settings
import enum

class ProgressStatus(str, enum.Enum):
    NOT_STARTED = "NOT_STARTED"
    IN_PROGRESS = "IN_PROGRESS"
    SOLVED = "SOLVED"

db_url = settings.DATABASE_URL
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

engine = create_engine(
    db_url,
    connect_args={"check_same_thread": False} if "sqlite" in db_url else {},
    pool_pre_ping=True
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    avatar_url = Column(String, nullable=True)
    password_hash = Column(String, nullable=True)
    password_salt = Column(String, nullable=True)
    provider = Column(String, default="local")
    provider_user_id = Column(String, index=True, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login_at = Column(DateTime, default=datetime.utcnow)
    progress = relationship("UserProblemProgress", back_populates="user")

class Category(Base):
    __tablename__ = "categories"
    id = Column(String, primary_key=True)
    slug = Column(String, unique=True, index=True)
    name = Column(String)
    description = Column(Text)
    display_order = Column(Integer, default=0)
    problems = relationship("Problem", back_populates="category", order_by="Problem.display_order")

class Problem(Base):
    __tablename__ = "problems"
    id = Column(String, primary_key=True)
    slug = Column(String, unique=True, index=True)
    title = Column(String)
    difficulty = Column(String)
    category_id = Column(String, ForeignKey("categories.id"), index=True)
    description = Column(Text)
    constraints = Column(JSON)
    examples = Column(JSON)
    test_cases = Column(JSON)
    starter_code_python = Column(Text)
    visualization_type = Column(String, nullable=True)
    display_order = Column(Integer, default=0)
    category = relationship("Category", back_populates="problems")
    user_progress = relationship("UserProblemProgress", back_populates="problem")

class UserProblemProgress(Base):
    __tablename__ = "user_problem_progress"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, ForeignKey("users.id"), index=True)
    problem_id = Column(String, ForeignKey("problems.id"), index=True)
    status = Column(String, default="NOT_STARTED")
    attempts = Column(Integer, default=0)
    completed_at = Column(DateTime, nullable=True)
    last_attempted_at = Column(DateTime, nullable=True)
    user = relationship("User", back_populates="progress")
    problem = relationship("Problem", back_populates="user_progress")
