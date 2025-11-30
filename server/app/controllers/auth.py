from flask import Blueprint, request
from ..extensions import db
from ..models import User
from ..utils.responses import api_response
from ..utils.security import hash_password, verify_password
from flask_jwt_extended import create_access_token
from datetime import timedelta, datetime
import os


import re

EMAIL_REGEX = r"^[\w\.-]+@[\w\.-]+\.\w+$"

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    """
    Register new user
    ---
    tags:
      - auth
    parameters:
      - in: body
        name: body
        schema:
          required:
            - email
            - password
          properties:
            email:
              type: string
            password:
              type: string
            confirmPassword:
              type: string
            first_name:
              type: string
            last_name:
              type: string
            dob:
              type: string
              example: "1990-01-01"
            gender:
              type: string
    responses:
      201:
        description: user created
      400:
        description: bad request
      409:
        description: conflict (email exists)
      500:
        description: Something went wrong!
    """
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return api_response(False, 400, "Email and password required")

    # Basic email validation
    if not re.match(EMAIL_REGEX, email):
        return api_response(False, 400, "Invalid email address format")

    if User.query.filter_by(email=email).first():
        return api_response(False, 409, "User already exists with this email")

    confirm_password = data.get("confirmPassword")
    if not confirm_password:
        return api_response(False, 400, "ConfirmPassword is required")
    if password != confirm_password:
        return api_response(False, 400, "Password and confirmPassword do not match")

    first_name = data.get("first_name")
    last_name = data.get("last_name")
    dob = data.get("dob")
    gender = data.get("gender")

    # Validate dob string if provided
    dob_val = None
    if dob:
        try:
            dob_val = datetime.strptime(dob, "%Y-%m-%d").date()
        except Exception:
            return api_response(False, 400, "Date of birth must be in YYYY-MM-DD format")

    try:
        user = User(
            email=email,
            password_hash=hash_password(password),
            first_name=first_name,
            last_name=last_name,
            dob=dob_val,
            gender=gender
        )
        db.session.add(user)
        db.session.commit()
        return api_response(True, 201, "User Created")
    except Exception as e:
        db.session.rollback()
        return api_response(False, 500, "Failed to create user", errors=str(e))

@auth_bp.route("/login", methods=["POST"])
def login():
    """
    Login user
    ---
    tags:
      - auth
    parameters:
      - in: body
        name: body
        schema:
          required: [email, password]
          properties:
            email:
              type: string
            password:
              type: string
    responses:
      200:
        description: login successful
      400:
        description: bad request
      401:
        description: invalid credentials
    """
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return api_response(False, 400, "Email and password required")

    user = User.query.filter_by(email=email).first()
    if not user or not verify_password(user.password_hash, password):
        return api_response(False, 401, "Invalid Credentials")

    access_token = create_access_token(identity=user.user_id)
    return api_response(True, 200, "Login successful", data={"access_token": access_token})
