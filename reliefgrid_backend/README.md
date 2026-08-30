# 🇮🇳 ReliefGrid — Disaster Severity & Risk Assessment Backend

> **Production-grade disaster triage engine and priority decision support system for emergency management authorities (NDMA / SDMA / DDMA).**

---

## 📖 1. Project Overview

**ReliefGrid** is a disaster relief coordination platform designed to eliminate bottlenecks during catastrophic natural events like monsoon floods and cyclones.

This module (**Disaster Severity & Risk Assessment**) serves as the **algorithmic brain** of ReliefGrid. It ingests ground-truth incident telemetry from disaster zones and calculates:
1. **Four Component Scores (0–100)**: Casualty/Life Hazard, Basic Humanitarian Needs, Medical Urgency, and Infrastructure Degradation.
2. **Final Risk Score (0–100)**: Multi-criteria weighted severity index.
3. **NDMA Severity Tier**: `LOW`, `MEDIUM`, `HIGH`, or `CRITICAL`.
4. **Prioritized Urgency Ranking**: Ordered response queues answering: **"Which location needs the most urgent attention?"**
5. **Human-Readable Risk Factors**: Explainable reasons for emergency commanders and field personnel.

---

## 📁 2. Project Structure

```
reliefgrid_backend/
│
├── app/
│   ├── __init__.py          # Package initialization and metadata
│   ├── main.py              # FastAPI app instance, CORS middleware, lifespan & exception handlers
│   ├── database.py          # SQLite database connection, engine, and dependency-injected session generator
│   ├── models.py            # SQLAlchemy ORM model for the `flood_incidents` database table
│   ├── schemas.py           # Pydantic validation schemas, enum definitions, and response models
│   ├── risk_engine.py       # Core multi-criteria mathematical risk formula and explanation generator
│   └── routes.py            # API route controllers grouped under 'Incidents' and 'Risk Assessment'
│
├── tests/
│   ├── __init__.py          # Test package marker
│   ├── test_risk_engine.py  # Unit tests for mathematical formulas, bounds, and risk factors
│   └── test_api.py          # Integration tests for all HTTP endpoints, validation errors, and ranking
│
├── seed.py                  # Idempotent demo database seeder (Assam, Bihar, UP, Odisha, West Bengal)
├── requirements.txt         # Production and test Python dependencies
├── README.md                # Comprehensive beginner-friendly documentation
└── .gitignore               # Ignored artifacts, virtual environments, and SQLite database files
```

---

## 🧮 3. How the Risk Formula Works

The Final Risk Score is calculated using a multi-criteria weighted linear combination:

$$\text{FINAL RISK SCORE} = 0.40 \times \text{Casualty} + 0.25 \times \text{Basic Need} + 0.20 \times \text{Medical} + 0.15 \times \text{Infrastructure}$$

Every component score and the final score are clamped strictly to the range **$[0, 100]$**.

### 3.1 Casualty / Life Score ($0 - 100$) — Weight: 40%
- **Inputs**: Confirmed fatalities (`deaths`), trapped victims (`people_trapped`), injured count (`injured`), total population (`people_affected`), and subjective hazard rating (`immediate_life_risk`).
- **Logic**: Deaths represent irreversible life loss and receive the highest weight. Trapped individuals in rising water face imminent drowning risk.

### 3.2 Basic Need Score ($0 - 100$) — Weight: 25%
- **Inputs**: Population lacking drinking water, food rations, emergency shelter, and `flood_duration_hours`.
- **Logic**: Drinking water deprivation is weighted highest (critical within 72 hours), amplified by duration under inundation.

### 3.3 Medical Urgency Score ($0 - 100$) — Weight: 20%
- **Inputs**: `medical_emergency` status, `medical_access` blockage, `serious_injuries`, and `vulnerable_population` (infants, elderly).
- **Logic**: Evaluates whether local hospitals are cut off and if vulnerable groups require critical medications.

### 3.4 Infrastructure Score ($0 - 100$) — Weight: 15%
- **Inputs**: `road_accessibility` (Accessible / Partial / Blocked), `communication_status` (Normal / Partial / Failed), `rescue_accessibility` (Easy / Difficult / Very Difficult), and `critical_infrastructure` damage.
- **Logic**: Evaluates logistical impedance preventing relief convoys from reaching the zone.

