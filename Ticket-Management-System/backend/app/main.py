from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from . import models
from .routers import admin, auth, tickets


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Mini Helpdesk API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(tickets.router)
app.include_router(admin.router)


@app.get("/")
def root():
    return {
        "message": "Mini Helpdesk API is running"
    }