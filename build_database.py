import os
from config import db
from models import Truth

# Data to initialize the database with
TRUTHS = [
    {
        'truthtext': 'Your silence will not protect you', 
        'speaker': 'Audre Lorde'
    },
    {
        'truthtext': 'Gender is a myth', 
        'speaker': 'Oliver Ayers'
    },
    {
        'truthtext': 'I like sunlight more than rain', 
        'speaker': 'Anonymous'
    },
    {
        'truthtext': 'I cried at the temple at Burning Man', 
        'speaker': 'Anonymous'
    },
    {
        'truthtext': 'Selfishness',
        'speaker': 'Anonymous'
    },
    {
        'truthtext': 'There is a war going on',
        'speaker': 'Anonymous'
    }
]

# Delete database file if it exists currently
if os.path.exists('truths.db'):
    os.remove('truths.db')

# Create the database
db.create_all()

# Iterate over the TRUTHS structure and populate the database
for truth in TRUTHS:
    t = Truth(
        truthtext=truth["truthtext"], 
        speaker=truth["speaker"]
    )
    db.session.add(t)

db.session.commit()