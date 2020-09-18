# """
# This is the truths module and supports all the ReST actions for the TRUTHS collection
# """

# 3rd party modules
from flask import (
    make_response, 
    abort,
)
from config import db
from models import (
    Speaker,
    Truth,
    TruthSchema,
)

# Create a handler for our read_all (GET) truths
def read_all():
    # """
    # This function responds to a request for /api/speakers/truths
    # with the complete lists of truths, sorted by truth timestamp

    # :return:  json string of sorted list of truths
    # """
    
    # Create the list of truths from our data
    truths = Truth.query.order_by(db.desc(Truth.timestamp)).all()
    
    # Serialize the data for the response
    truth_schema = TruthSchema(many=True, exclude=["speaker.truths"])
    data = truth_schema.dump(truths)
    # alt:
    # data = truth_schema.dump(truths).data
    return data


def read_one(speaker_id, truth_id):
    # """
    # This function responds to a request for /api/speakers/{speaker_id}/truths/{truth_id}
    # with one matching truth for the associated speaker

    # :param speaker_id:    id of speaker the truth is associated with
    # :param truth_id:      id of the truth in question
    # :return:              json string of truth contents
    # """

    # old code:
    # Get the truth requested
    # truth = Truth.query.filter(Truth.id == id).one_or_none()

    # Query the database for the truth
    truth = (
        Truth.query.join(Speaker, Speaker.speaker_id == Truth.speaker_id)
        .filter(Speaker.speaker_id == speaker_id)
        .filter(Truth.truth_id == truth_id)
        .one_or_none()
    )
    
    # Did we find a truth?
    if truth is not None:

        # Serialize the data for the response (implicit 'many=False')
        truth_schema = TruthSchema()
        data = truth_schema.dump(truth)
        # alt:
        # data = truth_schema.dump(truth).data
        return data
    
    # Otherwise, nope, didn't find that truth
    else:
        abort(
            404,
            "Truth not found for id: {truth_id}".format(truth_id=truth_id),
        )


def create(speaker_id, truth):
    # """
    # This function creates a new truth associated with the passed-in speaker_id
    # based on the passed-in truth data

    # :param speaker_id:    id of the speaker the truth is associated with
    # :param truth:         the JSON containing the truth data
    # :return:              201 on success, 409 on truth exists
    # """

    # old code: 
    # truthtext = truth.get("truthtext")
    # speaker = truth.get("speaker")

    # get the parent speaker
    speaker = Speaker.query.filter(Speaker.speaker_id == speaker_id).one_or_none()

    # was a speaker found?
    if speaker is None:
        abort(
            404,
            "Speaker not found for id: {speaker_id}".format(speaker_id=speaker_id),
        )

    # for the response if the truth is a duplicate for this speaker
    name = speaker.get("name")

    # old code
    # this finds any truth objects that have identical values for BOTH truthtext AND speaker
    # existing_truth = (
    #     Truth.query.filter(Truth.truthtext == truthtext)
    #     .filter(Truth.speaker == speaker)
    #     .one_or_none()
    # )

    # new code - not in tutorial, hope I did this right
    # this finds any truth objects associated with the passed-in speaker_id
    # whose "content" property is identical to the passed-in truth data

    # get the truth content (text)
    content = truth.get("content")

    # find duplicate, if any
    existing_truth = (
        Truth.query.join(Speaker, Speaker.speaker_id == Truth.speaker_id)
        .filter(Speaker.speaker_id == speaker_id)
        .filter(Truth.content == content)
        .one_or_none()
    )
    
    # Can we insert this truth?
    if existing_truth is None:

        # Create a truth instance using the schema and the passed-in truth
        schema = TruthSchema()
        new_truth = schema.load(truth, session=db.session)
        # alt:
        # new_truth = schema.load(truth, session=db.session).data

        # Add the truth to the speaker and the database
        speaker.truths.append(new_truth)
        db.session.commit()

        # Serialize and return the newly created truth in the response
        data = schema.dump(new_truth)
        # alt:
        # data = schema.dump(new_truth).data

        return (data, 201)
    
    # Otherwise, nope, truth exists already
    else:
        abort(
            409,
            "Speaker {name} already has this truth: {content}".format(
                name=name, content=content,
            ),
        )


