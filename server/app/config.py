import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    #Database
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    #JWT
    SECRET_KEY = os.environ.get("SECRET_KEY")
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
    JWT_ACCESS_TOKEN_EXPIRES = int(os.environ.get("JWT_EXP_SECONDS", 60*60*12))  # default 12 hours