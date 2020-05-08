from datetime import datetime

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

# Create a handler for our read (GET) truths
def read():
    # """
    # This function responds to a request for /api/truths
    # with the complete lists of truths

    # :return:        sorted list of truths
    # """
    
    # Create the list of truths from our data
    return [TRUTHS[key] for key in sorted(TRUTHS.keys())]