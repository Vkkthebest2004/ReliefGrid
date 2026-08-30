"""
ReliefGrid Disaster Severity & Risk Assessment Engine.

Implements the multi-criteria risk formula:
    FINAL RISK SCORE =
        0.40 × CASUALTY/LIFE SCORE
      + 0.25 × BASIC NEED SCORE
      + 0.20 × MEDICAL SCORE
      + 0.15 × INFRASTRUCTURE SCORE

All component scores and final scores are clamped to [0.0, 100.0].
"""

from typing import List, Dict, Any


def _clean_enum(val: Any) -> str:
    """
    Safely extracts uppercase string value from Enum objects or strings.
    """
    if hasattr(val, "value"):
        return str(val.value).upper()
    s = str(val) if val is not None else ""
    return s.split(".")[-1].upper()


# ==========================================
# 1. CASUALTY / LIFE SCORE (0 - 100)
# ==========================================
def compute_casualty_score(
    deaths: int,
    injured: int,
    people_trapped: int,
    people_affected: int,
    immediate_life_risk: Any
) -> float:
    """
    Computes the Casualty & Immediate Life Hazard Score.

    Weights immediate danger to human life:
    - immediate_life_risk: LOW=0, MEDIUM=50, HIGH=80, CRITICAL=100
    - Deaths carry maximum weight (fatalities already occurred)
    - Trapped persons carry high urgency (imminent threat of drowning)
    - Injuries add to casualty burden
    """
    risk_mapping = {
        "LOW": 0.0,
        "MEDIUM": 50.0,
        "HIGH": 80.0,
        "CRITICAL": 100.0
    }
    base_life_risk = risk_mapping.get(_clean_enum(immediate_life_risk), 0.0)
    pop = max(people_affected, 1)

    # Fatality impact: each death significantly increases urgency
    death_impact = min(deaths * 15.0 + (deaths / pop) * 40.0, 100.0) if deaths > 0 else 0.0

    # Trapped impact: trapped victims need immediate boat / helicopter rescue
    trapped_impact = min(people_trapped * 2.5 + (people_trapped / pop) * 40.0, 100.0) if people_trapped > 0 else 0.0

    # Injury impact: medical trauma count
    injury_impact = min(injured * 1.5 + (injured / pop) * 20.0, 100.0) if injured > 0 else 0.0

    # Weighted composition
    score = (
        0.30 * base_life_risk +
        0.35 * death_impact +
        0.25 * trapped_impact +
        0.10 * injury_impact
    )

    return round(min(100.0, max(0.0, score)), 2)


# ==========================================
# 2. BASIC NEED SCORE (0 - 100)
# ==========================================
def compute_basic_need_score(
    people_without_food: int,
    people_without_water: int,
    people_needing_shelter: int,
    flood_duration_hours: float,
    people_affected: int
) -> float:
    """
    Computes the Basic Humanitarian Need Score.

    Evaluates deprivation in vital survival commodities:
    - Potable water deficit (most urgent, fatal in 72h)
    - Food rations deficit
    - Emergency shelter requirements
    - Flood duration stress (hours under inundation)
    """
    pop = max(people_affected, 1)

    water_ratio = min(people_without_water / pop, 1.0)
    food_ratio = min(people_without_food / pop, 1.0)
    shelter_ratio = min(people_needing_shelter / pop, 1.0)

    # Commodity deprivation index (Water: 40%, Food: 35%, Shelter: 25%)
    deficit_score = (0.40 * water_ratio + 0.35 * food_ratio + 0.25 * shelter_ratio) * 100.0

    # Flood duration amplifier: reaches peak stress at 72 hours
    duration_factor = min(flood_duration_hours / 72.0, 1.0) * 100.0

    # Composite: 80% commodity deficit + 20% duration stress
    score = 0.80 * deficit_score + 0.20 * duration_factor

    return round(min(100.0, max(0.0, score)), 2)


