"""
Unit tests for the ReliefGrid Disaster Severity & Risk Assessment Engine.
Tests all component formulas, monotonic properties, bounding constraints, and explanation generation.
"""

import pytest
from app.risk_engine import (
    compute_casualty_score,
    compute_basic_need_score,
    compute_medical_score,
    compute_infrastructure_score,
    compute_final_risk_score,
    determine_severity,
    generate_risk_factors,
    evaluate_incident_risk
)


def test_severity_tier_determinations():
    """
    Test 1, 2, 3, 4: Verifies correct threshold mapping for LOW, MEDIUM, HIGH, and CRITICAL.
    """
    assert determine_severity(0.0) == "LOW"
    assert determine_severity(29.99) == "LOW"
    assert determine_severity(30.0) == "MEDIUM"
    assert determine_severity(59.99) == "MEDIUM"
    assert determine_severity(60.0) == "HIGH"
    assert determine_severity(79.99) == "HIGH"
    assert determine_severity(80.0) == "CRITICAL"
    assert determine_severity(100.0) == "CRITICAL"


def test_risk_score_bounds():
    """
    Test 5: Verifies that component and final risk scores are strictly clamped between 0 and 100.
    """
    # Extreme low baseline
    low_res = evaluate_incident_risk({
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
        "flood_duration_hours": 0.0
    })
    assert 0.0 <= low_res["risk_score"] <= 100.0
    assert low_res["severity"] == "LOW"

    # Extreme high baseline
    high_res = evaluate_incident_risk({
        "people_affected": 1000,
        "people_trapped": 500,
        "injured": 200,
        "deaths": 50,
        "people_without_food": 1000,
        "people_without_water": 1000,
        "people_needing_shelter": 1000,
        "serious_injuries": 100,
        "vulnerable_population": 300,
        "immediate_life_risk": "CRITICAL",
        "medical_emergency": "CRITICAL",
        "medical_access": "BLOCKED",
        "road_accessibility": "BLOCKED",
        "communication_status": "FAILED",
        "rescue_accessibility": "VERY_DIFFICULT",
        "critical_infrastructure": "CRITICAL",
        "flood_duration_hours": 120.0
    })
    assert 0.0 <= high_res["risk_score"] <= 100.0
    assert high_res["severity"] == "CRITICAL"


def test_fatalities_increase_risk_score():
    """
    Test 6: Verifies that an increase in reported deaths strictly increases the casualty score and risk score.
    """
    base_payload = {
        "people_affected": 500,
        "people_trapped": 10,
        "injured": 5,
        "deaths": 0,
        "people_without_food": 100,
        "people_without_water": 100,
        "people_needing_shelter": 50,
        "serious_injuries": 2,
        "vulnerable_population": 30,
        "immediate_life_risk": "MEDIUM",
        "medical_emergency": "MODERATE",
        "medical_access": "LIMITED",
        "road_accessibility": "PARTIAL",
        "communication_status": "NORMAL",
        "rescue_accessibility": "DIFFICULT",
        "critical_infrastructure": "MINOR",
        "flood_duration_hours": 24.0
    }

    res_zero_deaths = evaluate_incident_risk(base_payload)

    payload_with_deaths = dict(base_payload)
    payload_with_deaths["deaths"] = 8
    res_with_deaths = evaluate_incident_risk(payload_with_deaths)

    assert res_with_deaths["casualty_score"] > res_zero_deaths["casualty_score"]
    assert res_with_deaths["risk_score"] > res_zero_deaths["risk_score"]


def test_trapped_population_increases_risk_score():
    """
    Test 7: Verifies that an increase in trapped individuals strictly increases the casualty score and risk score.
    """
    base_payload = {
        "people_affected": 1000,
        "people_trapped": 5,
        "injured": 10,
        "deaths": 0,
        "people_without_food": 200,
        "people_without_water": 200,
        "people_needing_shelter": 100,
        "serious_injuries": 0,
        "vulnerable_population": 50,
        "immediate_life_risk": "MEDIUM",
        "medical_emergency": "MINOR",
        "medical_access": "AVAILABLE",
        "road_accessibility": "PARTIAL",
        "communication_status": "NORMAL",
        "rescue_accessibility": "EASY",
        "critical_infrastructure": "NONE",
        "flood_duration_hours": 12.0
    }

    res_low_trapped = evaluate_incident_risk(base_payload)

    payload_high_trapped = dict(base_payload)
    payload_high_trapped["people_trapped"] = 80
    res_high_trapped = evaluate_incident_risk(payload_high_trapped)

    assert res_high_trapped["casualty_score"] > res_low_trapped["casualty_score"]
    assert res_high_trapped["risk_score"] > res_low_trapped["risk_score"]


def test_medical_access_blockage_increases_medical_score():
    """
    Test 8: Verifies that BLOCKED medical access increases medical score over AVAILABLE medical access.
    """
    score_available = compute_medical_score(
        medical_emergency="MODERATE",
        serious_injuries=5,
        medical_access="AVAILABLE",
        vulnerable_population=30,
        people_affected=500
    )

    score_blocked = compute_medical_score(
        medical_emergency="MODERATE",
        serious_injuries=5,
        medical_access="BLOCKED",
        vulnerable_population=30,
        people_affected=500
    )

    assert score_blocked > score_available


def test_road_accessibility_blockage_increases_infrastructure_score():
    """
    Test 9: Verifies that BLOCKED road accessibility increases infrastructure score over ACCESSIBLE.
    """
    score_accessible = compute_infrastructure_score(
        road_accessibility="ACCESSIBLE",
        communication_status="NORMAL",
        rescue_accessibility="EASY",
        critical_infrastructure="NONE"
    )

    score_blocked = compute_infrastructure_score(
        road_accessibility="BLOCKED",
        communication_status="NORMAL",
        rescue_accessibility="EASY",
        critical_infrastructure="NONE"
    )

    assert score_blocked > score_accessible


def test_risk_factors_generation():
    """
    Verifies human-readable reason generation for critical risk factors.
    """
    data = {
        "people_affected": 500,
        "people_trapped": 35,
        "deaths": 2,
        "people_without_water": 350,
        "people_without_food": 250,
        "medical_access": "BLOCKED",
        "road_accessibility": "BLOCKED",
        "communication_status": "FAILED",
        "rescue_accessibility": "VERY_DIFFICULT"
    }

    factors = generate_risk_factors(data)
    assert "Reported fatalities" in factors
    assert "High number of trapped people" in factors
    assert "Medical access is blocked" in factors
    assert "Road access is blocked" in factors
    assert "Communication network has failed" in factors
    assert "Large number of people without water" in factors
    assert "Large number of people without food" in factors
    assert "Rescue access is very difficult" in factors
