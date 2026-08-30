"""
FastAPI route handlers and API endpoints for ReliefGrid.
Groups endpoints under 'Incidents' and 'Risk Assessment' tags.
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database import get_db
from app.models import FloodIncident
from app.schemas import (
    IncidentCreate,
    IncidentResponse,
    IncidentRankingItem,
    RiskSummaryResponse,
    RootResponse,
    HealthResponse
)
from app.risk_engine import evaluate_incident_risk

router = APIRouter()


# ==========================================
# 🌐 SYSTEM & HEALTH ROUTES
# ==========================================

@router.get(
    "/",
    response_model=RootResponse,
    summary="Root Service Status",
    description="Returns service metadata and module status for ReliefGrid Severity Engine."
)
def get_root():
    return RootResponse(project="ReliefGrid", module="Severity Engine", status="Running")


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Health Check",
    description="Liveness probe returning health status of the API server."
)
def get_health():
    return HealthResponse(status="healthy")


# ==========================================
# 🚨 INCIDENTS ROUTES (Tag: Incidents)
# ==========================================

@router.post(
    "/api/incidents",
    response_model=IncidentResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Incidents"],
    summary="Register Disaster Incident",
    description=(
        "Accepts raw flood incident telemetry, validates inputs, evaluates the 4 component "
        "scores (Casualty, Basic Need, Medical, Infrastructure), computes the Final Risk Score (0-100), "
        "determines the NDMA severity level, generates explainable risk factors, and persists the record."
    )
)
def create_incident(incident_in: IncidentCreate, db: Session = Depends(get_db)):
    # Check for duplicate incident_id
    existing = db.query(FloodIncident).filter(FloodIncident.incident_id == incident_in.incident_id).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Incident already exists"
        )

    # Calculate risk scores, severity, and risk factors
    evaluation = evaluate_incident_risk(incident_in.model_dump(mode="json"))

    # Build DB record
    incident_data = incident_in.model_dump(mode="json")
    incident_data.update(evaluation)

    db_incident = FloodIncident(**incident_data)
    db.add(db_incident)
    db.commit()
    db.refresh(db_incident)

    return db_incident


@router.get(
    "/api/incidents",
    response_model=List[IncidentResponse],
    tags=["Incidents"],
    summary="List All Disaster Incidents",
    description="Retrieves all registered disaster incidents and their calculated severity metrics."
)
def list_incidents(db: Session = Depends(get_db)):
    return db.query(FloodIncident).order_by(desc(FloodIncident.created_at)).all()


@router.get(
    "/api/incidents/{incident_id}",
    response_model=IncidentResponse,
    tags=["Incidents"],
    summary="Get Disaster Incident by ID",
    description="Fetches detailed parameters and risk breakdown for a single disaster incident."
)
def get_incident(incident_id: str, db: Session = Depends(get_db)):
    incident = db.query(FloodIncident).filter(FloodIncident.incident_id == incident_id).first()
    if not incident:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Incident not found"
        )
    return incident


@router.delete(
    "/api/incidents/{incident_id}",
    tags=["Incidents"],
    summary="Delete Disaster Incident",
    description="Removes a disaster incident record from the database by its unique identifier."
)
def delete_incident(incident_id: str, db: Session = Depends(get_db)):
    incident = db.query(FloodIncident).filter(FloodIncident.incident_id == incident_id).first()
    if not incident:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Incident not found"
        )
    db.delete(incident)
    db.commit()
    return {"detail": f"Incident {incident_id} deleted successfully"}


# ==========================================
# 📊 RISK ASSESSMENT ROUTES (Tag: Risk Assessment)
# ==========================================

@router.get(
    "/api/risk/ranking",
    response_model=List[IncidentRankingItem],
    tags=["Risk Assessment"],
    summary="Rank Incidents by Urgent Priority",
    description=(
        "Answers: 'Which location needs the most urgent attention?'\n\n"
        "Returns all disaster incidents ordered from highest to lowest risk score, "
        "assigned an explicit 1-indexed priority ranking."
    )
)
def get_incident_rankings(db: Session = Depends(get_db)):
    incidents = db.query(FloodIncident).order_by(desc(FloodIncident.risk_score)).all()
    rankings: List[IncidentRankingItem] = []
    for index, item in enumerate(incidents, start=1):
        rankings.append(
            IncidentRankingItem(
                priority=index,
                incident_id=item.incident_id,
                location=item.location,
                district=item.district,
                risk_score=item.risk_score,
                severity=item.severity,
                risk_factors=item.risk_factors or []
            )
        )
    return rankings


@router.get(
    "/api/risk/summary",
    response_model=RiskSummaryResponse,
    tags=["Risk Assessment"],
    summary="Get Severity Distribution Summary",
    description="Returns aggregate counts of incidents categorized under LOW, MEDIUM, HIGH, and CRITICAL severity."
)
def get_risk_summary(db: Session = Depends(get_db)):
    total = db.query(FloodIncident).count()
    critical = db.query(FloodIncident).filter(FloodIncident.severity == "CRITICAL").count()
    high = db.query(FloodIncident).filter(FloodIncident.severity == "HIGH").count()
    medium = db.query(FloodIncident).filter(FloodIncident.severity == "MEDIUM").count()
    low = db.query(FloodIncident).filter(FloodIncident.severity == "LOW").count()

    return RiskSummaryResponse(
        total_incidents=total,
        critical=critical,
        high=high,
        medium=medium,
        low=low
    )


@router.get(
    "/api/risk/critical",
    response_model=List[IncidentResponse],
    tags=["Risk Assessment"],
    summary="List Only Critical Severity Incidents",
    description="Filters and returns only active disaster zones assessed with CRITICAL severity (Risk Score >= 80)."
)
def get_critical_incidents(db: Session = Depends(get_db)):
    return db.query(FloodIncident).filter(FloodIncident.severity == "CRITICAL").order_by(desc(FloodIncident.risk_score)).all()
