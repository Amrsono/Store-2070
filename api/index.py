from fastapi import FastAPI
import sys
import os

# Add backend directory to sys.path so imports work as if running from backend/
current_dir = os.path.dirname(__file__)
backend_dir = os.path.join(current_dir, '../backend')
sys.path.append(backend_dir)

from main import app
