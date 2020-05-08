# """
# This is the truths module and supports all the ReST actions for the TRUTHS collection
# """

# System modules
from datetime import datetime

# 3rd party modules
from flask import make_response, abort

def get_timestamp():
    return datetime.now().strftime(("%Y-%m-%d %H:%M:%S"))

# Data to serve with our API
TRUTHS = {
    "FFFF00": {
        "truthtext": "I like sunlight more than rain",
        "hexcode": "FFFF00",
        "timestamp": get_timestamp()
    },
    "000000": {
        "truthtext": "Your silence will not protect you",
        "hexcode": "000000",
        "timestamp": get_timestamp()
    },
    "FFD1DC": {
        "truthtext": "Gender is a myth",
        "hexcode": "FFD1DC",
        "timestamp": get_timestamp()
    }
}

# Create a handler for our read_all (GET) truths
def read_all():
    # """
    # This function responds to a request for /api/truths
    # with the complete lists of truths

    # :return:        json string of sorted list of truths
    # """

    # Create the list of truths from our data
    return [TRUTHS[key] for key in sorted(TRUTHS.keys())]

def read_one(hexcode):
    # """
    # This function responds to a request for /api/truths/{hexcode}
    # with one matching truth from truths
    # :param hexcode:   hex code of truth to find
    # :return:          truth matching hex code
    # """

    # Does the truth exist in truths?
    if hexcode in TRUTHS:
        truth = TRUTHS.get(hexcode)
    
    # otherwise, nope, not found
    else:
        abort(
            404, "Truth with hex code {hexcode} not found".format(hexcode=hexcode)
        )
    
    return truth

def create(truth):
    # """
    # This function creates a new truth in the truths structure
    # based on the passed-in truth data

    # :param truth:   truth to create in truths structure
    # :return:        201 on success, 406 on truth exists
    # """

    hexcode = truth.get("hexcode", None)
    truthtext = truth.get("truthtext", None)

    # Does the truth exist already?
    if hexcode not in TRUTHS and hexcode is not None:
        TRUTHS[hexcode] = {
            "hexcode": hexcode,
            "truthtext": truthtext,
            "timestamp": get_timestamp(),
        }
        return make_response(
            "{hexcode} successfully created".format(hexcode=hexcode), 201
        )

    # Otherwise, it exists, that's an error
    else:
        abort(
            406,
            "Truth with hex code {hexcode} already exists".format(hexcode=hexcode),
        )

def update(hexcode, truth):
    # """
    # This function updates an existing truth in the truths structure

    # :param hexcode: hex code of truth to update in the truths structure
    # :param truth:   truth to update
    # :return:        updated truths structure
    # """

    # Does the truth exist in truths?
    if hexcode in TRUTHS:
        TRUTHS[hexcode]["truthtext"] = truth.get("truthtext")
        TRUTHS[hexcode]["timestamp"] = get_timestamp()

        return TRUTHS[hexcode]

    # otherwise, nope, that's an error
    else:
        abort(
            404, "Truth with hex code {hexcode} not found".format(hexcode=hexcode),
        )

def delete(hexcode):
    # """
    # This function deletes a truth from the truths structure

    # :param hexcode: hex code of truth to delete
    # :return:        200 on successful deletion, 404 if not found
    # """

    # Does the truth to delete exist?
    if hexcode in TRUTHS:
        del TRUTHS[hexcode]
        
        return make_response(
            "{hexcode} successfully deleted".format(hexcode=hexcode), 200
        )

    # Otherwise, nope, truth to delete not found
    else:
        abort(
            404, "Truth with hex code {hexcode} not found".format(hexcode=hexcode)
        )
