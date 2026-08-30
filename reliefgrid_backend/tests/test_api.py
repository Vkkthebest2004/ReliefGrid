"""
API Integration tests for ReliefGrid FastAPI routes and endpoints.
Uses TestClient with an isolated in-memory SQLite database.
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app

# In-memory SQLite engine for fast, isolated test execution
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///:memory:"

test_engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def setup_and_teardown_db():
    """
    Creates fresh database schema before each test and drops tables after.
    """
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)


client = TestClient(app)


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["project"] == "ReliefGrid"
    assert data["module"] == "Severity Engine"
    assert data["status"] == "Running"


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_create_incident_success():
    payload = {
        "incident_id": "TEST-001",
        "location": "Guwahati",
        "state": "Assam",
        "district": "Kamrup Metropolitan",
        "people_affected": 800,
        "people_trapped": 40,
        "injured": 15,
        "deaths": 3,
        "people_without_food": 400,
        "people_without_water": 500,
        "people_needing_shelter": 300,
        "serious_injuries": 8,
        "vulnerable_population": 100,
        "immediate_life_risk": "CRITICAL",
        "medical_emergency": "SEVERE",
        "medical_access": "LIMITED",
        "road_accessibility": "BLOCKED",
        "communication_status": "PARTIAL",
        "rescue_accessibility": "VERY_DIFFICULT",
        "critical_infrastructure": "MAJOR",
        "flood_duration_hours": 30.0
    }

    response = client.post("/api/incidents", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["incident_id"] == "TEST-001"
    assert data["casualty_score"] > 0
    assert data["basic_need_score"] > 0
    assert data["medical_score"] > 0
    assert data["infrastructure_score"] > 0
    assert 0.0 <= data["risk_score"] <= 100.0
    assert data["severity"] in ("LOW", "MEDIUM", "HIGH", "CRITICAL")
    assert isinstance(data["risk_factors"], list)


def test_duplicate_incident_id_returns_409():
    """
    Test 10: Verifies that submitting a duplicate incident_id returns HTTP 409.
    """
    payload = {
        "incident_id": "DUP-001",
        "location": "Patna",
        "state": "Bihar",
        "district": "Patna",
        "people_affected": 200,
        "people_trapped": 10,
        "injured": 2,
        "deaths": 0,
        "people_without_food": 50,
        "people_without_water": 50,
        "people_needing_shelter": 20,
        "serious_injuries": 0,
        "vulnerable_population": 15,
        "immediate_life_risk": "MEDIUM",
        "medical_emergency": "MINOR",
        "medical_access": "AVAILABLE",
        "road_accessibility": "ACCESSIBLE",
        "communication_status": "NORMAL",
        "rescue_accessibility": "EASY",
        "critical_infrastructure": "NONE",
        "flood_duration_hours": 10.0
    }

    # First POST succeeds
    res1 = client.post("/api/incidents", json=payload)
    assert res1.status_code == 201

    # Second POST with identical incident_id returns 409
    res2 = client.post("/api/incidents", json=payload)
    assert res2.status_code == 409
    assert res2.json() == {"detail": "Incident already exists"}


def test_negative_values_rejected_with_422():
    """
    Test 11: Verifies that negative values are rejected with HTTP 422.
    """
    payload = {
        "incident_id": "NEG-001",
        "location": "Kolkata",
        "state": "West Bengal",
        "district": "Kolkata",
        "people_affected": -100,  # Negative value
        "people_trapped": 0,
        "injured": 0,
        "deaths": 0,
        "people_without_food": 0,
        "people_without_water": 0,
        "people_needing_shelter": 0,
        "serious_injuries": 0,
        "vulnerable_population": 0,
        "immediate_life_risk": "LOW",
        "medical_emergency": "NONE",
        "medical_access": "AVAILABLE",
        "road_accessibility": "ACCESSIBLE",
        "communication_status": "NORMAL",
        "rescue_accessibility": "EASY",
        "critical_infrastructure": "NONE",
        "flood_duration_hours": 0.0
    }

    response = client.post("/api/incidents", json=payload)
    assert response.status_code == 422


def test_invalid_cross_field_bounds_rejected_with_422():
    """
    Verifies that people_trapped > people_affected is rejected with HTTP 422.
    """
    payload = {
        "incident_id": "BOUNDS-001",
        "location": "Bhubaneswar",
        "state": "Odisha",
        "district": "Bhubaneswar",
        "people_affected": 50,
        "people_trapped": 80,  # Cannot exceed 50
        "injured": 0,
        "deaths": 0,
        "people_without_food": 0,
        "people_without_water": 0,
        "people_needing_shelter": 0,
        "serious_injuries": 0,
        "vulnerable_population": 0,
        "immediate_life_risk": "LOW",
        "medical_emergency": "NONE",
        "medical_access": "AVAILABLE",
        "road_accessibility": "ACCESSIBLE",
        "communication_status": "NORMAL",
        "rescue_accessibility": "EASY",
        "critical_infrastructure": "NONE",
        "flood_duration_hours": 0.0
    }

    response = client.post("/api/incidents", json=payload)
    assert response.status_code == 422


def test_get_and_delete_incident():
    payload = {
        "incident_id": "FIND-001",
        "location": "Silchar",
        "state": "Assam",
        "district": "Cachar",
        "people_affected": 300,
        "people_trapped": 20,
        "injured": 5,
        "deaths": 0,
        "people_without_food": 100,
        "people_without_water": 100,
        "people_needing_shelter": 50,
        "serious_injuries": 1,
        "vulnerable_population": 25,
        "immediate_life_risk": "MEDIUM",
        "medical_emergency": "MODERATE",
        "medical_access": "LIMITED",
        "road_accessibility": "PARTIAL",
        "communication_status": "NORMAL",
        "rescue_accessibility": "DIFFICULT",
        "critical_infrastructure": "MINOR",
        "flood_duration_hours": 12.0
    }

    client.post("/api/incidents", json=payload)

    # Fetch existing
    get_res = client.get("/api/incidents/FIND-001")
    assert get_res.status_code == 200
    assert get_res.json()["incident_id"] == "FIND-001"

    # Fetch missing
    missing_res = client.get("/api/incidents/NON-EXISTENT")
    assert missing_res.status_code == 404
    assert missing_res.json() == {"detail": "Incident not found"}

    # Delete existing
    del_res = client.delete("/api/incidents/FIND-001")
    assert del_res.status_code == 200

    # Verify deleted
    get_again = client.get("/api/incidents/FIND-001")
    assert get_again.status_code == 404


def test_risk_ranking_sorts_highest_risk_first():
    """
    Test 12: Verifies that /api/risk/ranking sorts highest risk score first with 1-indexed priority ranks.
    """
    # Create low risk incident
    client.post("/api/incidents", json={
        "incident_id": "RANK-LOW",
        "location": "Low Risk Area",
        "state": "State A",
        "district": "District A",
        "people_affected": 100,
        "people_trapped": 0,
        "injured": 0,
        "deaths": 0,
        "people_without_food": 5,
        "people_without_water": 5,
        "people_needing_shelter": 5,
        "serious_injuries": 0,
        "vulnerable_population": 5,
        "immediate_life_risk": "LOW",
        "medical_emergency": "NONE",
        "medical_access": "AVAILABLE",
        "road_accessibility": "ACCESSIBLE",
        "communication_status": "NORMAL",
        "rescue_accessibility": "EASY",
        "critical_infrastructure": "NONE",
        "flood_duration_hours": 2.0
    })

    # Create critical risk incident
    client.post("/api/incidents", json={
        "incident_id": "RANK-CRITICAL",
        "location": "Critical Zone",
        "state": "State B",
        "district": "District B",
        "people_affected": 1000,
        "people_trapped": 120,
        "injured": 40,
        "deaths": 5,
        "people_without_food": 800,
        "people_without_water": 900,
        "people_needing_shelter": 700,
        "serious_injuries": 20,
        "vulnerable_population": 250,
        "immediate_life_risk": "CRITICAL",
        "medical_emergency": "CRITICAL",
        "medical_access": "BLOCKED",
        "road_accessibility": "BLOCKED",
        "communication_status": "FAILED",
        "rescue_accessibility": "VERY_DIFFICULT",
        "critical_infrastructure": "CRITICAL",
        "flood_duration_hours": 60.0
    })

    ranking_res = client.get("/api/risk/ranking")
    assert ranking_res.status_code == 200
    rankings = ranking_res.json()
    assert len(rankings) == 2

    # #1 rank must be the critical zone
    assert rankings[0]["priority"] == 1
    assert rankings[0]["incident_id"] == "RANK-CRITICAL"
    assert rankings[0]["risk_score"] > rankings[1]["risk_score"]

    assert rankings[1]["priority"] == 2
    assert rankings[1]["incident_id"] == "RANK-LOW"


def test_risk_summary_and_critical_filter():
    """
    Tests /api/risk/summary and /api/risk/critical.
    """
    # Create 1 Low and 1 Critical
    client.post("/api/incidents", json={
        "incident_id": "SUM-LOW",
        "location": "Town L",
        "state": "State L",
        "district": "District L",
        "people_affected": 100,
        "people_trapped": 0,
        "injured": 0,
        "deaths": 0,
        "people_without_food": 0,
        "people_without_water": 0,
        "people_needing_shelter": 0,
        "serious_injuries": 0,
        "vulnerable_population": 0,
        "immediate_life_risk": "LOW",
        "medical_emergency": "NONE",
        "medical_access": "AVAILABLE",
        "road_accessibility": "ACCESSIBLE",
        "communication_status": "NORMAL",
        "rescue_accessibility": "EASY",
        "critical_infrastructure": "NONE",
        "flood_duration_hours": 1.0
    })

    client.post("/api/incidents", json={
        "incident_id": "SUM-CRIT",
        "location": "Town C",
        "state": "State C",
        "district": "District C",
        "people_affected": 1500,
        "people_trapped": 150,
        "injured": 60,
        "deaths": 8,
        "people_without_food": 1200,
        "people_without_water": 1300,
        "people_needing_shelter": 900,
        "serious_injuries": 25,
        "vulnerable_population": 350,
        "immediate_life_risk": "CRITICAL",
        "medical_emergency": "CRITICAL",
        "medical_access": "BLOCKED",
        "road_accessibility": "BLOCKED",
        "communication_status": "FAILED",
        "rescue_accessibility": "VERY_DIFFICULT",
        "critical_infrastructure": "CRITICAL",
        "flood_duration_hours": 72.0
    })

    summary_res = client.get("/api/risk/summary")
    assert summary_res.status_code == 200
    summary = summary_res.json()
    assert summary["total_incidents"] == 2
    assert summary["critical"] >= 1
    assert summary["low"] >= 1

    crit_res = client.get("/api/risk/critical")
    assert crit_res.status_code == 200
    crits = crit_res.json()
    assert len(crits) == 1
    assert crits[0]["incident_id"] == "SUM-CRIT"
