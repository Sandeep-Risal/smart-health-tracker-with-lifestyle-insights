from ..models import DailyLog, Insight
from ..extensions import db
from datetime import date

def add_or_update_log(user_id:int, log_date:date, payload:dict):
    log = DailyLog.query.filter_by(user_id=user_id, date=log_date).first()
    if not log:
        log = DailyLog(user_id=user_id, date=log_date)

    for k in ["steps", "sleep_hours", "water_liters", "calories", "avg_heart_rate", "energy_level"]:
        if k in payload:
            setattr(log, k, payload.get(k))
    db.session.add(log)
    db.session.commit()
    return log

def fetch_logs(user_id:int, start_date=None, end_date=None):
    q = DailyLog.query.filter_by(user_id=user_id)
    if start_date:
        q = q.filter(DailyLog.date >= start_date)
    if end_date:
        q = q.filter(DailyLog.date <= end_date)
    return q.order_by(DailyLog.date.desc()).all()

def upsert_insight(user_id:int, dt:date, text:str):
    ins = Insight.query.filter_by(user_id=user_id, date=dt).first()
    if ins:
        ins.insight_text = text
    else:
        ins = Insight(user_id=user_id, date=dt, insight_text=text)
    db.session.add(ins)
    db.session.commit()
    return ins

def fetch_insights(user_id:int, date=None, limit=50):
    if date:
        return Insight.query.filter_by(user_id=user_id, date=date).order_by(Insight.date.desc()).limit(limit).all()
    else:
        return Insight.query.filter_by(user_id=user_id).order_by(Insight.date.desc()).limit(limit).all()
