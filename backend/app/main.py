from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from app.core.config import settings
from app.api.routes import health, execution, auth, problems, dashboard


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-initialize database tables and seed if empty
    try:
        from sqlalchemy import text
        from app.db.models import Base, engine, SessionLocal, Category
        Base.metadata.create_all(bind=engine)

        # Ensure password columns exist on existing databases
        with engine.connect() as conn:
            for col in ["password_hash", "password_salt"]:
                try:
                    conn.execute(text(f"ALTER TABLE users ADD COLUMN {col} VARCHAR"))
                    conn.commit()
                except Exception:
                    pass

        db = SessionLocal()
        try:
            if db.query(Category).count() == 0:
                print("Fresh database detected. Seeding initial categories and problems...")
                from app.db.seed import seed_db
                seed_db()
        finally:
            db.close()
    except Exception as e:
        print(f"Database startup check warning: {e}")

    yield


app = FastAPI(title="MagizhCode API", lifespan=lifespan)

# Compress large execution traces to drastically reduce latency
app.add_middleware(GZipMiddleware, minimum_size=500)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "ok", "service": "MagizhCode API", "version": "1.0.0"}

@app.get("/health")
def root_health():
    return {"status": "healthy"}

for pfx in ["/api/v1", "/v1"]:
    app.include_router(health.router, prefix=pfx)
    app.include_router(execution.router, prefix=f"{pfx}/execution")
    app.include_router(auth.router, prefix=pfx)
    app.include_router(problems.router, prefix=pfx)
    app.include_router(dashboard.router, prefix=pfx)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=(settings.ENVIRONMENT == "development")
    )
