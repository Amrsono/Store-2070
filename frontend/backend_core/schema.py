import strawberry
from typing import List, Optional
import models
from database import SessionLocal
from sqlalchemy import func
from email_utils import generate_verification_token, send_verification_email, send_welcome_email

@strawberry.type
class Product:
    id: strawberry.ID
    name: str
    description: str
    price: float
    image_url: str
    stock: int
    category_id: int

@strawberry.type
class Category:
    id: strawberry.ID
    name: str
    description: str
    products: List[Product]

@strawberry.type
class OrderItem:
    product_name: str
    quantity: int
    price: float

@strawberry.type
class Order:
    id: strawberry.ID
    user_id: int
    total_price: float
    status: str
    created_at: str
    items: List[OrderItem]

@strawberry.type
class DashboardStats:
    daily_revenue: float
    weekly_volume: float
    monthly_throughput: float
    daily_change: float
    weekly_change: float
    monthly_change: float

@strawberry.type
class Query:
    @strawberry.field
    def products(self) -> List[Product]:
        db = SessionLocal()
        products = db.query(models.Product).all()
        db.close()
        return [
            Product(
                id=strawberry.ID(str(p.id)),
                name=p.name,
                description=p.description,
                price=p.price,
                image_url=p.image_url,
                stock=p.stock,
                category_id=p.category_id
            ) for p in products
        ]

    @strawberry.field
    def categories(self) -> List[Category]:
        db = SessionLocal()
        categories = db.query(models.Category).all()
        db.close()
        return [
            Category(
                id=strawberry.ID(str(c.id)),
                name=c.name,
                description=c.description,
                products=[
                    Product(
                        id=strawberry.ID(str(p.id)),
                        name=p.name,
                        description=p.description,
                        price=p.price,
                        image_url=p.image_url,
                        stock=p.stock,
                        category_id=p.category_id
                    ) for p in c.products
                ]
            ) for c in categories
        ]

    @strawberry.field
    def orders(self) -> List[Order]:
        db = SessionLocal()
        orders = db.query(models.Order).all()
        # For demo purposes, we'll return all, but in prod apply pagination
        result = [
            Order(
                id=strawberry.ID(str(o.id)),
                user_id=o.user_id,
                total_price=o.total_price,
                status=o.status,
                created_at=o.created_at,
                items=[
                    OrderItem(
                        product_name=i.product.name if i.product else "Unknown",
                        quantity=i.quantity,
                        price=i.price
                    ) for i in o.items
                ]
            ) for o in orders
        ]
        db.close()
        return result

    @strawberry.field
    def dashboard_stats(self) -> DashboardStats:
        # Mock calculation for now, or real aggregation if enough data
        # Real calc would go here. Returning static "2070" style stats for demo consistency or simple math.
        db = SessionLocal()
        total_revenue = db.query(models.Order).with_entities(func.sum(models.Order.total_price)).scalar() or 0.0
        order_count = db.query(models.Order).count()
        db.close()
        
        return DashboardStats(
            daily_revenue=4.28, # Mocked as ETH/Crypto value
            weekly_volume=28.5,
            monthly_throughput=total_revenue / 1000.0 if total_revenue else 142.1, # Mixing real and mock
            daily_change=12.0,
            weekly_change=5.4,
            monthly_change=22.0
        )

@strawberry.type
class AuthPayload:
    success: bool
    token: Optional[str]
    user_id: Optional[int]
    username: Optional[str]
    is_admin: Optional[int]
    email_verified: Optional[bool]
    message: Optional[str]

@strawberry.type
class Mutation:
    @strawberry.mutation
    def login(self, username: str, password: str) -> AuthPayload:
        db = SessionLocal()
        user = db.query(models.User).filter(models.User.username == username).first()
        db.close()

        if not user:
             return AuthPayload(success=False, message="User not found", token=None, user_id=None, username=None, is_admin=None, email_verified=False)
        
        # Simple password check (in prod use bcrypt.verify)
        if user.hashed_password != password:
            return AuthPayload(success=False, message="Invalid credentials", token=None, user_id=None, username=None, is_admin=None, email_verified=False)

        return AuthPayload(
            success=True,
            message="Login successful",
            token="fake-jwt-token-2070", # Mock token
            user_id=user.id,
            username=user.username,
            is_admin=user.is_admin,
            email_verified=bool(user.email_verified)
        )

    @strawberry.mutation
    def register(self, username: str, password: str) -> AuthPayload:
        db = SessionLocal()
        existing_user = db.query(models.User).filter(models.User.username == username).first()
        
        if existing_user:
            db.close()
            return AuthPayload(success=False, message="Identity already exists in grid", token=None, user_id=None, username=None, is_admin=None, email_verified=False)
            
        token = generate_verification_token()
        
        new_user = models.User(
            username=username,
            hashed_password=password, # In prod use bcrypt
            is_admin=0,
            email_verified=0,
            verification_token=token
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        db.close()
        
        # Simulate sending verification email
        send_verification_email(username, token)
        
        return AuthPayload(
            success=True,
            message="Identity forged. Check your neural inbox for verification.",
            token="fake-jwt-token-new-user",
            user_id=new_user.id,
            username=new_user.username,
            is_admin=0,
            email_verified=False
        )

    @strawberry.mutation
    def verify_email(self, token: str) -> AuthPayload:
        db = SessionLocal()
        user = db.query(models.User).filter(models.User.verification_token == token).first()
        
        if not user:
            db.close()
            return AuthPayload(success=False, message="Invalid verification token", token=None, user_id=None, username=None, is_admin=None, email_verified=False)
            
        user.email_verified = 1
        user.verification_token = None
        db.commit()
        db.refresh(user)
        db.close()
        
        send_welcome_email(user.username)
        
        return AuthPayload(
            success=True,
            message="Email verified successfully. Access granted.",
            token="fake-jwt-token-verified",
            user_id=user.id,
            username=user.username,
            is_admin=user.is_admin,
            email_verified=True
        )

schema = strawberry.Schema(query=Query, mutation=Mutation)
