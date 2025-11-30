from flask import Flask, jsonify
from .config import Config
from .extensions import db, jwt, migrate,swagger
import os
from .controllers import auth_bp, logs_bp


def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    #initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    swagger.init_app(app)  # initialize flasgger

    # create tables
    with app.app_context():
        from . import models 
        db.create_all()

    
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(logs_bp, url_prefix="/api")

    @app.errorhandler(Exception)
    def handle_all_errors(e):
        # Generic 500 guard (log real errors in prod)
        code = getattr(e, "code", 500)
        return jsonify({"success": False, "code": code, "message": str(e)}), code

    @app.get("/")
    def index():
        return jsonify({"status":"success","code":200,"message":"Health Tracker Backend running"}), 200

    return app