# ==========================================
# 3. MEDICAL SCORE (0 - 100)
# ==========================================
def compute_medical_score(
    medical_emergency: Any,
    serious_injuries: int,
    medical_access: Any,
    vulnerable_population: int,
    people_affected: int
) -> float:
    """
    Computes the Medical Urgency & Healthcare Access Score.

    Evaluates health vulnerabilities:
    - medical_emergency: NONE=0, MINOR=25, MODERATE=50, SEVERE=80, CRITICAL=100
    - medical_access: AVAILABLE=0, LIMITED=60, BLOCKED=100
    - Serious trauma count & vulnerable demographics (elderly, infants)
    """
    emergency_map = {
        "NONE": 0.0,
        "MINOR": 25.0,
        "MODERATE": 50.0,
        "SEVERE": 80.0,
        "CRITICAL": 100.0
    }
    access_map = {
        "AVAILABLE": 0.0,
        "LIMITED": 60.0,
        "BLOCKED": 100.0
    }

    emerg_val = emergency_map.get(_clean_enum(medical_emergency), 0.0)
    access_val = access_map.get(_clean_enum(medical_access), 0.0)

    pop = max(people_affected, 1)
    serious_ratio = min((serious_injuries * 3.0) / pop, 1.0) * 100.0
    vulnerable_ratio = min((vulnerable_population * 1.5) / pop, 1.0) * 100.0

    # Composite: 35% emergency level + 35% access blockage + 15% severe injuries + 15% vulnerable population
    score = (
        0.35 * emerg_val +
        0.35 * access_val +
        0.15 * serious_ratio +
        0.15 * vulnerable_ratio
    )

    return round(min(100.0, max(0.0, score)), 2)


# ==========================================
# 4. INFRASTRUCTURE SCORE (0 - 100)
# ==========================================
def compute_infrastructure_score(
    road_accessibility: Any,
    communication_status: Any,
    rescue_accessibility: Any,
    critical_infrastructure: Any
) -> float:
    """
    Computes the Infrastructure Degradation & Logistics Impedance Score.

    Evaluates operational disruption:
    - road_accessibility: ACCESSIBLE=0, PARTIAL=50, BLOCKED=100
    - communication_status: NORMAL=0, PARTIAL=50, FAILED=100
    - rescue_accessibility: EASY=0, DIFFICULT=60, VERY_DIFFICULT=100
    - critical_infrastructure: NONE=0, MINOR=40, MAJOR=80, CRITICAL=100
    """
    road_map = {"ACCESSIBLE": 0.0, "PARTIAL": 50.0, "BLOCKED": 100.0}
    comm_map = {"NORMAL": 0.0, "PARTIAL": 50.0, "FAILED": 100.0}
    rescue_map = {"EASY": 0.0, "DIFFICULT": 60.0, "VERY_DIFFICULT": 100.0}
    infra_map = {"NONE": 0.0, "MINOR": 40.0, "MAJOR": 80.0, "CRITICAL": 100.0}

    road_val = road_map.get(_clean_enum(road_accessibility), 0.0)
    comm_val = comm_map.get(_clean_enum(communication_status), 0.0)
    rescue_val = rescue_map.get(_clean_enum(rescue_accessibility), 0.0)
    infra_val = infra_map.get(_clean_enum(critical_infrastructure), 0.0)

    # Composite: 30% Road access + 25% Rescue difficulty + 25% Telecom + 20% Critical infrastructure
    score = (
        0.30 * road_val +
        0.25 * rescue_val +
        0.25 * comm_val +
        0.20 * infra_val
    )

    return round(min(100.0, max(0.0, score)), 2)


# ==========================================
# 5. FINAL RISK SCORE & SEVERITY LEVEL
# ==========================================
def compute_final_risk_score(
    casualty_score: float,
    basic_need_score: float,
    medical_score: float,
    infrastructure_score: float
) -> float:
    """
    Calculates the combined multi-criteria Final Risk Score (0 - 100).
    Formula:
        FINAL = 0.40 * Casualty + 0.25 * BasicNeed + 0.20 * Medical + 0.15 * Infrastructure
    """
    final_score = (
        0.40 * casualty_score +
        0.25 * basic_need_score +
        0.20 * medical_score +
        0.15 * infrastructure_score
    )
    return round(min(100.0, max(0.0, final_score)), 2)


def determine_severity(risk_score: float) -> str:
    """
    Maps continuous 0-100 risk score to standard NDMA disaster severity tiers.
    - 0   to < 30 : LOW
    - 30  to < 60 : MEDIUM
    - 60  to < 80 : HIGH
    - 80  to 100  : CRITICAL
    """
    if risk_score < 30.0:
        return "LOW"
    elif risk_score < 60.0:
        return "MEDIUM"
    elif risk_score < 80.0:
        return "HIGH"
    else:
        return "CRITICAL"


