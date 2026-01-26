from fastapi import FastAPI, APIRouter, HTTPException, Response, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from io import BytesIO
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT
import jwt
import bcrypt


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# JWT Settings
JWT_SECRET = os.environ.get('JWT_SECRET', 'pvc-oferta-secret-key-2024')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24 * 7  # 7 days

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()


# ==================== AUTH MODELS ====================

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    password_hash: str
    company_name: str
    phone: str
    is_active: bool = False  # Activated by admin after payment
    is_admin: bool = False
    subscription_start: Optional[datetime] = None
    subscription_end: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserRegister(BaseModel):
    email: str
    password: str
    company_name: str
    phone: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    company_name: str
    phone: str
    is_active: bool
    is_admin: bool
    subscription_start: Optional[str] = None
    subscription_end: Optional[str] = None
    created_at: str

class UserActivate(BaseModel):
    is_active: bool
    months: int = 1  # How many months to activate


# ==================== EXISTING MODELS ====================

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Product Types
class WindowType(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: Optional[str] = None  # None = global, otherwise user's custom product
    name: str
    code: str
    opening_type: str
    panels: int
    base_price_per_sqm: float
    description: Optional[str] = None
    image_url: Optional[str] = None
    is_custom: bool = False

class WindowTypeCreate(BaseModel):
    name: str
    code: str
    opening_type: str = "fixed"
    panels: int = 1
    base_price_per_sqm: float
    description: Optional[str] = None
    image_url: Optional[str] = None

class DoorType(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: Optional[str] = None
    name: str
    code: str
    door_style: str
    base_price_per_sqm: float
    description: Optional[str] = None
    image_url: Optional[str] = None
    is_custom: bool = False

class DoorTypeCreate(BaseModel):
    name: str
    code: str
    door_style: str = "standard"
    base_price_per_sqm: float
    description: Optional[str] = None
    image_url: Optional[str] = None

class Profile(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    brand: str
    width_mm: int
    insulation_coefficient: float
    price_multiplier: float
    description: Optional[str] = None

class GlassType(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    layers: int
    u_value: float
    price_per_sqm: float
    description: Optional[str] = None

class Color(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    code: str
    hex_color: str
    price_multiplier: float

class Hardware(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    brand: str
    type: str
    price: float

# Customer - now with user_id for multi-tenancy
class Customer(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str  # Owner of this customer
    name: str
    company: Optional[str] = None
    phone: str
    email: Optional[str] = None
    address: str
    city: str
    discount_percent: float = 0.0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CustomerCreate(BaseModel):
    name: str
    company: Optional[str] = None
    phone: str
    email: Optional[str] = None
    address: str
    city: str
    discount_percent: float = 0.0

# Offer Item
class OfferItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    product_type: str
    product_type_id: str
    product_name: str
    width_cm: float
    height_cm: float
    quantity: int
    profile_id: str
    profile_name: str
    glass_id: str
    glass_name: str
    color_id: str
    color_name: str
    hardware_id: Optional[str] = None
    hardware_name: Optional[str] = None
    unit_price: float
    total_price: float
    notes: Optional[str] = None

# Offer - now with user_id for multi-tenancy
class Offer(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str  # Owner of this offer
    offer_number: int
    customer_id: str
    customer_name: str
    customer_address: str
    customer_city: str
    items: List[OfferItem]
    subtotal: float
    discount_percent: float
    discount_amount: float
    vat_percent: float
    vat_amount: float
    total: float
    notes: Optional[str] = None
    valid_days: int = 30
    status: str = "draft"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class OfferItemCreate(BaseModel):
    product_type: str
    product_type_id: str
    width_cm: float
    height_cm: float
    quantity: int
    profile_id: str
    glass_id: str
    color_id: str
    hardware_id: Optional[str] = None
    notes: Optional[str] = None

class OfferCreate(BaseModel):
    customer_id: str
    items: List[OfferItemCreate]
    discount_percent: float = 0.0
    vat_percent: float = 18.0
    notes: Optional[str] = None
    valid_days: int = 30

class OfferUpdate(BaseModel):
    items: Optional[List[OfferItemCreate]] = None
    discount_percent: Optional[float] = None
    vat_percent: Optional[float] = None
    notes: Optional[str] = None
    valid_days: Optional[int] = None
    status: Optional[str] = None


# ==================== AUTH HELPER FUNCTIONS ====================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str, is_admin: bool = False) -> str:
    payload = {
        "user_id": user_id,
        "is_admin": is_admin,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token ka skaduar")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token i pavlefshëm")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    token = credentials.credentials
    payload = decode_token(token)
    
    user = await db.users.find_one({"id": payload["user_id"]}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Përdoruesi nuk u gjet")
    
    if not user.get("is_active") and not user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Llogaria juaj nuk është aktive. Ju lutem kontaktoni administratorin.")
    
    return user

async def get_admin_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    user = await get_current_user(credentials)
    if not user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Vetëm administratorët kanë qasje")
    return user


# ==================== HELPER FUNCTIONS ====================

async def get_next_offer_number(user_id: str):
    """Get the next offer number for a user"""
    last_offer = await db.offers.find_one({"user_id": user_id}, sort=[("offer_number", -1)])
    if last_offer:
        return last_offer["offer_number"] + 1
    return 1

async def calculate_item_price(item: OfferItemCreate) -> dict:
    """Calculate the price for an offer item"""
    if item.product_type == "window":
        product = await db.window_types.find_one({"id": item.product_type_id})
    else:
        product = await db.door_types.find_one({"id": item.product_type_id})
    
    if not product:
        raise HTTPException(status_code=404, detail=f"Product type not found: {item.product_type_id}")
    
    profile = await db.profiles.find_one({"id": item.profile_id})
    glass = await db.glass_types.find_one({"id": item.glass_id})
    color = await db.colors.find_one({"id": item.color_id})
    hardware = None
    if item.hardware_id:
        hardware = await db.hardware.find_one({"id": item.hardware_id})
    
    if not profile or not glass or not color:
        raise HTTPException(status_code=404, detail="Profile, glass, or color not found")
    
    area_sqm = (item.width_cm / 100) * (item.height_cm / 100)
    base_price = product["base_price_per_sqm"] * area_sqm
    base_price *= profile["price_multiplier"]
    base_price += glass["price_per_sqm"] * area_sqm
    base_price *= color["price_multiplier"]
    
    if hardware:
        base_price += hardware["price"]
    
    unit_price = round(base_price, 2)
    total_price = round(unit_price * item.quantity, 2)
    
    return {
        "product_name": product["name"],
        "profile_name": profile["name"],
        "glass_name": glass["name"],
        "color_name": color["name"],
        "hardware_name": hardware["name"] if hardware else None,
        "unit_price": unit_price,
        "total_price": total_price
    }


# ==================== AUTH ROUTES ====================

@api_router.post("/auth/register", response_model=UserResponse)
async def register(input: UserRegister):
    # Check if email exists
    existing = await db.users.find_one({"email": input.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="Ky email është i regjistruar tashmë")
    
    # Create user
    user = User(
        email=input.email.lower(),
        password_hash=hash_password(input.password),
        company_name=input.company_name,
        phone=input.phone,
        is_active=False,
        is_admin=False
    )
    
    doc = user.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.users.insert_one(doc)
    
    return UserResponse(
        id=user.id,
        email=user.email,
        company_name=user.company_name,
        phone=user.phone,
        is_active=user.is_active,
        is_admin=user.is_admin,
        subscription_start=None,
        subscription_end=None,
        created_at=doc['created_at']
    )

@api_router.post("/auth/login")
async def login(input: UserLogin):
    user = await db.users.find_one({"email": input.email.lower()}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Email ose fjalëkalimi i gabuar")
    
    if not verify_password(input.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Email ose fjalëkalimi i gabuar")
    
    # Check subscription for non-admin users
    if not user.get("is_admin") and not user.get("is_active"):
        raise HTTPException(status_code=403, detail="Llogaria juaj nuk është aktive. Ju lutem kontaktoni administratorin për aktivizim.")
    
    # Check if subscription has expired
    if not user.get("is_admin") and user.get("subscription_end"):
        sub_end = datetime.fromisoformat(user["subscription_end"]) if isinstance(user["subscription_end"], str) else user["subscription_end"]
        if sub_end < datetime.now(timezone.utc):
            # Deactivate user
            await db.users.update_one({"id": user["id"]}, {"$set": {"is_active": False}})
            raise HTTPException(status_code=403, detail="Abonimi juaj ka skaduar. Ju lutem kontaktoni administratorin për rinovim.")
    
    token = create_token(user["id"], user.get("is_admin", False))
    
    return {
        "token": token,
        "user": {
            "id": user["id"],
            "email": user["email"],
            "company_name": user["company_name"],
            "phone": user["phone"],
            "is_active": user["is_active"],
            "is_admin": user.get("is_admin", False),
            "subscription_end": user.get("subscription_end")
        }
    }

@api_router.get("/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user["id"],
        "email": current_user["email"],
        "company_name": current_user["company_name"],
        "phone": current_user["phone"],
        "is_active": current_user["is_active"],
        "is_admin": current_user.get("is_admin", False),
        "subscription_start": current_user.get("subscription_start"),
        "subscription_end": current_user.get("subscription_end")
    }


# ==================== ADMIN ROUTES ====================

@api_router.get("/admin/users")
async def get_all_users(admin: dict = Depends(get_admin_user)):
    users = await db.users.find({"is_admin": {"$ne": True}}, {"_id": 0, "password_hash": 0}).to_list(1000)
    return users

@api_router.put("/admin/users/{user_id}/activate")
async def activate_user(user_id: str, input: UserActivate, admin: dict = Depends(get_admin_user)):
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="Përdoruesi nuk u gjet")
    
    update_data = {"is_active": input.is_active}
    
    if input.is_active:
        now = datetime.now(timezone.utc)
        # If user has existing subscription that hasn't expired, extend from that date
        existing_end = user.get("subscription_end")
        if existing_end:
            existing_end_dt = datetime.fromisoformat(existing_end) if isinstance(existing_end, str) else existing_end
            if existing_end_dt > now:
                start_date = existing_end_dt
            else:
                start_date = now
        else:
            start_date = now
        
        end_date = start_date + timedelta(days=30 * input.months)
        update_data["subscription_start"] = now.isoformat()
        update_data["subscription_end"] = end_date.isoformat()
    
    await db.users.update_one({"id": user_id}, {"$set": update_data})
    
    updated_user = await db.users.find_one({"id": user_id}, {"_id": 0, "password_hash": 0})
    return updated_user

@api_router.delete("/admin/users/{user_id}")
async def delete_user(user_id: str, admin: dict = Depends(get_admin_user)):
    result = await db.users.delete_one({"id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Përdoruesi nuk u gjet")
    
    # Also delete user's data
    await db.customers.delete_many({"user_id": user_id})
    await db.offers.delete_many({"user_id": user_id})
    
    return {"message": "Përdoruesi u fshi me sukses"}

@api_router.get("/admin/stats")
async def get_admin_stats(admin: dict = Depends(get_admin_user)):
    total_users = await db.users.count_documents({"is_admin": {"$ne": True}})
    active_users = await db.users.count_documents({"is_active": True, "is_admin": {"$ne": True}})
    total_offers = await db.offers.count_documents({})
    total_customers = await db.customers.count_documents({})
    
    # Monthly revenue (active users * 50€)
    monthly_revenue = active_users * 50
    
    return {
        "total_users": total_users,
        "active_users": active_users,
        "inactive_users": total_users - active_users,
        "total_offers": total_offers,
        "total_customers": total_customers,
        "monthly_revenue": monthly_revenue
    }


# ==================== PUBLIC ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "PVC Dyer & Dritare - Sistemi i Ofertave"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


# ==================== PRODUCT CATALOG (Public) ====================

@api_router.get("/window-types", response_model=List[WindowType])
async def get_window_types():
    windows = await db.window_types.find({}, {"_id": 0}).to_list(100)
    return windows

@api_router.get("/door-types", response_model=List[DoorType])
async def get_door_types():
    doors = await db.door_types.find({}, {"_id": 0}).to_list(100)
    return doors

@api_router.get("/profiles", response_model=List[Profile])
async def get_profiles():
    profiles = await db.profiles.find({}, {"_id": 0}).to_list(100)
    return profiles

@api_router.get("/glass-types", response_model=List[GlassType])
async def get_glass_types():
    glasses = await db.glass_types.find({}, {"_id": 0}).to_list(100)
    return glasses

@api_router.get("/colors", response_model=List[Color])
async def get_colors():
    colors_list = await db.colors.find({}, {"_id": 0}).to_list(100)
    return colors_list

@api_router.get("/hardware", response_model=List[Hardware])
async def get_hardware():
    hardware_list = await db.hardware.find({}, {"_id": 0}).to_list(100)
    return hardware_list


# ==================== CUSTOMERS (Protected + Multi-tenant) ====================

@api_router.get("/customers", response_model=List[Customer])
async def get_customers(current_user: dict = Depends(get_current_user)):
    # Users see only their own customers
    customers = await db.customers.find({"user_id": current_user["id"]}, {"_id": 0}).to_list(1000)
    for c in customers:
        if isinstance(c.get('created_at'), str):
            c['created_at'] = datetime.fromisoformat(c['created_at'])
    return customers

@api_router.get("/customers/{customer_id}", response_model=Customer)
async def get_customer(customer_id: str, current_user: dict = Depends(get_current_user)):
    customer = await db.customers.find_one({"id": customer_id, "user_id": current_user["id"]}, {"_id": 0})
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    if isinstance(customer.get('created_at'), str):
        customer['created_at'] = datetime.fromisoformat(customer['created_at'])
    return customer

@api_router.post("/customers", response_model=Customer)
async def create_customer(input: CustomerCreate, current_user: dict = Depends(get_current_user)):
    customer_dict = input.model_dump()
    customer_dict["user_id"] = current_user["id"]
    customer = Customer(**customer_dict)
    doc = customer.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.customers.insert_one(doc)
    return customer

@api_router.put("/customers/{customer_id}", response_model=Customer)
async def update_customer(customer_id: str, input: CustomerCreate, current_user: dict = Depends(get_current_user)):
    existing = await db.customers.find_one({"id": customer_id, "user_id": current_user["id"]})
    if not existing:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    update_data = input.model_dump()
    await db.customers.update_one({"id": customer_id}, {"$set": update_data})
    
    updated = await db.customers.find_one({"id": customer_id}, {"_id": 0})
    if isinstance(updated.get('created_at'), str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    return updated

@api_router.delete("/customers/{customer_id}")
async def delete_customer(customer_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.customers.delete_one({"id": customer_id, "user_id": current_user["id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Customer not found")
    return {"message": "Customer deleted successfully"}


# ==================== OFFERS (Protected + Multi-tenant) ====================

@api_router.get("/offers", response_model=List[Offer])
async def get_offers(current_user: dict = Depends(get_current_user)):
    offers = await db.offers.find({"user_id": current_user["id"]}, {"_id": 0}).to_list(1000)
    for o in offers:
        if isinstance(o.get('created_at'), str):
            o['created_at'] = datetime.fromisoformat(o['created_at'])
        if isinstance(o.get('updated_at'), str):
            o['updated_at'] = datetime.fromisoformat(o['updated_at'])
    return offers

@api_router.get("/offers/{offer_id}", response_model=Offer)
async def get_offer(offer_id: str, current_user: dict = Depends(get_current_user)):
    offer = await db.offers.find_one({"id": offer_id, "user_id": current_user["id"]}, {"_id": 0})
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    if isinstance(offer.get('created_at'), str):
        offer['created_at'] = datetime.fromisoformat(offer['created_at'])
    if isinstance(offer.get('updated_at'), str):
        offer['updated_at'] = datetime.fromisoformat(offer['updated_at'])
    return offer

@api_router.post("/offers", response_model=Offer)
async def create_offer(input: OfferCreate, current_user: dict = Depends(get_current_user)):
    # Get customer (must belong to current user)
    customer = await db.customers.find_one({"id": input.customer_id, "user_id": current_user["id"]})
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    # Process items and calculate prices
    processed_items = []
    subtotal = 0.0
    
    for item in input.items:
        price_info = await calculate_item_price(item)
        offer_item = OfferItem(
            product_type=item.product_type,
            product_type_id=item.product_type_id,
            product_name=price_info["product_name"],
            width_cm=item.width_cm,
            height_cm=item.height_cm,
            quantity=item.quantity,
            profile_id=item.profile_id,
            profile_name=price_info["profile_name"],
            glass_id=item.glass_id,
            glass_name=price_info["glass_name"],
            color_id=item.color_id,
            color_name=price_info["color_name"],
            hardware_id=item.hardware_id,
            hardware_name=price_info["hardware_name"],
            unit_price=price_info["unit_price"],
            total_price=price_info["total_price"],
            notes=item.notes
        )
        processed_items.append(offer_item)
        subtotal += price_info["total_price"]
    
    # Apply customer discount if not overridden
    discount_percent = input.discount_percent if input.discount_percent > 0 else customer.get("discount_percent", 0)
    discount_amount = round(subtotal * discount_percent / 100, 2)
    
    # Calculate VAT
    taxable = subtotal - discount_amount
    vat_amount = round(taxable * input.vat_percent / 100, 2)
    
    # Total
    total = round(taxable + vat_amount, 2)
    
    # Get next offer number for this user
    offer_number = await get_next_offer_number(current_user["id"])
    
    # Create offer
    offer = Offer(
        user_id=current_user["id"],
        offer_number=offer_number,
        customer_id=input.customer_id,
        customer_name=customer["name"],
        customer_address=customer["address"],
        customer_city=customer["city"],
        items=[item.model_dump() for item in processed_items],
        subtotal=round(subtotal, 2),
        discount_percent=discount_percent,
        discount_amount=discount_amount,
        vat_percent=input.vat_percent,
        vat_amount=vat_amount,
        total=total,
        notes=input.notes,
        valid_days=input.valid_days
    )
    
    # Save to database
    doc = offer.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    await db.offers.insert_one(doc)
    
    return offer

@api_router.put("/offers/{offer_id}", response_model=Offer)
async def update_offer(offer_id: str, input: OfferUpdate, current_user: dict = Depends(get_current_user)):
    existing = await db.offers.find_one({"id": offer_id, "user_id": current_user["id"]})
    if not existing:
        raise HTTPException(status_code=404, detail="Offer not found")
    
    update_data = {}
    
    if input.items is not None:
        processed_items = []
        subtotal = 0.0
        
        for item in input.items:
            price_info = await calculate_item_price(item)
            offer_item = OfferItem(
                product_type=item.product_type,
                product_type_id=item.product_type_id,
                product_name=price_info["product_name"],
                width_cm=item.width_cm,
                height_cm=item.height_cm,
                quantity=item.quantity,
                profile_id=item.profile_id,
                profile_name=price_info["profile_name"],
                glass_id=item.glass_id,
                glass_name=price_info["glass_name"],
                color_id=item.color_id,
                color_name=price_info["color_name"],
                hardware_id=item.hardware_id,
                hardware_name=price_info["hardware_name"],
                unit_price=price_info["unit_price"],
                total_price=price_info["total_price"],
                notes=item.notes
            )
            processed_items.append(offer_item.model_dump())
            subtotal += price_info["total_price"]
        
        update_data["items"] = processed_items
        update_data["subtotal"] = round(subtotal, 2)
        
        discount_percent = input.discount_percent if input.discount_percent is not None else existing["discount_percent"]
        vat_percent = input.vat_percent if input.vat_percent is not None else existing["vat_percent"]
        
        discount_amount = round(subtotal * discount_percent / 100, 2)
        taxable = subtotal - discount_amount
        vat_amount = round(taxable * vat_percent / 100, 2)
        total = round(taxable + vat_amount, 2)
        
        update_data["discount_percent"] = discount_percent
        update_data["discount_amount"] = discount_amount
        update_data["vat_percent"] = vat_percent
        update_data["vat_amount"] = vat_amount
        update_data["total"] = total
    
    if input.notes is not None:
        update_data["notes"] = input.notes
    if input.valid_days is not None:
        update_data["valid_days"] = input.valid_days
    if input.status is not None:
        update_data["status"] = input.status
    
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.offers.update_one({"id": offer_id}, {"$set": update_data})
    
    updated = await db.offers.find_one({"id": offer_id}, {"_id": 0})
    if isinstance(updated.get('created_at'), str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    if isinstance(updated.get('updated_at'), str):
        updated['updated_at'] = datetime.fromisoformat(updated['updated_at'])
    return updated

@api_router.delete("/offers/{offer_id}")
async def delete_offer(offer_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.offers.delete_one({"id": offer_id, "user_id": current_user["id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Offer not found")
    return {"message": "Offer deleted successfully"}


# ==================== PDF GENERATION ====================

@api_router.get("/offers/{offer_id}/pdf")
async def generate_offer_pdf(offer_id: str, current_user: dict = Depends(get_current_user)):
    offer = await db.offers.find_one({"id": offer_id, "user_id": current_user["id"]}, {"_id": 0})
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=20*mm, leftMargin=20*mm, topMargin=20*mm, bottomMargin=20*mm)
    
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle('Title', parent=styles['Heading1'], fontSize=18, alignment=TA_CENTER, textColor=colors.HexColor('#1e3a5f'))
    header_style = ParagraphStyle('Header', parent=styles['Normal'], fontSize=12, alignment=TA_LEFT, textColor=colors.HexColor('#333333'))
    normal_style = ParagraphStyle('Normal', parent=styles['Normal'], fontSize=10, alignment=TA_LEFT)
    company_style = ParagraphStyle('Company', parent=styles['Normal'], fontSize=10, alignment=TA_RIGHT, textColor=colors.HexColor('#666666'))
    
    elements = []
    
    # Company header
    elements.append(Paragraph(f"<b>{current_user['company_name']}</b>", company_style))
    elements.append(Paragraph(f"Tel: {current_user['phone']}", company_style))
    elements.append(Spacer(1, 10*mm))
    
    # Header
    elements.append(Paragraph("OFERTË", title_style))
    elements.append(Spacer(1, 10*mm))
    
    # Offer info table
    created_at = offer['created_at'] if isinstance(offer['created_at'], str) else offer['created_at'].isoformat()
    date_str = created_at[:10] if isinstance(created_at, str) else created_at
    
    info_data = [
        ["Oferta Nr:", str(offer['offer_number']), "Data:", date_str],
        ["Klienti:", offer['customer_name'], "Qyteti:", offer['customer_city']],
        ["Adresa:", offer['customer_address'], "", ""],
    ]
    
    info_table = Table(info_data, colWidths=[30*mm, 55*mm, 25*mm, 55*mm])
    info_table.setStyle(TableStyle([
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (2, 0), (2, -1), 'Helvetica-Bold'),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#333333')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    elements.append(info_table)
    elements.append(Spacer(1, 10*mm))
    
    # Items table header
    items_header = ['Nr', 'Produkti', 'Dimensionet', 'Profili', 'Xhami', 'Sasia', 'Çmimi', 'Totali']
    items_data = [items_header]
    
    for i, item in enumerate(offer['items'], 1):
        items_data.append([
            str(i),
            item['product_name'],
            f"{item['width_cm']}x{item['height_cm']} cm",
            item['profile_name'],
            item['glass_name'],
            str(item['quantity']),
            f"{item['unit_price']:.2f}€",
            f"{item['total_price']:.2f}€"
        ])
    
    items_table = Table(items_data, colWidths=[10*mm, 35*mm, 25*mm, 25*mm, 25*mm, 15*mm, 20*mm, 20*mm])
    items_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e3a5f')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cccccc')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f5f5f5')]),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
    ]))
    elements.append(items_table)
    elements.append(Spacer(1, 10*mm))
    
    # Totals
    totals_data = [
        ['Nëntotali:', f"{offer['subtotal']:.2f}€"],
        [f"Zbritja ({offer['discount_percent']}%):", f"-{offer['discount_amount']:.2f}€"],
        [f"TVSH ({offer['vat_percent']}%):", f"{offer['vat_amount']:.2f}€"],
        ['TOTALI:', f"{offer['total']:.2f}€"],
    ]
    
    totals_table = Table(totals_data, colWidths=[130*mm, 35*mm])
    totals_table.setStyle(TableStyle([
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
        ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
        ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
        ('TEXTCOLOR', (0, -1), (-1, -1), colors.HexColor('#1e3a5f')),
        ('LINEABOVE', (0, -1), (-1, -1), 1, colors.HexColor('#1e3a5f')),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    elements.append(totals_table)
    
    # Notes
    if offer.get('notes'):
        elements.append(Spacer(1, 10*mm))
        elements.append(Paragraph(f"<b>Shënime:</b> {offer['notes']}", normal_style))
    
    # Validity
    elements.append(Spacer(1, 10*mm))
    elements.append(Paragraph(f"<i>Oferta është e vlefshme për {offer['valid_days']} ditë.</i>", normal_style))
    
    doc.build(elements)
    
    buffer.seek(0)
    pdf_content = buffer.getvalue()
    
    return Response(
        content=pdf_content,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=Oferta_{offer['offer_number']}.pdf"}
    )


# ==================== DASHBOARD STATS (Protected) ====================

@api_router.get("/dashboard/stats")
async def get_dashboard_stats(current_user: dict = Depends(get_current_user)):
    """Get dashboard statistics for current user"""
    total_customers = await db.customers.count_documents({"user_id": current_user["id"]})
    total_offers = await db.offers.count_documents({"user_id": current_user["id"]})
    
    # Calculate total revenue from accepted offers
    accepted_offers = await db.offers.find({"user_id": current_user["id"], "status": "accepted"}, {"_id": 0}).to_list(1000)
    total_revenue = sum(o.get("total", 0) for o in accepted_offers)
    
    # Recent offers
    recent_offers = await db.offers.find({"user_id": current_user["id"]}, {"_id": 0}).sort("created_at", -1).to_list(5)
    
    # Offers by status
    draft_count = await db.offers.count_documents({"user_id": current_user["id"], "status": "draft"})
    sent_count = await db.offers.count_documents({"user_id": current_user["id"], "status": "sent"})
    accepted_count = await db.offers.count_documents({"user_id": current_user["id"], "status": "accepted"})
    rejected_count = await db.offers.count_documents({"user_id": current_user["id"], "status": "rejected"})
    
    return {
        "total_customers": total_customers,
        "total_offers": total_offers,
        "total_revenue": round(total_revenue, 2),
        "offers_by_status": {
            "draft": draft_count,
            "sent": sent_count,
            "accepted": accepted_count,
            "rejected": rejected_count
        },
        "recent_offers": recent_offers
    }


# ==================== SEED DATA ====================

@api_router.post("/seed")
async def seed_database():
    """Seed the database with initial data"""
    
    # Check if already seeded
    existing_windows = await db.window_types.count_documents({})
    if existing_windows > 0:
        return {"message": "Database already seeded"}
    
    # Window Types
    window_types = [
        {"id": str(uuid.uuid4()), "name": "Dritare Fikse", "code": "W-FIX", "opening_type": "fixed", "panels": 1, "base_price_per_sqm": 80.0, "description": "Dritare fikse pa hapje"},
        {"id": str(uuid.uuid4()), "name": "Dritare 1 Kanat Përkulëse", "code": "W-1T", "opening_type": "tilt", "panels": 1, "base_price_per_sqm": 120.0, "description": "Dritare me 1 kanat që hapet përkulëse"},
        {"id": str(uuid.uuid4()), "name": "Dritare 1 Kanat Rrotulluese", "code": "W-1R", "opening_type": "turn", "panels": 1, "base_price_per_sqm": 130.0, "description": "Dritare me 1 kanat që hapet rrotulluese"},
        {"id": str(uuid.uuid4()), "name": "Dritare 1 Kanat Përkulëse-Rrotulluese", "code": "W-1TR", "opening_type": "tilt_turn", "panels": 1, "base_price_per_sqm": 150.0, "description": "Dritare me 1 kanat përkulëse dhe rrotulluese"},
        {"id": str(uuid.uuid4()), "name": "Dritare 2 Kanata Fikse", "code": "W-2FIX", "opening_type": "fixed", "panels": 2, "base_price_per_sqm": 90.0, "description": "Dritare me 2 kanata fikse"},
        {"id": str(uuid.uuid4()), "name": "Dritare 2 Kanata Përkulëse-Rrotulluese", "code": "W-2TR", "opening_type": "tilt_turn", "panels": 2, "base_price_per_sqm": 180.0, "description": "Dritare me 2 kanata përkulëse-rrotulluese"},
        {"id": str(uuid.uuid4()), "name": "Dritare Rrëshqitëse", "code": "W-SL", "opening_type": "sliding", "panels": 2, "base_price_per_sqm": 200.0, "description": "Dritare rrëshqitëse me 2 kanata"},
    ]
    await db.window_types.insert_many(window_types)
    
    # Door Types
    door_types = [
        {"id": str(uuid.uuid4()), "name": "Derë Hyrëse Standarde", "code": "D-ENT", "door_style": "entrance", "base_price_per_sqm": 250.0, "description": "Derë hyrëse e sigurt"},
        {"id": str(uuid.uuid4()), "name": "Derë Ballkoni", "code": "D-BAL", "door_style": "standard", "base_price_per_sqm": 180.0, "description": "Derë për ballkon"},
        {"id": str(uuid.uuid4()), "name": "Derë Rrëshqitëse", "code": "D-SL", "door_style": "sliding", "base_price_per_sqm": 280.0, "description": "Derë rrëshqitëse"},
        {"id": str(uuid.uuid4()), "name": "Derë Rrëshqitëse HST", "code": "D-HST", "door_style": "sliding", "base_price_per_sqm": 350.0, "description": "Derë rrëshqitëse HST me ngritje"},
        {"id": str(uuid.uuid4()), "name": "Derë Palosëse", "code": "D-FOLD", "door_style": "folding", "base_price_per_sqm": 300.0, "description": "Derë palosëse"},
    ]
    await db.door_types.insert_many(door_types)
    
    # Profiles
    profiles = [
        {"id": str(uuid.uuid4()), "name": "Decco 70mm", "brand": "Decco", "width_mm": 70, "insulation_coefficient": 1.3, "price_multiplier": 1.0, "description": "Profil standard"},
        {"id": str(uuid.uuid4()), "name": "Decco 83mm", "brand": "Decco", "width_mm": 83, "insulation_coefficient": 1.0, "price_multiplier": 1.2, "description": "Profil premium me izolim të lartë"},
        {"id": str(uuid.uuid4()), "name": "Aluplast 70mm", "brand": "Aluplast", "width_mm": 70, "insulation_coefficient": 1.2, "price_multiplier": 1.1, "description": "Profil cilësor Aluplast"},
        {"id": str(uuid.uuid4()), "name": "Aluplast 85mm", "brand": "Aluplast", "width_mm": 85, "insulation_coefficient": 0.9, "price_multiplier": 1.35, "description": "Profil premium Aluplast"},
        {"id": str(uuid.uuid4()), "name": "Rehau 70mm", "brand": "Rehau", "width_mm": 70, "insulation_coefficient": 1.1, "price_multiplier": 1.15, "description": "Profil cilësor Rehau"},
        {"id": str(uuid.uuid4()), "name": "Veka 82mm", "brand": "Veka", "width_mm": 82, "insulation_coefficient": 0.95, "price_multiplier": 1.3, "description": "Profil premium Veka"},
    ]
    await db.profiles.insert_many(profiles)
    
    # Glass Types
    glass_types = [
        {"id": str(uuid.uuid4()), "name": "FLOAT 4-16-4", "layers": 2, "u_value": 2.6, "price_per_sqm": 25.0, "description": "Xham dyfish standard"},
        {"id": str(uuid.uuid4()), "name": "Low-E 4-16-4", "layers": 2, "u_value": 1.1, "price_per_sqm": 45.0, "description": "Xham dyfish me Low-E"},
        {"id": str(uuid.uuid4()), "name": "Triple 4-12-4-12-4", "layers": 3, "u_value": 0.7, "price_per_sqm": 75.0, "description": "Xham trifish"},
        {"id": str(uuid.uuid4()), "name": "Triple Low-E", "layers": 3, "u_value": 0.5, "price_per_sqm": 95.0, "description": "Xham trifish me Low-E"},
        {"id": str(uuid.uuid4()), "name": "Sigurie 33.1", "layers": 2, "u_value": 2.8, "price_per_sqm": 55.0, "description": "Xham sigurie laminat"},
    ]
    await db.glass_types.insert_many(glass_types)
    
    # Colors
    colors_data = [
        {"id": str(uuid.uuid4()), "name": "Bardhë", "code": "WHT", "hex_color": "#FFFFFF", "price_multiplier": 1.0},
        {"id": str(uuid.uuid4()), "name": "Anthracit", "code": "ANT", "hex_color": "#383838", "price_multiplier": 1.25},
        {"id": str(uuid.uuid4()), "name": "Dru Druri", "code": "OAK", "hex_color": "#8B4513", "price_multiplier": 1.3},
        {"id": str(uuid.uuid4()), "name": "Arra", "code": "WAL", "hex_color": "#5C4033", "price_multiplier": 1.3},
        {"id": str(uuid.uuid4()), "name": "Gri", "code": "GRY", "hex_color": "#808080", "price_multiplier": 1.2},
        {"id": str(uuid.uuid4()), "name": "Kafe", "code": "BRN", "hex_color": "#654321", "price_multiplier": 1.25},
        {"id": str(uuid.uuid4()), "name": "Zi", "code": "BLK", "hex_color": "#000000", "price_multiplier": 1.3},
    ]
    await db.colors.insert_many(colors_data)
    
    # Hardware
    hardware_data = [
        {"id": str(uuid.uuid4()), "name": "Maco Standard", "brand": "Maco", "type": "mechanism", "price": 25.0},
        {"id": str(uuid.uuid4()), "name": "Maco Multi-Matic", "brand": "Maco", "type": "mechanism", "price": 45.0},
        {"id": str(uuid.uuid4()), "name": "Winkhaus Standard", "brand": "Winkhaus", "type": "mechanism", "price": 30.0},
        {"id": str(uuid.uuid4()), "name": "Winkhaus activPilot", "brand": "Winkhaus", "type": "mechanism", "price": 55.0},
        {"id": str(uuid.uuid4()), "name": "Roto NT", "brand": "Roto", "type": "mechanism", "price": 35.0},
        {"id": str(uuid.uuid4()), "name": "Dorezë Standarde", "brand": "Generic", "type": "handle", "price": 8.0},
        {"id": str(uuid.uuid4()), "name": "Dorezë me Çelës", "brand": "Hoppe", "type": "handle", "price": 18.0},
        {"id": str(uuid.uuid4()), "name": "Dorezë Alumini", "brand": "Hoppe", "type": "handle", "price": 25.0},
    ]
    await db.hardware.insert_many(hardware_data)
    
    # Create admin user
    admin_exists = await db.users.find_one({"email": "admin@pvcoferta.com"})
    if not admin_exists:
        admin_user = User(
            email="admin@pvcoferta.com",
            password_hash=hash_password("admin123"),
            company_name="PVC Oferta Admin",
            phone="+383 44 000 000",
            is_active=True,
            is_admin=True
        )
        doc = admin_user.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.users.insert_one(doc)
    
    return {"message": "Database seeded successfully"}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
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
