from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text
from app.database import Base

class OAuthToken(Base):
    __tablename__ = "oauth_tokens"
    provider = Column(String(50), primary_key=True, index=True) # e.g. "zoho"
    access_token = Column(Text, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)