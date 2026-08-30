"""
ReliefGrid - Disaster Severity & Risk Assessment Backend API.
Main FastAPI application entry point.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.database import engine, Base
from app.routes import router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifecycle manager that initializes database tables on startup.
    """
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="ReliefGrid — Disaster Severity & Risk Assessment API",
    description=(
        "Production-grade disaster triage engine for emergency management authorities (NDMA/SDMA/DDMA).\n\n"
        "Calculates multi-criteria risk scores (0–100), standard NDMA severity levels, "
        "and algorithmic priority rankings across disaster incidents to answer: "
        "**'Which location needs the most urgent attention?'**"
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_tags=[
        {
            "name": "Incidents",
            "description": "Operations to register, view, query, and delete disaster incidents."
        },
        {
            "name": "Risk Assessment",
            "description": "Decision support endpoints for prioritized ranking, summary statistics, and critical alert triage."
        }
    ]
)

# ==========================================
# 🌐 CORS CONFIGURATION
# ==========================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# 🛡️ EXCEPTION HANDLERS
# ==========================================
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Formats validation errors cleanly into clear, readable messages without exposing internal stack traces.
    """
    errors = []
    for error in exc.errors():
        field = " -> ".join([str(loc) for loc in error.get("loc", []) if loc != "body"])
        msg = error.get("msg", "Invalid value")
        errors.append(f"{field}: {msg}" if field else msg)

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": "Input validation failed",
            "errors": errors
        }
    )


# Include all API routes
app.include_router(router)