# ==========================================
# 6. RISK FACTORS EXPLANATION GENERATOR
# ==========================================
def generate_risk_factors(data: Dict[str, Any]) -> List[str]:
    """
    Generates human-readable explanations ("risk factors") for disaster triage.

    Thresholds:
    - people_trapped: > 10 trapped OR >= 5% of affected population
    - people_without_water: > 100 people OR >= 30% of affected population
    - people_without_food: > 100 people OR >= 30% of affected population
    """
    factors: List[str] = []
    people_affected = max(data.get("people_affected", 0), 1)

    # 1. Fatalities
    if data.get("deaths", 0) > 0:
        factors.append("Reported fatalities")

    # 2. Trapped individuals
    trapped = data.get("people_trapped", 0)
    if trapped > 10 or (trapped > 0 and (trapped / people_affected) >= 0.05):
        factors.append("High number of trapped people")

    # 3. Medical Access Obstacles
    med_access = _clean_enum(data.get("medical_access", ""))
    if med_access == "BLOCKED":
        factors.append("Medical access is blocked")
    elif med_access == "LIMITED":
        factors.append("Medical access is limited")

    # 4. Road Accessibility
    road_acc = _clean_enum(data.get("road_accessibility", ""))
    if road_acc == "BLOCKED":
        factors.append("Road access is blocked")

    # 5. Communication Breakdown
    comm_status = _clean_enum(data.get("communication_status", ""))
    if comm_status == "FAILED":
        factors.append("Communication network has failed")

    # 6. Water Deprivation
    water_def = data.get("people_without_water", 0)
    if water_def > 100 or (water_def > 0 and (water_def / people_affected) >= 0.30):
        factors.append("Large number of people without water")

    # 7. Food Deprivation
    food_def = data.get("people_without_food", 0)
    if food_def > 100 or (food_def > 0 and (food_def / people_affected) >= 0.30):
        factors.append("Large number of people without food")

    # 8. Rescue Difficulty
    rescue_acc = _clean_enum(data.get("rescue_accessibility", ""))
    if rescue_acc == "VERY_DIFFICULT":
        factors.append("Rescue access is very difficult")

    # 9. Immediate Life Risk
    life_risk = _clean_enum(data.get("immediate_life_risk", ""))
    if life_risk in ("CRITICAL", "HIGH"):
        factors.append("Severe immediate life risk present")

    # 10. Critical Infrastructure Collapse
    crit_infra = _clean_enum(data.get("critical_infrastructure", ""))
    if crit_infra in ("CRITICAL", "MAJOR"):
        factors.append("Major critical infrastructure damage")

    return factors


# ==========================================
# 7. COMPLETE INCIDENT ASSESSMENT WORKFLOW
# ==========================================
def evaluate_incident_risk(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Orchestrates complete end-to-end risk evaluation for an incident payload.
    Returns all 4 component scores, final risk_score, severity, and risk_factors.
    """
    casualty_score = compute_casualty_score(
        deaths=data.get("deaths", 0),
        injured=data.get("injured", 0),
        people_trapped=data.get("people_trapped", 0),
        people_affected=data.get("people_affected", 0),
        immediate_life_risk=str(data.get("immediate_life_risk", "LOW"))
    )

    basic_need_score = compute_basic_need_score(
        people_without_food=data.get("people_without_food", 0),
        people_without_water=data.get("people_without_water", 0),
        people_needing_shelter=data.get("people_needing_shelter", 0),
        flood_duration_hours=float(data.get("flood_duration_hours", 0.0)),
        people_affected=data.get("people_affected", 0)
    )

    medical_score = compute_medical_score(
        medical_emergency=str(data.get("medical_emergency", "NONE")),
        serious_injuries=data.get("serious_injuries", 0),
        medical_access=str(data.get("medical_access", "AVAILABLE")),
        vulnerable_population=data.get("vulnerable_population", 0),
        people_affected=data.get("people_affected", 0)
    )

    infrastructure_score = compute_infrastructure_score(
        road_accessibility=str(data.get("road_accessibility", "ACCESSIBLE")),
        communication_status=str(data.get("communication_status", "NORMAL")),
        rescue_accessibility=str(data.get("rescue_accessibility", "EASY")),
        critical_infrastructure=str(data.get("critical_infrastructure", "NONE"))
    )

    risk_score = compute_final_risk_score(
        casualty_score=casualty_score,
        basic_need_score=basic_need_score,
        medical_score=medical_score,
        infrastructure_score=infrastructure_score
    )

    severity = determine_severity(risk_score)
    risk_factors = generate_risk_factors(data)

    return {
        "casualty_score": casualty_score,
        "basic_need_score": basic_need_score,
        "medical_score": medical_score,
        "infrastructure_score": infrastructure_score,
        "risk_score": risk_score,
        "severity": severity,
        "risk_factors": risk_factors
    }
