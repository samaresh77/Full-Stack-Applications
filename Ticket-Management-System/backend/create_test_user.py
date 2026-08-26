from app.database import SessionLocal
from app.models import User
from app.utils.security import hash_password


def create_user(
    username: str,
    password: str,
    role: str
):
    db = SessionLocal()

    existing_user = (
        db.query(User)
        .filter(User.username == username)
        .first()
    )

    if existing_user:
        print(f"User '{username}' already exists.")
        db.close()
        return

    user = User(
        username=username,
        password_hash=hash_password(password),
        role=role
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    print(f"Created user: {user.username}")
    print(f"User ID: {user.id}")
    print(f"Role: {user.role}")

    db.close()


if __name__ == "__main__":
    create_user(
        username="support",
        password="support123",
        role="support"
    )