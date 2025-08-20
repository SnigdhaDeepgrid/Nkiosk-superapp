from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
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
import jwt
from passlib.context import CryptContext


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT and Authentication Configuration
JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-here-change-in-production')
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_HOURS = 24

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# HTTP Bearer for token authentication
security = HTTPBearer()

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

# Authentication Models
class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str = "customer"
    phone: Optional[str] = None
    
class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    roleDisplay: str
    avatar: Optional[str] = None
    tenant: Optional[str] = None
    store: Optional[str] = None
    business: Optional[str] = None
    created_at: datetime

class LoginResponse(BaseModel):
    user: UserResponse
    token: str
    message: str

class TokenData(BaseModel):
    user_id: Optional[str] = None
    email: Optional[str] = None

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

# Super Admin Models
class BusinessUser(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str
    role: str  # store_manager, vendor, delivery_partner, support_staff
    status: str  # active, inactive, suspended
    outlet_id: Optional[str] = None
    permissions: List[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None

class BusinessOutlet(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    address: str
    city: str
    state: str
    zip_code: str
    phone: str
    email: str
    manager_id: Optional[str] = None
    business_hours: Dict[str, Dict[str, str]]  # {"monday": {"open": "09:00", "close": "18:00"}}
    status: str  # active, inactive, maintenance
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    category: str
    price: float
    cost: float
    sku: str
    barcode: Optional[str] = None
    images: List[str] = []
    status: str  # active, inactive, out_of_stock
    inventory_count: int = 0
    min_stock_level: int = 10
    outlet_ids: List[str] = []  # Available at these outlets
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Order(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    order_number: str
    customer_id: str
    customer_name: str
    customer_phone: str
    customer_email: str
    outlet_id: str
    items: List[Dict[str, Any]]  # [{"product_id": "...", "name": "...", "quantity": 2, "price": 10.99}]
    subtotal: float
    tax: float
    delivery_fee: float
    total: float
    status: str  # pending, confirmed, preparing, ready, out_for_delivery, delivered, cancelled, refunded
    payment_status: str  # pending, paid, refunded
    payment_method: str
    delivery_address: str
    delivery_partner_id: Optional[str] = None
    estimated_delivery: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class DeliveryPartner(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str
    vehicle_type: str  # bike, car, van
    license_number: str
    status: str  # active, inactive, on_delivery, offline
    current_location: Optional[Dict[str, float]] = None  # {"lat": 40.7128, "lng": -74.0060}
    rating: float = 5.0
    total_deliveries: int = 0
    active_orders: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Customer(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str
    addresses: List[Dict[str, Any]] = []
    total_orders: int = 0
    total_spent: float = 0.0
    loyalty_points: int = 0
    status: str = "active"  # active, inactive, banned
    preferences: Dict[str, Any] = {}
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_order_at: Optional[datetime] = None

class Promotion(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    type: str  # percentage, fixed_amount, buy_one_get_one, free_delivery
    value: float  # discount value
    min_order_amount: float = 0.0
    max_discount: Optional[float] = None
    code: str
    start_date: datetime
    end_date: datetime
    usage_limit: Optional[int] = None
    used_count: int = 0
    applicable_outlets: List[str] = []
    applicable_products: List[str] = []
    status: str = "active"  # active, inactive, expired
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AuditLog(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    user_name: str
    action: str
    resource_type: str  # user, product, order, outlet, etc.
    resource_id: str
    details: Dict[str, Any]
    ip_address: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# Helper function to generate mock analytics data
def generate_mock_revenue_data(days: int = 30) -> List[RevenueMetrics]:
    base_date = datetime.now() - timedelta(days=days)
    data = []
    
    for i in range(days):
        date = base_date + timedelta(days=i)
        # Simulate growing revenue with some fluctuation
        base_revenue = 15000 + (i * 200) + random.randint(-2000, 3000)
        tenant_count = 45 + random.randint(-5, 10)
        
        data.append(RevenueMetrics(
            date=date.strftime("%Y-%m-%d"),
            total_revenue=base_revenue,
            tenant_count=tenant_count,
            avg_revenue_per_tenant=base_revenue / tenant_count,
            subscription_revenue=base_revenue * 0.7,
            transaction_revenue=base_revenue * 0.3,
            growth_rate=random.uniform(0.02, 0.08)
        ))
    
    return data

def generate_mock_user_behavior_data(days: int = 30) -> List[UserBehaviorMetrics]:
    base_date = datetime.now() - timedelta(days=days)
    data = []
    
    for i in range(days):
        date = base_date + timedelta(days=i)
        dau = random.randint(1200, 2500)
        
        data.append(UserBehaviorMetrics(
            date=date.strftime("%Y-%m-%d"),
            daily_active_users=dau,
            monthly_active_users=dau * random.randint(8, 12),
            session_duration_avg=random.uniform(12.5, 25.8),
            page_views=dau * random.randint(4, 8),
            feature_usage={
                "dashboard": random.randint(800, 1500),
                "orders": random.randint(600, 1200),
                "analytics": random.randint(200, 500),
                "settings": random.randint(150, 400),
                "reports": random.randint(100, 300)
            },
            login_frequency={
                "daily": random.randint(40, 60),
                "weekly": random.randint(25, 35),
                "monthly": random.randint(15, 25)
            },
            user_retention_rate=random.uniform(0.75, 0.92)
        ))
    
    return data

def generate_mock_performance_data(hours: int = 24) -> List[PerformanceMetrics]:
    base_time = datetime.now() - timedelta(hours=hours)
    data = []
    
    for i in range(hours):
        timestamp = base_time + timedelta(hours=i)
        
        data.append(PerformanceMetrics(
            timestamp=timestamp,
            api_response_time=random.uniform(85, 250),
            error_rate=random.uniform(0.1, 2.5),
            uptime_percentage=random.uniform(99.2, 100.0),
            cpu_usage=random.uniform(15, 85),
            memory_usage=random.uniform(45, 78),
            database_connections=random.randint(12, 45),
            active_sessions=random.randint(150, 400)
        ))
    
    return data

# Analytics API endpoints
@api_router.get("/analytics/revenue", response_model=List[RevenueMetrics])
async def get_revenue_analytics(days: int = 30):
    """Get revenue analytics data for the specified number of days"""
    return generate_mock_revenue_data(days)

@api_router.get("/analytics/user-behavior", response_model=List[UserBehaviorMetrics])
async def get_user_behavior_analytics(days: int = 30):
    """Get user behavior analytics data"""
    return generate_mock_user_behavior_data(days)

@api_router.get("/analytics/performance", response_model=List[PerformanceMetrics])
async def get_performance_analytics(hours: int = 24):
    """Get system performance metrics"""
    return generate_mock_performance_data(hours)

@api_router.get("/analytics/summary", response_model=AnalyticsSummary)
async def get_analytics_summary():
    """Get consolidated analytics summary"""
    # Calculate summary from recent data
    revenue_data = generate_mock_revenue_data(7)  # Last 7 days
    behavior_data = generate_mock_user_behavior_data(7)
    performance_data = generate_mock_performance_data(24)  # Last 24 hours
    
    recent_revenue = sum([r.total_revenue for r in revenue_data[-7:]])
    previous_revenue = sum([r.total_revenue for r in revenue_data[-14:-7]]) if len(revenue_data) >= 14 else recent_revenue * 0.9
    
    return AnalyticsSummary(
        total_revenue=recent_revenue,
        revenue_growth=((recent_revenue - previous_revenue) / previous_revenue) * 100 if previous_revenue > 0 else 0,
        total_users=sum([b.monthly_active_users for b in behavior_data[-1:]]),
        active_users=sum([b.daily_active_users for b in behavior_data[-1:]]),
        conversion_rate=random.uniform(3.2, 8.7),
        churn_rate=random.uniform(2.1, 5.4),
        avg_session_duration=sum([b.session_duration_avg for b in behavior_data]) / len(behavior_data),
        system_uptime=sum([p.uptime_percentage for p in performance_data]) / len(performance_data)
    )

@api_router.get("/analytics/tenant-performance")
async def get_tenant_performance_analytics():
    """Get tenant-specific performance analytics"""
    # Mock tenant performance data
    tenants = [
        "QuickMart Downtown", "FreshGrocery Express", "PharmaCare Plus", 
        "TechZone Electronics", "Foodie Express Kitchen", "Urban Fashion Hub"
    ]
    
    tenant_data = []
    for tenant in tenants:
        tenant_data.append({
            "tenant_name": tenant,
            "monthly_revenue": random.randint(8000, 45000),
            "monthly_orders": random.randint(450, 2100),
            "avg_order_value": random.uniform(18.50, 67.80),
            "customer_count": random.randint(120, 890),
            "growth_rate": random.uniform(-5.2, 15.8),
            "satisfaction_score": random.uniform(4.1, 4.9)
        })
    
    return sorted(tenant_data, key=lambda x: x["monthly_revenue"], reverse=True)

@api_router.get("/analytics/geographic")
async def get_geographic_analytics():
    """Get geographic distribution analytics"""
    return {
        "revenue_by_region": [
            {"region": "North America", "revenue": 425000, "percentage": 42.5, "growth": 8.2},
            {"region": "Europe", "revenue": 298000, "percentage": 29.8, "growth": 12.1},
            {"region": "Asia Pacific", "revenue": 189000, "percentage": 18.9, "growth": 15.7},
            {"region": "South America", "revenue": 54000, "percentage": 5.4, "growth": 6.3},
            {"region": "Other", "revenue": 34000, "percentage": 3.4, "growth": -2.1}
        ],
        "top_cities": [
            {"city": "New York", "revenue": 87500, "tenants": 12},
            {"city": "London", "revenue": 76200, "tenants": 9},
            {"city": "Tokyo", "revenue": 65800, "tenants": 8},
            {"city": "San Francisco", "revenue": 58900, "tenants": 7},
            {"city": "Toronto", "revenue": 45600, "tenants": 6}
        ]
    }

# Super Admin API endpoints
def generate_mock_business_users():
    """Generate mock business users for Super Admin"""
    return [
        BusinessUser(
            id="usr_001",
            name="John Manager",
            email="john.manager@business.com",
            phone="+1-555-0101",
            role="store_manager",
            status="active",
            outlet_id="out_001",
            permissions=["manage_orders", "view_analytics", "manage_inventory"],
            last_login=datetime.now() - timedelta(hours=2)
        ),
        BusinessUser(
            id="usr_002", 
            name="Sarah Vendor",
            email="sarah@freshproduce.com",
            phone="+1-555-0102",
            role="vendor",
            status="active",
            permissions=["manage_products", "view_orders", "update_inventory"],
            last_login=datetime.now() - timedelta(hours=5)
        ),
        BusinessUser(
            id="usr_003",
            name="Mike Delivery",
            email="mike.driver@fastdelivery.com", 
            phone="+1-555-0103",
            role="delivery_partner",
            status="on_delivery",
            permissions=["view_deliveries", "update_delivery_status"],
            last_login=datetime.now() - timedelta(minutes=30)
        ),
        BusinessUser(
            id="usr_004",
            name="Lisa Support",
            email="lisa@customersupport.com",
            phone="+1-555-0104", 
            role="support_staff",
            status="active",
            permissions=["manage_tickets", "view_customers", "process_refunds"],
            last_login=datetime.now() - timedelta(hours=1)
        )
    ]

def generate_mock_outlets():
    """Generate mock outlet data"""
    return [
        BusinessOutlet(
            id="out_001",
            name="Downtown Store",
            address="123 Main Street",
            city="New York",
            state="NY", 
            zip_code="10001",
            phone="+1-555-0201",
            email="downtown@business.com",
            manager_id="usr_001",
            business_hours={
                "monday": {"open": "08:00", "close": "20:00"},
                "tuesday": {"open": "08:00", "close": "20:00"},
                "wednesday": {"open": "08:00", "close": "20:00"},
                "thursday": {"open": "08:00", "close": "20:00"},
                "friday": {"open": "08:00", "close": "22:00"},
                "saturday": {"open": "09:00", "close": "22:00"},
                "sunday": {"open": "10:00", "close": "18:00"}
            },
            status="active"
        ),
        BusinessOutlet(
            id="out_002", 
            name="Mall Branch",
            address="456 Shopping Center Blvd",
            city="New York",
            state="NY",
            zip_code="10002",
            phone="+1-555-0202",
            email="mall@business.com",
            business_hours={
                "monday": {"open": "10:00", "close": "21:00"},
                "tuesday": {"open": "10:00", "close": "21:00"},
                "wednesday": {"open": "10:00", "close": "21:00"},
                "thursday": {"open": "10:00", "close": "21:00"},
                "friday": {"open": "10:00", "close": "22:00"},
                "saturday": {"open": "10:00", "close": "22:00"},
                "sunday": {"open": "11:00", "close": "19:00"}
            },
            status="active"
        )
    ]

def generate_mock_products():
    """Generate mock product data"""
    return [
        Product(
            id="prd_001",
            name="Organic Apples",
            description="Fresh organic red apples, locally sourced",
            category="Fruits",
            price=3.99,
            cost=2.50,
            sku="ORG-APL-001",
            barcode="1234567890123",
            status="active",
            inventory_count=150,
            min_stock_level=20,
            outlet_ids=["out_001", "out_002"]
        ),
        Product(
            id="prd_002",
            name="Whole Wheat Bread",
            description="Fresh baked whole wheat bread",
            category="Bakery", 
            price=4.50,
            cost=2.00,
            sku="WWB-001",
            status="active",
            inventory_count=45,
            min_stock_level=10,
            outlet_ids=["out_001"]
        ),
        Product(
            id="prd_003",
            name="Premium Coffee Beans",
            description="Arabica coffee beans, medium roast",
            category="Beverages",
            price=12.99,
            cost=7.50,
            sku="COF-ARB-001",
            status="active",
            inventory_count=8,
            min_stock_level=15,
            outlet_ids=["out_001", "out_002"]
        )
    ]

def generate_mock_orders():
    """Generate mock order data"""
    return [
        Order(
            id="ord_001",
            order_number="ORD-2024-001",
            customer_id="cust_001",
            customer_name="Alice Johnson",
            customer_phone="+1-555-1001", 
            customer_email="alice@email.com",
            outlet_id="out_001",
            items=[
                {"product_id": "prd_001", "name": "Organic Apples", "quantity": 3, "price": 3.99},
                {"product_id": "prd_002", "name": "Whole Wheat Bread", "quantity": 2, "price": 4.50}
            ],
            subtotal=21.97,
            tax=1.76,
            delivery_fee=3.99,
            total=27.72,
            status="delivered",
            payment_status="paid",
            payment_method="credit_card",
            delivery_address="789 Customer St, New York, NY 10003",
            delivery_partner_id="usr_003",
            created_at=datetime.now() - timedelta(days=2)
        ),
        Order(
            id="ord_002",
            order_number="ORD-2024-002", 
            customer_id="cust_002",
            customer_name="Bob Smith",
            customer_phone="+1-555-1002",
            customer_email="bob@email.com",
            outlet_id="out_001",
            items=[
                {"product_id": "prd_003", "name": "Premium Coffee Beans", "quantity": 1, "price": 12.99}
            ],
            subtotal=12.99,
            tax=1.04,
            delivery_fee=3.99,
            total=18.02,
            status="out_for_delivery",
            payment_status="paid", 
            payment_method="digital_wallet",
            delivery_address="321 Another St, New York, NY 10004",
            delivery_partner_id="usr_003",
            estimated_delivery=datetime.now() + timedelta(minutes=45),
            created_at=datetime.now() - timedelta(hours=3)
        )
    ]


# Authentication Utility Functions
def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=JWT_EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> dict:
    """Decode and verify a JWT token"""
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get the current authenticated user from JWT token"""
    token = credentials.credentials
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    email = payload.get("sub")
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")
        
    # Get user from mock data for now
    user = get_mock_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user

def get_mock_user_by_email(email: str) -> Optional[dict]:
    """Get mock user data by email"""
    mock_users = {
        'admin@saas.com': {
            'id': '1',
            'name': 'John Smith',
            'email': 'admin@saas.com',
            'role': 'saas_admin',
            'roleDisplay': 'SaaS Admin',
            'avatar': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            'created_at': datetime.utcnow()
        },
        'superadmin@tenant1.com': {
            'id': '2',
            'name': 'Sarah Johnson',
            'email': 'superadmin@tenant1.com',
            'role': 'super_admin',
            'roleDisplay': 'Super Admin',
            'tenant': 'QuickMart',
            'avatar': 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
            'created_at': datetime.utcnow()
        },
        'manager@store1.com': {
            'id': '3',
            'name': 'Mike Davis',
            'email': 'manager@store1.com',
            'role': 'store_manager',
            'roleDisplay': 'Store Manager',
            'store': 'Downtown QuickMart',
            'avatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            'created_at': datetime.utcnow()
        },
        'vendor@foodie.com': {
            'id': '4',
            'name': 'Lisa Chen',
            'email': 'vendor@foodie.com',
            'role': 'vendor',
            'roleDisplay': 'Vendor',
            'business': 'Foodie Express',
            'avatar': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
            'created_at': datetime.utcnow()
        },
        'delivery@fast.com': {
            'id': '5',
            'name': 'Carlos Rodriguez',
            'email': 'delivery@fast.com',
            'role': 'delivery_partner',
            'roleDisplay': 'Delivery Partner',
            'avatar': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
            'created_at': datetime.utcnow()
        },
        'customer@email.com': {
            'id': '6',
            'name': 'Emma Wilson',
            'email': 'customer@email.com',
            'role': 'customer',
            'roleDisplay': 'Customer',
            'avatar': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
            'created_at': datetime.utcnow()
        },
        'support@help.com': {
            'id': '7',
            'name': 'David Kim',
            'email': 'support@help.com',
            'role': 'support_staff',
            'roleDisplay': 'Support Staff',
            'avatar': 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face',
            'created_at': datetime.utcnow()
        }
    }
    return mock_users.get(email)

# Authentication API Endpoints
@api_router.post("/auth/login", response_model=LoginResponse)
async def login(user_login: UserLogin):
    """Authenticate user and return JWT token"""
    user_data = get_mock_user_by_email(user_login.email)
    
    if not user_data:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # For demo purposes, accept password123 for all users
    if user_login.password != "password123":
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Create access token
    token = create_access_token(data={"sub": user_data["email"], "role": user_data["role"]})
    
    # Prepare user response
    user_response = UserResponse(
        id=user_data["id"],
        name=user_data["name"],
        email=user_data["email"],
        role=user_data["role"],
        roleDisplay=user_data["roleDisplay"],
        avatar=user_data.get("avatar"),
        tenant=user_data.get("tenant"),
        store=user_data.get("store"),
        business=user_data.get("business"),
        created_at=user_data["created_at"]
    )
    
    return LoginResponse(
        user=user_response,
        token=token,
        message=f"Successfully logged in as {user_data['roleDisplay']}"
    )

@api_router.post("/auth/register", response_model=dict)
async def register(user_create: UserCreate):
    """Register a new user"""
    # Check if user already exists
    if get_mock_user_by_email(user_create.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # For demo purposes, just return success message
    # In real app, would hash password and save to database
    return {
        "message": "User registered successfully",
        "user": {
            "id": str(uuid.uuid4()),
            "name": user_create.name,
            "email": user_create.email,
            "role": user_create.role
        }
    }

@api_router.get("/auth/profile", response_model=UserResponse)
async def get_profile(current_user: dict = Depends(get_current_user)):
    """Get current user profile"""
    return UserResponse(
        id=current_user["id"],
        name=current_user["name"],
        email=current_user["email"],
        role=current_user["role"],
        roleDisplay=current_user["roleDisplay"],
        avatar=current_user.get("avatar"),
        tenant=current_user.get("tenant"),
        store=current_user.get("store"),
        business=current_user.get("business"),
        created_at=current_user["created_at"]
    )

@api_router.post("/auth/logout")
async def logout():
    """Logout user (token-based, so just return success)"""
    return {"message": "Successfully logged out"}

@api_router.post("/auth/refresh")
async def refresh_token(current_user: dict = Depends(get_current_user)):
    """Refresh JWT token"""
    token = create_access_token(data={"sub": current_user["email"], "role": current_user["role"]})
    return {"token": token, "message": "Token refreshed successfully"}

@api_router.post("/auth/forgot-password")
async def forgot_password(email_data: dict):
    """Initiate password reset (mock implementation)"""
    email = email_data.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
    
    # For demo purposes, just return success message
    return {"message": "Password reset link sent to your email"}

# Role-based Dashboard Access Endpoints
@api_router.get("/dashboard/saas-admin")
async def get_saas_admin_dashboard(current_user: dict = Depends(get_current_user)):
    """Get SaaS Admin dashboard data"""
    if current_user["role"] != "saas_admin":
        raise HTTPException(status_code=403, detail="Access denied: SaaS Admin role required")
    
    return {
        "dashboard": "saas_admin",
        "user": current_user,
        "data": {
            "total_tenants": 156,
            "active_subscriptions": 142,
            "monthly_revenue": 45670.89,
            "recent_signups": 23
        }
    }

@api_router.get("/dashboard/super-admin")
async def get_super_admin_dashboard(current_user: dict = Depends(get_current_user)):
    """Get Super Admin dashboard data"""
    if current_user["role"] != "super_admin":
        raise HTTPException(status_code=403, detail="Access denied: Super Admin role required")
    
    return {
        "dashboard": "super_admin",
        "user": current_user,
        "data": {
            "total_outlets": 12,
            "total_products": 1456,
            "pending_orders": 23,
            "monthly_sales": 123456.78
        }
    }

@api_router.get("/dashboard/store-manager")
async def get_store_manager_dashboard(current_user: dict = Depends(get_current_user)):
    """Get Store Manager dashboard data"""
    if current_user["role"] != "store_manager":
        raise HTTPException(status_code=403, detail="Access denied: Store Manager role required")
    
    return {
        "dashboard": "store_manager",
        "user": current_user,
        "data": {
            "store_sales": 12345.67,
            "inventory_alerts": 8,
            "staff_count": 15,
            "daily_visitors": 234
        }
    }

@api_router.get("/dashboard/vendor")
async def get_vendor_dashboard(current_user: dict = Depends(get_current_user)):
    """Get Vendor dashboard data"""
    if current_user["role"] != "vendor":
        raise HTTPException(status_code=403, detail="Access denied: Vendor role required")
    
    return {
        "dashboard": "vendor",
        "user": current_user,
        "data": {
            "product_listings": 89,
            "pending_orders": 12,
            "monthly_earnings": 8765.43,
            "inventory_value": 23456.78
        }
    }

@api_router.get("/dashboard/delivery-partner")
async def get_delivery_partner_dashboard(current_user: dict = Depends(get_current_user)):
    """Get Delivery Partner dashboard data"""
    if current_user["role"] != "delivery_partner":
        raise HTTPException(status_code=403, detail="Access denied: Delivery Partner role required")
    
    return {
        "dashboard": "delivery_partner",
        "user": current_user,
        "data": {
            "active_deliveries": 3,
            "completed_today": 12,
            "earnings_today": 156.75,
            "rating": 4.8
        }
    }

@api_router.get("/dashboard/customer")
async def get_customer_dashboard(current_user: dict = Depends(get_current_user)):
    """Get Customer dashboard data"""
    if current_user["role"] != "customer":
        raise HTTPException(status_code=403, detail="Access denied: Customer role required")
    
    return {
        "dashboard": "customer",
        "user": current_user,
        "data": {
            "recent_orders": 5,
            "favorite_stores": 3,
            "loyalty_points": 1250,
            "saved_addresses": 2
        }
    }

@api_router.get("/dashboard/support-staff")
async def get_support_staff_dashboard(current_user: dict = Depends(get_current_user)):
    """Get Support Staff dashboard data"""
    if current_user["role"] != "support_staff":
        raise HTTPException(status_code=403, detail="Access denied: Support Staff role required")
    
    return {
        "dashboard": "support_staff",
        "user": current_user,
        "data": {
            "open_tickets": 23,
            "resolved_today": 15,
            "avg_response_time": "2.5 hours",
            "customer_satisfaction": 4.7
        }
    }


# Super Admin User Management APIs
@api_router.get("/super-admin/users", response_model=List[BusinessUser])
async def get_business_users():
    """Get all business users for Super Admin"""
    return generate_mock_business_users()

@api_router.post("/super-admin/users", response_model=BusinessUser)
async def create_business_user(user: BusinessUser):
    """Create a new business user"""
    # Mock creation - in real app would save to database
    user.id = str(uuid.uuid4())
    user.created_at = datetime.utcnow()
    return user

@api_router.put("/super-admin/users/{user_id}", response_model=BusinessUser)
async def update_business_user(user_id: str, user_data: BusinessUser):
    """Update a business user"""
    user_data.id = user_id
    return user_data

@api_router.delete("/super-admin/users/{user_id}")
async def delete_business_user(user_id: str):
    """Delete a business user"""
    return {"message": f"User {user_id} deleted successfully"}

# Outlet Management APIs
@api_router.get("/super-admin/outlets", response_model=List[BusinessOutlet])
async def get_outlets():
    """Get all business outlets"""
    return generate_mock_outlets()

@api_router.post("/super-admin/outlets", response_model=BusinessOutlet)
async def create_outlet(outlet: BusinessOutlet):
    """Create a new outlet"""
    outlet.id = str(uuid.uuid4())
    outlet.created_at = datetime.utcnow()
    return outlet

@api_router.put("/super-admin/outlets/{outlet_id}", response_model=BusinessOutlet)
async def update_outlet(outlet_id: str, outlet_data: BusinessOutlet):
    """Update an outlet"""
    outlet_data.id = outlet_id
    return outlet_data

# Product Management APIs  
@api_router.get("/super-admin/products", response_model=List[Product])
async def get_products():
    """Get all products"""
    return generate_mock_products()

@api_router.post("/super-admin/products", response_model=Product)
async def create_product(product: Product):
    """Create a new product"""
    product.id = str(uuid.uuid4())
    product.created_at = datetime.utcnow()
    return product

@api_router.put("/super-admin/products/{product_id}", response_model=Product)
async def update_product(product_id: str, product_data: Product):
    """Update a product"""
    product_data.id = product_id
    return product_data

@api_router.delete("/super-admin/products/{product_id}")
async def delete_product(product_id: str):
    """Delete a product"""
    return {"message": f"Product {product_id} deleted successfully"}

# Order Management APIs
@api_router.get("/super-admin/orders", response_model=List[Order])
async def get_orders(status: Optional[str] = None, outlet_id: Optional[str] = None):
    """Get all orders with optional filtering"""
    orders = generate_mock_orders()
    if status:
        orders = [order for order in orders if order.status == status]
    if outlet_id:
        orders = [order for order in orders if order.outlet_id == outlet_id]
    return orders

@api_router.put("/super-admin/orders/{order_id}/status")
async def update_order_status(order_id: str, status: str, delivery_partner_id: Optional[str] = None):
    """Update order status"""
    return {"message": f"Order {order_id} status updated to {status}"}

# Business Analytics APIs
@api_router.get("/super-admin/analytics/dashboard")
async def get_business_dashboard():
    """Get business analytics dashboard data"""
    return {
        "total_revenue": 45678.90,
        "revenue_growth": 12.5,
        "total_orders": 1234,
        "pending_orders": 23,
        "active_customers": 567,
        "top_products": [
            {"name": "Organic Apples", "sales": 450, "revenue": 1795.50},
            {"name": "Premium Coffee", "sales": 120, "revenue": 1558.80},
            {"name": "Whole Wheat Bread", "sales": 230, "revenue": 1035.00}
        ],
        "sales_by_outlet": [
            {"outlet_name": "Downtown Store", "sales": 28900.50, "orders": 789},
            {"outlet_name": "Mall Branch", "sales": 16778.40, "orders": 445}
        ],
        "recent_orders": generate_mock_orders()[:5]
    }

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
