import os
from config import db
from models import Truth

# Data to initialize the database with
TRUTHS = [
    {
        'truthtext': 'Your silence will not protect you', 
        'hexcode': '000000'
    },
    {
        'truthtext': 'Gender is a myth', 
        'hexcode': 'FFD1DC'
    },
    {
        'truthtext': 'I like sunlight more than rain', 
        'hexcode': 'FFF222'
    },
    {
        'truthtext': 'I cried at the temple at Burning Man', 
        'hexcode': '6699CC'
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
        hexcode=truth["hexcode"]
    )
    db.session.add(t)

db.session.commit()