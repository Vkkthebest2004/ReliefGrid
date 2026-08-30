"""
Pydantic schemas and input validation models for ReliefGrid.
Enforces data integrity, value bounds, and cross-field consistency.
"""

from datetime import datetime
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field, model_validator, ConfigDict


# ==========================================
# 📋 ENUMS FOR CATEGORICAL INPUTS
# ==========================================

class ImmediateLifeRiskEnum(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class MedicalEmergencyEnum(str, Enum):
    NONE = "NONE"
    MINOR = "MINOR"
    MODERATE = "MODERATE"
    SEVERE = "SEVERE"
    CRITICAL = "CRITICAL"


class MedicalAccessEnum(str, Enum):
    AVAILABLE = "AVAILABLE"
    LIMITED = "LIMITED"
    BLOCKED = "BLOCKED"


class RoadAccessibilityEnum(str, Enum):
    ACCESSIBLE = "ACCESSIBLE"
    PARTIAL = "PARTIAL"
    BLOCKED = "BLOCKED"


class CommunicationStatusEnum(str, Enum):
    NORMAL = "NORMAL"
    PARTIAL = "PARTIAL"
    FAILED = "FAILED"


class RescueAccessibilityEnum(str, Enum):
    EASY = "EASY"
    DIFFICULT = "DIFFICULT"
    VERY_DIFFICULT = "VERY_DIFFICULT"


class CriticalInfrastructureEnum(str, Enum):
    NONE = "NONE"
    MINOR = "MINOR"
    MAJOR = "MAJOR"
    CRITICAL = "CRITICAL"


class SeverityLevelEnum(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


# ==========================================
# 📥 REQUEST SCHEMAS
# ==========================================

class IncidentCreate(BaseModel):
    """
    Input schema for registering a flood disaster incident.
    Validates non-negative counts and logical constraints.
    """
    incident_id: str = Field(..., description="Unique human-readable incident identifier (e.g. FL-001)", min_length=1)
    location: str = Field(..., description="Specific town, landmark, or village name", min_length=1)
    state: str = Field(..., description="State or Union Territory", min_length=1)
    district: str = Field(..., description="Administrative District", min_length=1)

    # Human Impact
    people_affected: int = Field(..., ge=0, description="Total estimated people directly affected in zone")
    people_trapped: int = Field(..., ge=0, description="Number of individuals trapped by floodwaters")
    injured: int = Field(..., ge=0, description="Total reported injuries")
    deaths: int = Field(..., ge=0, description="Confirmed fatalities")

    # Basic Needs
    people_without_food: int = Field(..., ge=0, description="People lacking food supplies")
    people_without_water: int = Field(..., ge=0, description="People lacking safe drinking water")
    people_needing_shelter: int = Field(..., ge=0, description="Evacuees requiring emergency shelter")

    # Medical & Vulnerability
    serious_injuries: int = Field(..., ge=0, description="Count of critical trauma or acute medical injuries")
    vulnerable_population: int = Field(..., ge=0, description="Infants, pregnant women, and elderly citizens")
    immediate_life_risk: ImmediateLifeRiskEnum = Field(..., description="Immediate danger to life indicator")
    medical_emergency: MedicalEmergencyEnum = Field(..., description="Severity of local medical emergencies")
    medical_access: MedicalAccessEnum = Field(..., description="Status of access to hospitals and clinics")

    # Infrastructure & Accessibility
    road_accessibility: RoadAccessibilityEnum = Field(..., description="Road condition into disaster zone")
    communication_status: CommunicationStatusEnum = Field(..., description="Mobile and landline network status")
    rescue_accessibility: RescueAccessibilityEnum = Field(..., description="Operational difficulty for rescue teams")
    critical_infrastructure: CriticalInfrastructureEnum = Field(..., description="Damage to power grid, water plants, bridges")

    # Duration
    flood_duration_hours: float = Field(..., ge=0.0, description="Hours since initial inundation began")

    @model_validator(mode="after")
    def validate_cross_field_bounds(self):
        """
        Ensures sub-population counts do not exceed total people affected.
        """
        if self.people_trapped > self.people_affected:
            raise ValueError("people_trapped cannot exceed people_affected")
        if self.injured > self.people_affected:
            raise ValueError("injured cannot exceed people_affected")
        if self.deaths > self.people_affected:
            raise ValueError("deaths cannot exceed people_affected")
        return self


# ==========================================
# 📤 RESPONSE SCHEMAS
# ==========================================

class IncidentResponse(BaseModel):
    """
    Complete response schema for a recorded disaster incident,
    including raw telemetry and all calculated mathematical risk scores.
    """
    model_config = ConfigDict(from_attributes=True)

    id: int
    incident_id: str
    location: str
    state: str
    district: str

    people_affected: int
    people_trapped: int
    injured: int
    deaths: int

    people_without_food: int
    people_without_water: int
    people_needing_shelter: int

    serious_injuries: int
    vulnerable_population: int
    immediate_life_risk: str
    medical_emergency: str
    medical_access: str

    road_accessibility: str
    communication_status: str
    rescue_accessibility: str
    critical_infrastructure: str

    flood_duration_hours: float

    # Calculated Scores & Indicators
    casualty_score: float
    basic_need_score: float
    medical_score: float
    infrastructure_score: float
    risk_score: float
    severity: str
    risk_factors: List[str]
    created_at: datetime


class IncidentRankingItem(BaseModel):
    """
    Prioritized incident ranking summary for decision support.
    """
    priority: int = Field(..., description="1-indexed urgency priority rank")
    incident_id: str
    location: str
    district: str
    risk_score: float
    severity: str
    risk_factors: List[str]


class RiskSummaryResponse(BaseModel):
    """
    Aggregate summary metrics across all recorded disaster incidents.
    """
    total_incidents: int
    critical: int
    high: int
    medium: int
    low: int


class RootResponse(BaseModel):
    project: str = "ReliefGrid"
    module: str = "Severity Engine"
    status: str = "Running"


class HealthResponse(BaseModel):
    status: str = "healthy"