### 3.5 Severity Tier Mapping
- **$0 \le \text{Score} < 30$** $\rightarrow$ `LOW` (Standard monitoring)
- **$30 \le \text{Score} < 60$** $\rightarrow$ `MEDIUM` (Deploy district reserves)
- **$60 \le \text{Score} < 80$** $\rightarrow$ `HIGH` (Mobilize State Disaster Response Force)
- **$80 \le \text{Score} \le 100$** $\rightarrow$ `CRITICAL` (National Command Airlift & Immediate Rescue)

---

## 🚀 4. Setup & Running Locally

### Step 1: Create and Activate Virtual Environment

**On macOS / Linux:**
```bash
cd reliefgrid_backend
python3 -m venv venv
source venv/bin/activate
```

**On Windows:**
```cmd
cd reliefgrid_backend
python -m venv venv
venv\Scripts\activate
```

### Step 2: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 3: Seed Synthetic Demo Data
```bash
python seed.py
```

### Step 4: Start the FastAPI Server
```bash
uvicorn app.main:app --reload --port 8000
```

- **Base API URL**: `http://127.0.0.1:8000`
- **Interactive Swagger Documentation**: `http://127.0.0.1:8000/docs`
- **ReDoc Interactive Reference**: `http://127.0.0.1:8000/redoc`

---

## 🧪 5. Running Automated Tests

Run the complete test suite with `pytest`:
```bash
pytest -v
```

All 12+ required test scenarios (monotonicity, bounds, validation, duplicate prevention, sorting) will run in isolated memory sessions.

---

## 📡 6. API Endpoints Reference

| Method | Endpoint | Tag | Description |
|---|---|---|---|
| `GET` | `/` | System | Root metadata and service status |
| `GET` | `/health` | System | Liveness probe returning `{"status": "healthy"}` |
| `POST` | `/api/incidents` | Incidents | Ingests telemetry, computes risk formula, returns full record |
| `GET` | `/api/incidents` | Incidents | Lists all recorded disaster incidents |
| `GET` | `/api/incidents/{id}` | Incidents | Fetches single incident by ID (`404` if not found) |
| `DELETE`| `/api/incidents/{id}` | Incidents | Deletes incident by ID (`404` if not found) |
| `GET` | `/api/risk/ranking` | Risk Assessment | **Prioritized queue** sorted by `risk_score DESC` with `priority: 1, 2, 3...` |
| `GET` | `/api/risk/summary` | Risk Assessment | Aggregated counts: `total_incidents`, `critical`, `high`, `medium`, `low` |
| `GET` | `/api/risk/critical` | Risk Assessment | Filtered list containing only `CRITICAL` severity incidents |

---

## 📝 7. Sample Request & Response

### Request: `POST /api/incidents`
```json
{
    "incident_id": "FL-001",
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
```

### Response (`HTTP 201 Created`):
```json
{
    "id": 1,
    "incident_id": "FL-001",
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
    "flood_duration_hours": 30.0,
    "casualty_score": 73.88,
    "basic_need_score": 45.42,
    "medical_score": 53.68,
    "infrastructure_score": 73.5,
    "risk_score": 62.67,
    "severity": "HIGH",
    "risk_factors": [
        "Reported fatalities",
        "High number of trapped people",
        "Medical access is limited",
        "Road access is blocked",
        "Large number of people without water",
        "Large number of people without food",
        "Rescue access is very difficult",
        "Severe immediate life risk present",
        "Major critical infrastructure damage"
    ],
    "created_at": "2026-08-30T19:35:00Z"
}
```

---

## ⚛️ 8. Frontend Connection Guide (React / Next.js)

Since CORS is enabled (`allow_origins=["*"]`), any frontend dashboard can consume these APIs directly via `fetch` or `axios`:

```javascript
// Example React fetch call to retrieve prioritized risk rankings
async function fetchIncidentRankings() {
  const response = await fetch("http://127.0.0.1:8000/api/risk/ranking");
  const rankings = await response.json();
  console.log("Top Priority Zone:", rankings[0].location, "Risk:", rankings[0].risk_score);
  return rankings;
}
```
