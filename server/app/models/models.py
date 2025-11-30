from ..extensions import db
from datetime import date
import string
import random

class User(db.Model):
    __tablename__ = "users"

    def generate_user_id():
        return ''.join(random.choices(string.ascii_lowercase + string.digits, k=12))

    user_id = db.Column(db.String(20), primary_key=True, default=generate_user_id, unique=True, nullable=False)
    first_name = db.Column(db.String(120), nullable=True)
    last_name = db.Column(db.String(120), nullable=True)
    dob = db.Column(db.Date, nullable=True)
    gender = db.Column(db.String(20), nullable=True)
    email = db.Column(db.String(150), nullable=False, unique=True, index=True)
    password_hash = db.Column(db.String(255), nullable=False)

    logs = db.relationship("DailyLog", backref="user", cascade="all, delete-orphan")
    insights = db.relationship("Insight", backref="user", cascade="all, delete-orphan")

class DailyLog(db.Model):
    __tablename__ = "daily_logs"
    log_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.String(20), db.ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, index=True)
    date = db.Column(db.Date, nullable=False, default=date.today, index=True)
    steps = db.Column(db.Integer, nullable=True)
    sleep_hours = db.Column(db.Float, nullable=True)
    water_liters = db.Column(db.Float, nullable=True)
    calories = db.Column(db.Integer, nullable=True)
    avg_heart_rate = db.Column(db.Integer, nullable=True)
    energy_level = db.Column(db.Integer, nullable=True)  # 1-5
    __table_args__ = (db.UniqueConstraint("user_id", "date", name="uq_user_date"),)


class Insight(db.Model):
    __tablename__ = "insights"
    insight_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.String(20), db.ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, index=True)
    date = db.Column(db.Date, nullable=False)
    insight_text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.Date, server_default=db.func.current_date(), nullable=False)