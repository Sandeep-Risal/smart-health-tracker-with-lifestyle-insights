from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..utils.responses import api_response
# from ..services.persistence import add_or_update_log, fetch_logs, fetch_insights
# from ..services import mining
from datetime import datetime, date

logs_bp = Blueprint("logs", __name__)
