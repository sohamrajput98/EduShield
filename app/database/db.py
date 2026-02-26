import sqlite3
from datetime import datetime

DB_PATH = "app/database/edushield.db"


# Initialize database
def init_db():
    conn = sqlite3.connect(DB_PATH)

    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email_hash TEXT,
            risk_score REAL,
            label TEXT,
            timestamp TEXT
        )
    """)

    conn.commit()
    conn.close()


def save_prediction(email_hash, risk_score, label):

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO predictions (
            email_hash,
            risk_score,
            label,
            timestamp
        ) VALUES (?, ?, ?, ?)
    """, (
        email_hash,
        risk_score,
        label,
        datetime.now().isoformat()
    ))

    conn.commit()
    conn.close()