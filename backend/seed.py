from database import SessionLocal, engine
import models

def seed_db():
    db = SessionLocal()
    
    # Check if data already exists
    if db.query(models.Category).first():
        db.close()
        return

    # Add Categories
    footwear = models.Category(name="Footwear", description="Anti-grav and kinetic footwear.")
    apparel = models.Category(name="Apparel", description="Smart-fabrics and adaptive camouflage.")
    accessories = models.Category(name="Accessories", description="Neural-linked wearables.")
    
    db.add_all([footwear, apparel, accessories])
    db.commit()
    
    # Add Products
    products = [
        models.Product(
            name="Void Walker v3", 
            description="Quantum-stitched combat boots with magnetic soles.", 
            price=2400.0, 
            image_url="/products/shoes.jpg", 
            stock=25, 
            category=footwear
        ),
        models.Product(
            name="Neon Weave Jacket", 
            description="Adaptive color-shifting bomber with built-in HUD projectors.", 
            price=3200.0, 
            image_url="/products/jacket.jpg", 
            stock=15, 
            category=apparel
        ),
        models.Product(
            name="Chroma Sneakers", 
            description="Ultra-light running shoes with kinetic energy harvesting.", 
            price=1800.0, 
            image_url="/products/sneakers.jpg", 
            stock=50, 
            category=footwear
        ),
        models.Product(
            name="Obsidian Cowl", 
            description="Nanofiber hood providing air filtration and rain shielding.", 
            price=550.0, 
            image_url="/products/hood.jpg", 
            stock=100, 
            category=apparel
        ),
    ]
    
    db.add_all(products)
    
    # Add Admin User
    admin = models.User(
        username="admin",
        hashed_password="admin_hash_2070", # In real apps use bcrypt
        is_admin=1
    )
    db.add(admin)
    
    db.commit()
    
    # Add Customers
    customers = [
        models.User(username="kyle_reese", hashed_password="password", is_admin=0),
        models.User(username="sarah_connor", hashed_password="password", is_admin=0),
        models.User(username="doc_brown", hashed_password="password", is_admin=0),
    ]
    db.add_all(customers)
    db.commit()

    # Create Orders
    p1 = db.query(models.Product).filter(models.Product.name=="Void Walker v3").first()
    p2 = db.query(models.Product).filter(models.Product.name=="Neon Weave Jacket").first()
    p3 = db.query(models.Product).filter(models.Product.name=="Chroma Sneakers").first()
    
    u_kyle = db.query(models.User).filter(models.User.username=="kyle_reese").first()
    u_sarah = db.query(models.User).filter(models.User.username=="sarah_connor").first()
    u_doc = db.query(models.User).filter(models.User.username=="doc_brown").first()
    
    import datetime
    
    orders = [
        models.Order(user_id=u_kyle.id, total_price=2400.0, status="shipped", created_at=datetime.datetime.now().isoformat()),
        models.Order(user_id=u_sarah.id, total_price=3200.0, status="delivered", created_at=datetime.datetime.now().isoformat()),
        models.Order(user_id=u_doc.id, total_price=1800.0, status="pending", created_at=datetime.datetime.now().isoformat()),
    ]
    db.add_all(orders)
    db.commit()
    
    # Order Items
    items = [
        models.OrderItem(order_id=orders[0].id, product_id=p1.id, quantity=1, price=2400.0),
        models.OrderItem(order_id=orders[1].id, product_id=p2.id, quantity=1, price=3200.0),
        models.OrderItem(order_id=orders[2].id, product_id=p3.id, quantity=1, price=1800.0),
    ]
    db.add_all(items)
    db.commit()
    db.close()

if __name__ == "__main__":
    seed_db()
