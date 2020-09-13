from datetime import datetime
from config import db, ma
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema, auto_field

class Truth(db.Model):
    __tablename__ = 'truth'
    id = db.Column(db.Integer, primary_key=True)
    speaker = db.Column(db.String(999))
    truthtext = db.Column(db.String(999))
    timestamp = db.Column(
        db.DateTime, 
        default=datetime.utcnow, 
        onupdate=datetime.utcnow
    )

class TruthSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Truth
        load_instance = True
        sqla_session = db.session
