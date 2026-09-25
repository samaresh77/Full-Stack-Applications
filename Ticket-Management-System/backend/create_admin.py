from app.database import SessionLocal
from app.models import User
from app.utils.security import hash_password


db = SessionLocal()


username = "admin2"
password = "admin123"


try:
    # Check whether user already exists
    existing_user = (
        db.query(User)
        .filter(User.username == username)
        .first()
    )

    if existing_user:
        print(
            f"User '{username}' already exists."
        )

    else:
        user = User(
            username=username,
            password_hash=hash_password(password),
            role="admin"
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        print("Admin created successfully!")
        print(f"ID: {user.id}")
        print(f"Username: {user.username}")
        print(f"Role: {user.role}")

finally:
    db.close()