def update(speaker_id, truth_id, truth):
    # """
    # This function updates an existing truth associated with the passed-in speaker_id

    # :param speaker_id:    id of the speaker the truth is associated with
    # :param truth_id:      id of the truth to update
    # :param truth:         the JSON containing the truth data
    # :return:              200 on success
    # """

    # Get the truth requested from the db into session
    update_truth = (
        Truth.query.filter(Speaker.speaker_id == speaker_id)
        .filter(Truth.truth_id == truth_id)
        .one_or_none()
    )

    # the following (speaker declaration, "if speaker is None", name declaration) not in the tutorial for the update function but I think it's important to verify that the speaker exists for the passed-in speaker id
    # get the parent speaker
    speaker = Speaker.query.filter(Speaker.speaker_id == speaker_id).one_or_none()

    # was a speaker found?
    if speaker is None:
        abort(
            404,
            "Speaker not found for id: {speaker_id}".format(speaker_id=speaker_id),
        )

    # for the response
    name = speaker.get("name")

    # old code:
    # Try to find an existing truth with the same properties as the update
    # truthtext = truth.get("truthtext")
    # speaker = truth.get("speaker")

    # existing_truth = (
    #     Truth.query.filter(Truth.truthtext == truthtext)
    #     .filter(Truth.speaker == speaker)
    #     .one_or_none()
    # )

    # new code - not in tutorial, hope I did this right
    # this finds any truth objects associated with the passed-in speaker_id
    # whose "content" property is identical to the passed-in truth data (what we're updating the truth to)

    # get the truth content (text)
    content = truth.get("content")

    # find duplicate, if any
    existing_truth = (
        Truth.query.join(Speaker, Speaker.speaker_id == Truth.speaker_id)
        .filter(Speaker.speaker_id == speaker_id)
        .filter(Truth.content == content)
        .one_or_none()
    )

    # Are we trying to find a truth that does not exist?
    if update_truth is None:
        abort(
            404,
            "Truth with id {truth_id}: \"{content}\" not found for speaker {name}".format(
                truth_id=truth_id, content=content, name=name
            ),
        )
    
    # Would our update create a duplicate of another truth that already exists?
    elif (
        existing_truth is not None and existing_truth.truth_id != truth_id
    ):
        abort(
            409,
            "Truth: \"{content}\" for speaker {name} already exists".format(
                content=content, name=name
            ),
        )
    
    # Otherwise go ahead and update!
    else:

        # turn the passed in truth into a db object
        schema = TruthSchema()
        update = schema.load(truth, session=db.session)
        # alt:
        # update = schema.load(truth, session=db.session).data

        # set the id to the truth we want to update
        update.speaker_id = update_truth.speaker_id
        update.truth_id = update_truth.truth_id

        # merge the new object into the old and commit it to the db
        db.session.merge(update)
        db.session.commit()

        # return updated truth in the response
        data = schema.dump(update_truth)
        # alt:
        # data = schema.dump(update_truth).data

        return data, 200


def delete(speaker_id, truth_id):
    # """
    # This function deletes a truth from the truths structure

    # :param speaker_id:    id of the speaker the truth is related to
    # :param truth_id:      id of the truth to delete
    # :return:              200 on successful deletion, 404 if not found
    # """

    # get the truth requested
    truth = (
        Truth.query.filter(Speaker.speaker_id == speaker_id)
        .filter(Truth.truth_id == truth_id)
        .one_or_none()
    )

    # did we find a truth?
    if truth is not None:
        # for response
        content = truth.get("content")

        db.session.delete(truth)
        db.session.commit()
        return make_response(
            200,
            "Truth {truth_id}: \"{content}\" was deleted".format(
                truth_id=truth_id, content=content
            ),
        )
    
    # Otherwise, nope, didn't find that truth
    else:
        abort(
            404,
            "Truth not found for id: {truth_id}".format(truth_id=truth_id),
        )

