from flask import Flask, jsonify
from .config import Config
from .extensions import db, jwt, migrate
import os


def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    #initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)


    @app.errorhandler(Exception)
    def handle_all_errors(e):
        # Generic 500 guard (log real errors in prod)
        return jsonify({"status":"error","code":500,"message":str(e)}), 500

    @app.get("/")
    def index():
        return jsonify({"status":"success","code":200,"message":"Health Tracker Backend running"}), 200

    return app