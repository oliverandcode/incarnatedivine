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
    Truth,
    TruthSchema,
)

# Create a handler for our read_all (GET) truths
def read_all():
    # """
    # This function responds to a request for /api/truths
    # with the complete lists of truths

    # :return:        json string of sorted list of truths
    # """
    
    # Create the list of truths from our data
    truths = Truth.query.order_by(Truth.hexcode).all()
    
    # Serialize the data for the response
    truth_schema = TruthSchema(many=True)
    data = truth_schema.dump(truths)
    return data


def read_one(id):
    # """
    # This function responds to a request for /api/truths/{id}
    # with one matching truth from truths
    # :param id:   id of truth to find
    # :return:          truth matching id
    # """

    # Get the truth requested
    truth = Truth.query.filter(Truth.id == id).one_or_none()
    
    # Did we find a truth?
    if truth is not None:

        # Serialize the data for the response (implicit 'many=False')
        truth_schema = TruthSchema()
        data = truth_schema.dump(truth)
        return data
    
    # Otherwise, nope, didn't find that person
    else:
        abort(
            404,
            "Truth not found for id: {id}".format(id=id),
        )


def create(truth):
    # """
    # This function creates a new truth in the truths structure
    # based on the passed-in truth data

    # :param truth:   truth to create in truths structure
    # :return:        201 on success, 406 on truth exists
    # """

    truthtext = truth.get("truthtext")
    hexcode = truth.get("hexcode")

    existing_truth = (
        Truth.query.filter(Truth.truthtext == truthtext)
        .filter(Truth.hexcode == hexcode)
        .one_or_none()
    )
    
    # Can we insert this truth?
    if existing_truth is None:

        # Create a truth instance using the schema and the passed-in truth
        schema = TruthSchema()
        new_truth = schema.load(truth, session=db.session)

        # Add the truth to the database
        db.session.add(new_truth)
        db.session.commit()

        # Serialize and return the newly created truth in the response
        data = schema.dump(new_truth)

        return data, 201
    
    # Otherwise, nope, truth exists already
    else:
        abort(
            409,
            "Truth {truthtext} with hexcode {hexcode} already exists".format(
                truthtext=truthtext, hexcode=hexcode
            )
        )


def update(id, truth):
    # """
    # This function updates an existing truth in the truths structure

    # :param id: id of the truth to update in the truths structure
    # :param truth:   truth to update
    # :return:        updated truths structure
    # """

    # Get the truth requested from the db into session
    update_truth = Truth.query.filter(
        Truth.id == id
    ).one_or_none()

    # Try to find an existing truth with the same properties as the update
    truthtext = truth.get("truthtext")
    hexcode = truth.get("hexcode")

    existing_truth = (
        Truth.query.filter(Truth.truthtext == truthtext)
        .filter(Truth.hexcode == hexcode)
        .one_or_none()
    )

    # Are we trying to find a truth that does not exist?
    if update_truth is None:
        abort(
            404,
            "Truth not found for id: {id}".format(id=id),
        )
    
    # Would our update create a duplicate of another truth that already exists?
    elif (
        existing_truth is not None and existing_truth.id != id
    ):
        abort(
            409,
            "Truth {truthtext} with hexcode {hexcode} already exists".format(
                truthtext=truthtext, hexcode=hexcode
            ),
        )
    
    # Otherwise go ahead and update!
    else:

        # turn the passed in truth into a db object
        schema = TruthSchema()
        update = schema.load(truth, session=db.session)

        # set the id to the truth we want to update
        update.id = update_truth.id

        # merge the new object into the old and commit it to the db
        db.session.merge(update)
        db.session.commit()

        # return updated truth in the response
        data = schema.dump(update_truth)

        return data, 200


def delete(id):
    # """
    # This function deletes a truth from the truths structure

    # :param id: id of truth to delete
    # :return:        200 on successful deletion, 404 if not found
    # """

    # get the truth requested
    truth = Truth.query.filter(Truth.id == id).one_or_none()

    # did we find a truth?
    if truth is not None:
        db.session.delete(truth)
        db.session.commit()
        return make_response(
            "Truth {id} deleted".format(id=id), 200,
        )
    
    # Otherwise, nope, didn't find that truth
    else:
        abort(
            404,
            "Truth not found for id: {id}".format(id=id),
        )
