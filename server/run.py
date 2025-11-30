import sys
import os
from pathlib import Path

# Set pycache prefix to root directory before any imports
server_root = Path(__file__).parent
sys.pycache_prefix = str(server_root / "__pycache__")

from app import create_app
from dotenv import load_dotenv

load_dotenv()

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=os.environ.get("SERVER_PORT"))