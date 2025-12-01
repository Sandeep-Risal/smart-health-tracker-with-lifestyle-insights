from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..utils.responses import api_response
from ..services.persistance import add_or_update_log, fetch_logs, fetch_insights
from ..services.mining import perform_mining_for_user
from datetime import datetime, date

logs_bp = Blueprint("logs", __name__)

@logs_bp.route("/logs", methods=["POST"])
@jwt_required()
def create_or_update_log():
    """
    Upsert a daily log for authenticated user
    ---
    tags:
      - logs
    parameters:
      - in: header
        name: Authorization
        required: true
      - in: body
        name: body
        schema:
          properties:
            date:
              type: string
              example: "2025-09-12"
            steps:
              type: integer
            sleep_hours:
              type: number
            water_liters:
              type: number
            calories:
              type: integer
            avg_heart_rate:
              type: integer
            energy_level:
              type: integer
    responses:
      200:
        description: log saved
      400:
        description: invalid data
      500:
        description: server error
    """
    user_id = get_jwt_identity()
    payload = request.get_json() or {}
    date_str = payload.get("date")
    try:
        if log_date < date.today():
            raise ValueError("Date cannot be in the past")
        log_date = datetime.strptime(date_str, "%Y-%m-%d").date() if date_str else date.today()
    except Exception:
        return api_response(False, 400, "Invalid date format; expected YYYY-MM-DD")

    try:
        log = add_or_update_log(user_id, log_date, payload)
        
        return api_response(True, 200, "log saved", data={
            "log_id": log.log_id,
            "user_id": log.user_id,
            "date": str(log.date),
            # "log_data": updated_log
        })
    except Exception as e:
        return api_response(False, 500, "failed to save log", errors=str(e))

@logs_bp.route("/logs", methods=["GET"])
@jwt_required()
def get_user_logs():
    """
    Get logs for user (optionally start/end query)
    ---
    tags: [logs]
    parameters:
      - in: header
        name: Authorization
        required: true
      - name: start
        in: query
        type: string
      - name: end
        in: query
        type: string
    responses:
      200:
        description: logs fetched
    """
    user_id = get_jwt_identity()
    start = request.args.get("start")
    end = request.args.get("end")
    try:
        start_date = datetime.strptime(start, "%Y-%m-%d").date() if start else None
        end_date = datetime.strptime(end, "%Y-%m-%d").date() if end else None
    except Exception:
        return api_response(False, 400, "Invalid date parameter; expected YYYY-MM-DD")

    try:
        logs = fetch_logs(user_id, start_date, end_date)
        out = []
        for l in logs:
            out.append({
                "log_id": l.log_id,
                "date": l.date.isoformat(),
                "steps": l.steps,
                "sleep_hours": l.sleep_hours,
                "water_liters": l.water_liters,
                "calories": l.calories,
                "avg_heart_rate": l.avg_heart_rate,
                "energy_level": l.energy_level
            })
        return api_response(True, 200, "logs fetched", data=out)
    except Exception as e:
        return api_response(False, 500, "failed to fetch logs", errors=str(e))

@logs_bp.route("/insights", methods=["GET"])
@jwt_required()
def get_user_insights():
    """
    Get insights for authenticated user
    ---
    tags: [insights]
    parameters:
      - in: header
        name: Authorization
        required: true
    responses:
      200:
        description: insights fetched
    """
    user_id = get_jwt_identity()
    try:
        insights = fetch_insights(user_id)
        out = [{"insight_id": i.insight_id, "date": i.date.isoformat(), "insight_text": i.insight_text} for i in insights]
        return api_response(True, 200, "insights fetched", data=out)
    except Exception as e:
        return api_response(False, 500, "failed to fetch insights", errors=str(e))

@logs_bp.route("/mine", methods=["POST"])
@jwt_required()
def run_mining():
    """
    Trigger data mining for current user. Writes insights to DB.
    ---
    tags: [mining]
    parameters:
      - in: header
        name: Authorization
        required: true
    responses:
      200:
        description: mining completed
    """
    user_id = get_jwt_identity()
    try:
        written = mining.perform_mining_for_user(user_id)
        return api_response(True, 200, "mining completed", data={"insights_written": len(written), "insights": written})
    except Exception as e:
        return api_response(False, 500, "mining failed", errors=str(e))