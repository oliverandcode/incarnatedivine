from datetime import datetime
from config import db, ma
from marshmallow_sqlalchemy import SQLAlchemySchema

class Truth(db.Model):
    __tablename__ = 'truth'
    id = db.Column(db.Integer, primary_key=True)
    hexcode = db.Column(db.String(6))
    truthtext = db.Column(db.String(999))
    timestamp = db.Column(
        db.DateTime, 
        default=datetime.utcnow, 
        onupdate=datetime.utcnow
    )

class TruthSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Truth
        sqla_session = db.session
