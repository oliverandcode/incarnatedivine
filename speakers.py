# """
# This is the speakers module and supports all the ReST actions for the SPEAKERS collection
# """

# 3rd party modules
from flask import (
    make_response, 
    abort,
)
from config import db
from models import (
    Speaker,
    SpeakerSchema,
    Truth
)


# Create a handler for our read_all (GET) spakers
def read_all():
    # """
    # This function responds to a request for /api/speakers
    # with the complete lists of speakers

    # :return:        json string of sorted list of speakers
    # """
    
    # Create the list of speakers from our data
    speakers = Speaker.query.order_by(Speaker.name).all()
    
    # Serialize the data for the response
    speaker_schema = SpeakerSchema(many=True)
    data = speaker_schema.dump(speakers)
    # alt:
    # data = speaker_schema.dump(speakers).data
    return data


def read_one(speaker_id):
    # """
    # This function responds to a request for /api/speakers/{speaker_id}
    # with one matching speaker from speakers collection

    # :param speaker_id:    id of speaker to find
    # :return:              speaker matching id
    # """

    # old code:
    # Get the speaker requested
    # speaker = Speaker.query.filter(Speaker.speaker_id == speaker_id).one_or_none()

    # Build the initial query
    speaker = (
        Speaker.query.filter(Speaker.speaker_id == speaker_id)
        .outerjoin(Truth)
        .one_or_none()
    )

    # Did we find a speaker?
    if speaker is not None:

        # Serialize the data for the response (implicit 'many=False')
        speaker_schema = SpeakerSchema()
        data = speaker_schema.dump(speaker)
        # alt:
        # data = speaker_schema.dump(speaker).data
        return data
    
    # Otherwise, nope, didn't find that speaker
    else:
        abort(
            404,
            "Speaker not found for speaker_id: {speaker_id}".format(speaker_id=speaker_id),
        )


def create(speaker):
    # """
    # This function creates a new speaker in the speakers structure
    # based on the passed-in speaker data

    # :param speaker:   speaker to create in the speakers structure
    # :return:          201 on success, 409 on speaker exists
    # """

    name = speaker.get("name")

    # This finds any speakers with an identical value for 'name' - later, if I add a user login function, I'll have to look up by email or username. Either way it'll be just the one value to look up, I won't have to look up 2 different fields' matching values.
    existing_speaker = (
        Speaker.query.filter(Speaker.name == name)
        .one_or_none()
    )

    # Can we insert this speaker?
    if existing_speaker is None:

        # Create a speaker instance using the schema and the passed-in speaker
        schema = SpeakerSchema()
        new_speaker = schema.load(speaker, session=db.session)
        # alt:
        # new_speaker = schema.load(speaker, session=db.session).data

        # Add the speaker to the database
        db.session.add(new_speaker)
        db.session.commit()

        # Serialize and return the newly created speaker in the response
        data = schema.dump(new_speaker)
        # alt:
        # data = schema.dump(new_speaker).data

        return (data, 201)
    
    # Otherwise, nope, speaker exists already
    else:
        abort(
            409,
            "Speaker {name} already exists".format(name=name),
        )


def update(speaker_id, speaker):
    # """
    # This function updates an existing speaker in the speakers structure

    # :param speaker_id:    id of the speaker to update in the speakers structure
    # :param speaker:       speaker to update
    # :return:              updated speakers structure
    # """

    # Get the speaker requested from the db into session
    update_speaker = Speaker.query.filter(
        Speaker.speaker_id == speaker_id
    ).one_or_none()

    # Try to find an existing speaker with the same properties as the update
    name = speaker.get("name")

    existing_speaker = (
        Speaker.query.filter(Speaker.name == name)
        .one_or_none()
    )

    # Are we trying to find a speaker that does not exist?
    if update_speaker is None:
        abort(
            404,
            "Speaker not found for id: {speaker_id}".format(speaker_id=speaker_id),
        )
    
    # Would our update create a duplicate of another speaker that already exists?
    elif (
        existing_speaker is not None and existing_speaker.speaker_id != speaker_id
    ):
        abort(
            409,
            "Speaker {name} already exists".format(
                name=name,
            ),
        )

    # Otherwise, go ahead and update!
    else:

        # turn the passed-in speaker into a db object
        schema = SpeakerSchema()
        update = schema.load(speaker, session=db.session)
        # alt:
        # update = schema.load(speaker, session=db.session).data

        # set the id to the speaker we want to update
        update.speaker_id = update_speaker.speaker_id

        # merge the new object into the old and commit it to the db
        db.session.merge(update)
        db.session.commit()

        # return updated speaker in the response
        data = schema.dump(update_speaker)
        # alt:
        # data = schema.dump(update_speaker).data

        return (data, 200)


def delete(speaker_id):
    # """
    # This function deletes a speaker from the speakers structure

    # :param speaker_id:    id of speaker to delete
    # :return:              200 on successful delete, 404 if not found
    # """

    # get the speaker requested
    speaker = Speaker.query.filter(Speaker.speaker_id == speaker_id).one_or_none()

    # did we find a speaker?
    if speaker is not None:

        name = speaker.name

        db.session.delete(speaker)
        db.session.commit()

        return make_response(
            "Speaker {speaker_id}, {name}, was deleted".format(speaker_id=speaker_id, name=name),
            200,
        )
    
    # otherwise, nope, didn't find that speaker
    else:
        abort(
            404,
            "Speaker not found for id: {speaker_id}".format(speaker_id=speaker_id),
        )
