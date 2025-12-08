from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..utils.responses import api_response
from ..services.persistance import add_or_update_log, fetch_logs, fetch_insights
from ..services.mining import perform_mining_for_user
from ..models import User

from datetime import datetime, date

logs_bp = Blueprint("logs", __name__)

@logs_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    """
    Get the profile of the currently authenticated user
    ---
    parameters:
      - in: header
        name: Authorization
        required: true
    tags:
      - users
    responses:
      200:
        description: User profile fetched successfully
      404:
        description: User not found
      500:
        description: Server error
    """
    user_id = get_jwt_identity()
    try:
        # Lazy import to avoid circular import issues
        user = User.query.filter_by(user_id=user_id).first()
        if not user:
            return api_response(False, 404, "User not found")

        user_data = {
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "dob": user.dob.isoformat() if user.dob else None,
            "gender": user.gender,
        }
        return api_response(True, 200, "User profile fetched successfully", data=user_data)
    except Exception as e:
        return api_response(False, 500, "Failed to fetch user profile", errors=str(e))


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
        log_date = datetime.strptime(date_str, "%Y-%m-%d").date() if date_str else date.today()
        if log_date < date.today():
            return api_response(False, 400, "Date cannot be in the past")
    except Exception as e:
        print("error",e)
        return api_response(False, 400, "Invalid date format; expected YYYY-MM-DD", errors=str(e))

    try:
        log = add_or_update_log(user_id, log_date, payload)
        print("log",log.__dict__)
        return api_response(True, 200, "Log saved successfully")
    except Exception as e:
        print("error",e)
        return api_response(False, 500, "Failed to save log", errors=str(e))

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
      - in: query
        name: date
        type: string
        required: false
        description: Optional date to fetch insights. Defaults to today if not provided.
        example: "2025-12-03"
    responses:
      200:
        description: insights fetched
    """
    user_id = get_jwt_identity()
    date_str = request.args.get("date")
    try:
        target_date = datetime.strptime(date_str, "%Y-%m-%d").date() if date_str else date.today()
    except Exception as e:
        return api_response(False, 400, "Invalid date format; expected YYYY-MM-DD", errors=str(e))

    try:
        insights = fetch_insights(user_id, date=target_date)
        out = [{
            "insight_id": i.insight_id, 
            "date": i.date.isoformat(), 
            "insight_text": i.insight_text,
            "status": i.status if hasattr(i, 'status') else "neutral"
        } for i in insights]
        return api_response(True, 200, "Insights fetched successfully", data=out)
    except Exception as e:
        return api_response(False, 500, "Failed to fetch insights", errors=str(e))

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
      - in: body
        name: body
        schema:
          properties:
            date:
              type: string
              example: "2025-12-03"
              description: Optional date to mine. Defaults to today if not provided.
    responses:
      200:
        description: mining completed
    """
    user_id = get_jwt_identity()
    payload = request.get_json() or {}
    date_str = payload.get("date")
    
    try:
        target_date = datetime.strptime(date_str, "%Y-%m-%d").date() if date_str else date.today()
    except Exception as e:
        return api_response(False, 400, "Invalid date format; expected YYYY-MM-DD", errors=str(e))
    
    try:
        written = perform_mining_for_user(user_id, target_date)
        return api_response(True, 200, "Mining completed successfully", data={"insights": written})
    except Exception as e:
        return api_response(False, 500, "Mining failed", errors=str(e))
    