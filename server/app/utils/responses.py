from flask import jsonify

def api_response(success: bool, code: int, message: str = "", data=None, errors=None):
    body = {
        "success": success,
        "code": code,
        "message": message
    }
    if data is not None:
        body["data"] = data
    if errors is not None:
        body["errors"] = errors
    return jsonify(body), code
