from fastapi import FastAPI
from strawberry.fastapi import GraphQLRouter
from fastapi.middleware.cors import CORSMiddleware
import sys
import os

# Add backend directory to sys.path
current_dir = os.path.dirname(__file__)
backend_dir = os.path.join(current_dir, '../backend_core')
sys.path.append(backend_dir)

from schema import schema
import models
from database import engine

# Ensure DB tables exist (lightweight check, usually done in build/migration but harmless here)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(docs_url=None, redoc_url=None)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

graphql_app = GraphQLRouter(schema)
app.include_router(graphql_app, prefix="") # Serve at root of /api/graphql

# Vercel entrypoint
# No need for special handler, Vercel picks up 'app'
