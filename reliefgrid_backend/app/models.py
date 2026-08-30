"""
SQLAlchemy ORM models for ReliefGrid.
Defines the `flood_incidents` table schema and fields.
"""

from datetime import datetime, timezone
import json
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON
from app.database import Base


class FloodIncident(Base):
    """
    Flood Incident database model storing reported disaster telemetry,
    infrastructure status, demographic impact, and algorithmic risk scores.
    """
    __tablename__ = "flood_incidents"

    # Identity
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    incident_id = Column(String(50), unique=True, index=True, nullable=False)
    location = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)

    # Human Impact
    people_affected = Column(Integer, nullable=False, default=0)
    people_trapped = Column(Integer, nullable=False, default=0)
    injured = Column(Integer, nullable=False, default=0)
    deaths = Column(Integer, nullable=False, default=0)

    # Basic Needs
    people_without_food = Column(Integer, nullable=False, default=0)
    people_without_water = Column(Integer, nullable=False, default=0)
    people_needing_shelter = Column(Integer, nullable=False, default=0)

    # Medical & Vulnerability
    serious_injuries = Column(Integer, nullable=False, default=0)
    vulnerable_population = Column(Integer, nullable=False, default=0)
    immediate_life_risk = Column(String(20), nullable=False)  # LOW, MEDIUM, HIGH, CRITICAL
    medical_emergency = Column(String(20), nullable=False)    # NONE, MINOR, MODERATE, SEVERE, CRITICAL
    medical_access = Column(String(20), nullable=False)       # AVAILABLE, LIMITED, BLOCKED

    # Infrastructure & Accessibility
    road_accessibility = Column(String(20), nullable=False)    # ACCESSIBLE, PARTIAL, BLOCKED
    communication_status = Column(String(20), nullable=False)  # NORMAL, PARTIAL, FAILED
    rescue_accessibility = Column(String(20), nullable=False)  # EASY, DIFFICULT, VERY_DIFFICULT
    critical_infrastructure = Column(String(20), nullable=False)  # NONE, MINOR, MAJOR, CRITICAL

    # Flood Characteristics
    flood_duration_hours = Column(Float, nullable=False, default=0.0)

    # Computed Risk Indicators (Calculated & Stored)
    casualty_score = Column(Float, nullable=False)
    basic_need_score = Column(Float, nullable=False)
    medical_score = Column(Float, nullable=False)
    infrastructure_score = Column(Float, nullable=False)
    risk_score = Column(Float, nullable=False)
    severity = Column(String(20), nullable=False)  # LOW, MEDIUM, HIGH, CRITICAL
    risk_factors = Column(JSON, nullable=False)    # JSON list of human-readable strings

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    def __repr__(self):
        return f"<FloodIncident(incident_id='{self.incident_id}', location='{self.location}', severity='{self.severity}', risk_score={self.risk_score})>"
