from datetime import datetime
from config import db, ma
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema, auto_field

class Speaker(db.Model):
    __tablename__ = "speaker"
    speaker_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    timestamp = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )
    # what does "delete-orphan" do? if it deletes truths that don't have speakers attached, I want to change that. truths that don't have speakers attached should be reassigned to Anonymous, not deleted. It looks like I'll have to change both delete-orphan and single-parent?
    truths = db.relationship(
        "Truth",
        backref="speaker",
        cascade="all, delete, delete-orphan",
        single_parent=True,
        order_by="desc(Truth.timestamp)"
    )

class Truth(db.Model):
    __tablename__ = "truth"
    truth_id = db.Column(db.Integer, primary_key=True)
    speaker_id = db.Column(db.Integer, db.ForeignKey("speaker.speaker_id"))
    # nullable = False means that it's okay to create new notes that have no content
    content = db.Column(db.String, nullable=False)
    timestamp = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

# former Truth class
# class Truth(db.Model):
#     __tablename__ = 'truth'
#     id = db.Column(db.Integer, primary_key=True)
#     speaker = db.Column(db.String(999))
#     truthtext = db.Column(db.String(999))
#     timestamp = db.Column(
#         db.DateTime, 
#         default=datetime.utcnow, 
#         onupdate=datetime.utcnow
#     )

class SpeakerSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Speaker
        load_instance = True
        sqla_session = db.session
