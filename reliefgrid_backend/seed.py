"""
Seed script for ReliefGrid Disaster Severity & Risk Assessment module.

Populates the SQLite database with 5 synthetic disaster incident records across Indian regions.
NOTE: These are SYNTHETIC DEMO RECORDS ONLY for testing and demonstration, not real-world statistics.

Idempotent: Running this script multiple times will not create duplicate entries.
"""

import sys
from sqlalchemy.orm import Session
from app.database import engine, SessionLocal, Base
from app.models import FloodIncident
from app.risk_engine import evaluate_incident_risk

# Synthetic demo records covering LOW, MEDIUM, HIGH, and CRITICAL severities
SYNTHETIC_INCIDENTS = [
    {
        "incident_id": "FL-GHY-001",
        "location": "Pandu Ghat Lowlands",
        "state": "Assam",
        "district": "Kamrup Metropolitan",
        "people_affected": 1200,
        "people_trapped": 95,
        "injured": 32,
        "deaths": 4,
        "people_without_food": 850,
        "people_without_water": 920,
        "people_needing_shelter": 600,
        "serious_injuries": 14,
        "vulnerable_population": 220,
        "immediate_life_risk": "CRITICAL",
        "medical_emergency": "CRITICAL",
        "medical_access": "BLOCKED",
        "road_accessibility": "BLOCKED",
        "communication_status": "FAILED",
        "rescue_accessibility": "VERY_DIFFICULT",
        "critical_infrastructure": "CRITICAL",
        "flood_duration_hours": 48.0
    },
    {
        "incident_id": "FL-PAT-002",
        "location": "Digha Riverfront Colony",
        "state": "Bihar",
        "district": "Patna",
        "people_affected": 850,
        "people_trapped": 30,
        "injured": 18,
        "deaths": 1,
        "people_without_food": 450,
        "people_without_water": 500,
        "people_needing_shelter": 350,
        "serious_injuries": 6,
        "vulnerable_population": 120,
        "immediate_life_risk": "HIGH",
        "medical_emergency": "SEVERE",
        "medical_access": "LIMITED",
        "road_accessibility": "PARTIAL",
        "communication_status": "PARTIAL",
        "rescue_accessibility": "DIFFICULT",
        "critical_infrastructure": "MAJOR",
        "flood_duration_hours": 36.0
    },
    {
        "incident_id": "FL-PRY-003",
        "location": "Sangam Lowland Settlement",
        "state": "Uttar Pradesh",
        "district": "Prayagraj",
        "people_affected": 400,
        "people_trapped": 5,
        "injured": 4,
        "deaths": 0,
        "people_without_food": 150,
        "people_without_water": 180,
        "people_needing_shelter": 120,
        "serious_injuries": 1,
        "vulnerable_population": 45,
        "immediate_life_risk": "MEDIUM",
        "medical_emergency": "MODERATE",
        "medical_access": "LIMITED",
        "road_accessibility": "PARTIAL",
        "communication_status": "NORMAL",
        "rescue_accessibility": "DIFFICULT",
        "critical_infrastructure": "MINOR",
        "flood_duration_hours": 18.0
    },
    {
        "incident_id": "FL-KOL-004",
        "location": "Garden Reach Embankment",
        "state": "West Bengal",
        "district": "Kolkata",
        "people_affected": 700,
        "people_trapped": 25,
        "injured": 12,
        "deaths": 2,
        "people_without_food": 380,
        "people_without_water": 420,
        "people_needing_shelter": 290,
        "serious_injuries": 5,
        "vulnerable_population": 90,
        "immediate_life_risk": "HIGH",
        "medical_emergency": "SEVERE",
        "medical_access": "LIMITED",
        "road_accessibility": "BLOCKED",
        "communication_status": "PARTIAL",
        "rescue_accessibility": "DIFFICULT",
        "critical_infrastructure": "MAJOR",
        "flood_duration_hours": 28.0
    },
    {
        "incident_id": "FL-BBI-005",
        "location": "Daya Canal Margin",
        "state": "Odisha",
        "district": "Bhubaneswar",
        "people_affected": 150,
        "people_trapped": 0,
        "injured": 0,
        "deaths": 0,
        "people_without_food": 20,
        "people_without_water": 15,
        "people_needing_shelter": 10,
        "serious_injuries": 0,
        "vulnerable_population": 12,
        "immediate_life_risk": "LOW",
        "medical_emergency": "NONE",
        "medical_access": "AVAILABLE",
        "road_accessibility": "ACCESSIBLE",
        "communication_status": "NORMAL",
        "rescue_accessibility": "EASY",
        "critical_infrastructure": "NONE",
        "flood_duration_hours": 6.0
    }
]


def seed_database():
    """
    Ensures database tables exist and inserts initial synthetic demo incidents idempotently.
    """
    print("🌱 Initializing ReliefGrid SQLite database tables...")
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()
    try:
        inserted_count = 0
        skipped_count = 0

        for inc_data in SYNTHETIC_INCIDENTS:
            incident_id = inc_data["incident_id"]
            existing = db.query(FloodIncident).filter(FloodIncident.incident_id == incident_id).first()

            if existing:
                skipped_count += 1
                print(f"   [SKIPPED] Incident {incident_id} already exists in database.")
                continue

            # Run risk engine computation
            evaluation = evaluate_incident_risk(inc_data)

            # Build model record
            record_data = dict(inc_data)
            record_data.update(evaluation)

            db_record = FloodIncident(**record_data)
            db.add(db_record)
            db.commit()
            db.refresh(db_record)

            inserted_count += 1
            print(
                f"   [INSERTED] {incident_id} | Location: {db_record.location} ({db_record.district}) "
                f"| Risk Score: {db_record.risk_score} | Severity: {db_record.severity}"
            )

        print(f"\n✅ Seeding complete! {inserted_count} inserted, {skipped_count} skipped.")
    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding database: {e}", file=sys.stderr)
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
