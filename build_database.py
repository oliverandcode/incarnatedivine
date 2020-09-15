import os
from datetime import datetime
from config import db
from models import Speaker, Truth

# Data to initialize the database with
# TRUTHS = [
#     {
#         'truthtext': 'Your silence will not protect you', 
#         'speaker': 'Audre Lorde'
#     },
#     {
#         'truthtext': 'Gender is a myth', 
#         'speaker': 'Oliver Ayers'
#     },
#     {
#         'truthtext': 'I like sunlight more than rain', 
#         'speaker': 'Anonymous'
#     },
#     {
#         'truthtext': 'I cried at the temple at Burning Man', 
#         'speaker': 'Anonymous'
#     },
#     {
#         'truthtext': 'Selfishness',
#         'speaker': 'Anonymous'
#     },
#     {
#         'truthtext': 'There is a war going on',
#         'speaker': 'Bailey Davenport'
#     }
# ]

# Data to initialize the database with
SPEAKERS = [
    {
        "name": "Anonymous",
        "truths": [
            ("I like sunlight more than rain", "2014-09-14 12:00:00"),
            ("Selfishness", "2018-09-14 12:00:00"),
            ("I cried at the temple at Burning Man", "2019-09-14 12:00:00"),
        ],
    },
    {
        "name": "Audre Lorde",
        "truths": [
            ("Your silence will not protect you.", "1977-12-28 00:00:00"),
        ],
    },
    {
        "name": "Oliver Ayers",
        "truths": [
            ("Gender is a myth", "1990-02-16 15:43:00"),
        ],
    },
    {
        "name": "Bailey Davenport",
        "truths": [
            ("There is a war going on", "1990-01-02 00:00:00"),
            ("Your silence will not protect you", "1990-01-02 01:01:01"),
        ],
    },
]

# Delete database file if it exists currently
if os.path.exists('speakers.db'):
    os.remove('speakers.db')

if os.path.exists('truths.db'):
    os.remove('truths.db')

# Create the database
db.create_all()

# Iterate over the TRUTHS structure and populate the database
for speaker in SPEAKERS:
    s = Speaker(
        name=speaker.get("name"),
    )

    # Add the truths for each person
    for truth in speaker.get("truths"):
        content, timestamp = truth
        s.truths.append(
            Truth(
                content=content,
                timestamp=datetime.strptime(timestamp, "%Y-%m-%d %H:%M:%S"),
            )
        )

    db.session.add(s)

db.session.commit()