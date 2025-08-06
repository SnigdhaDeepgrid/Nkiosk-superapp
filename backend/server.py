from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timedelta
import random


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Analytics Models
class RevenueMetrics(BaseModel):
    date: str
    total_revenue: float
    tenant_count: int
    avg_revenue_per_tenant: float
    subscription_revenue: float
    transaction_revenue: float
    growth_rate: float

class UserBehaviorMetrics(BaseModel):
    date: str
    daily_active_users: int
    monthly_active_users: int
    session_duration_avg: float
    page_views: int
    feature_usage: Dict[str, int]
    login_frequency: Dict[str, int]
    user_retention_rate: float

class PerformanceMetrics(BaseModel):
    timestamp: datetime
    api_response_time: float
    error_rate: float
    uptime_percentage: float
    cpu_usage: float
    memory_usage: float
    database_connections: int
    active_sessions: int

class AnalyticsSummary(BaseModel):
    total_revenue: float
    revenue_growth: float
    total_users: int
    active_users: int
    conversion_rate: float
    churn_rate: float
    avg_session_duration: float
    system_uptime: float

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
