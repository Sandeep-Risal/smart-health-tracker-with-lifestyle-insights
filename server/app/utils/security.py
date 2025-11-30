from werkzeug.security import generate_password_hash, check_password_hash

def hash_password(plain: str) -> str:
    return generate_password_hash(plain)

def verify_password(hash_: str, plain: str) -> bool:
    return check_password_hash(hash_, plain)
