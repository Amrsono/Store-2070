from fastapi import FastAPI
from strawberry.fastapi import GraphQLRouter
from schema import schema
from database import Base, engine
import models
from seed import seed_db

# Create database tables
models.Base.metadata.create_all(bind=engine)
seed_db()

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Store 2070 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True, 
    allow_methods=["*"], 
    allow_headers=["*"],
)

graphql_app = GraphQLRouter(schema)

app.include_router(graphql_app, prefix="/graphql")

@app.get("/")
def read_root():
    return {"message": "Welcome to Store 2070 Quantum API"}

@app.post("/seed")
def seed_data():
    seed_db()
    return {"message": "Database seeded successfully"}
