import sys
import os

# Ensure backend directory is in sys.path so 'app.*' modules resolve on Vercel Serverless
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.main import app
