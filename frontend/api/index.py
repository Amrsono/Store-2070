from fastapi import FastAPI
import sys
import os

# Add backend directory to sys.path
current_dir = os.path.dirname(__file__)
backend_dir = os.path.join(current_dir, '../backend_core')
sys.path.append(backend_dir)

from main import app
