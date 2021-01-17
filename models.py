from datetime import datetime
from config import db, ma
from marshmallow import fields, EXCLUDE
from marshmallow_sqlalchemy import ModelSchema
from marshmallow_sqlalchemy.fields import Nested

class Speaker(db.Model):
    __tablename__ = "speaker"
    speaker_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    timestamp = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )
    # what does "delete-orphan" do? or "single_parent"?
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

class SpeakerSchema(ModelSchema):
    class Meta:
        model = Speaker
        load_instance = True
        sqla_session = db.session
    speaker_id = fields.Int()
    name = fields.Str()
    timestamp = fields.Str()
    truths = Nested("TruthSchema", default=[], many=True, exclude=("speaker",))

class TruthSchema(ModelSchema):
    class Meta:
        model = Truth
        sqla_session = db.session
        unknown = EXCLUDE
    truth_id = fields.Int()
    content = fields.Str()
    timestamp = fields.Str()
    speaker = Nested("SpeakerSchema", default=None)
