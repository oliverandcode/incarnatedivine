import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import axios from 'axios';
import moment from 'moment';

export function Speaker(props) {
  return(
    <tr>
      <td>{props.speaker_id}</td>
      <td>{props.name}</td>
      <td>{props.timestamp}</td>
    </tr>
  );
}

export function Truth(props) {
  return(
    <tr>
      <td>{props.truth_id}</td>
      <td>{props.content}</td>
      <td>{props.speaker}</td>
      <td>{props.timestamp}</td>
    </tr>
  );
}

export function Display(props) {
  return(
    <div id="display-tables" className="display-tables">
        <div id="speaker-table-div" className="speaker-table-div">
          <h3 id="speaker-list-title" className="speaker-list-title">Speakers</h3>
          <table id="speaker-table" className="speaker-table">
            <thead>
              <tr id="table-head-row">
                <th>ID</th>
                <th>Name</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {props.speakerDisplay.map(
                (speaker) =>
                (<Speaker key={speaker.speaker_id}
                  speaker_id={speaker.speaker_id}
                  name={speaker.name} 
                  timestamp={speaker.timestamp} />)
              )}
            </tbody>
          </table>
        </div>
        <div id="truth-table-div" className="truth-table-div">
          <h3 id="truth-list-title" className="truth-list-title">Archive</h3>
          <table id="truth-table" className="truth-table">
            <thead>
              <tr id="table-head-row">
                <th>ID</th>
                <th>Truth</th>
                <th>Speaker</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {props.truthDisplay.map(
                (truth) =>
                (<Truth key={truth.truth_id}
                  truth_id={truth.truth_id}
                  content={truth.content} 
                  speaker={truth.speaker.name} 
                  timestamp={truth.timestamp} />)
              )}
            </tbody>
          </table>
        </div>
    </div>
  );  
}

class SpeakerEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      speaker_id: "",
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    if (event.target.name === "name") {
      this.setState({name: event.target.value});
    } else if (event.target.name === "speaker-id") {
      this.setState({speaker_id: event.target.value});
    }
  }

  render() {
    return (
      <div id="speaker-form-div" className="speaker-form-div">
        <form id="speaker-form" className="speaker-form">
          <label htmlFor="name">
            Speaker, what is your name?
            <input type="text" value={this.state.name} onChange={this.handleChange} name="name" />
          </label>
          <br />
          <label htmlFor="speaker-id">
            Speaker ID (update/delete)
            <input type="text" value={this.state.speaker_id} onChange={this.handleChange} name="speaker-id" />
          </label>
          <br />
          <input type="button" value="Create" onClick={(e) => this.props.onCreateSpeaker(this.state.name)} /> {/* TODO: write function for CreateSpeaker */}
          <input type="button" value="Update" onClick={(e) => this.props.onUpdateSpeaker(this.state.speaker_id, this.state.name)} /> {/* TODO: write function for UpdateSpeaker */}
          <input type="button" value="Delete" onClick={(e) => this.props.onDeleteSpeaker(this.state.speaker_id)} /> {/* TODO: write function for DeleteSpeaker */}
        </form>
      </div>
    );
  }
}

class TruthEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      speaker_id: "",
      truth_id: "",
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    if (event.target.name === "content") {
      this.setState({content: event.target.value});
    } else if (event.target.name === "speaker-id") {
      this.setState({speaker_id: event.target.value});
    } else if (event.target.name === "truth-id") {
      this.setState({truth_id: event.target.value});
    }
  }

  render() {
    return (
      <div id="truth-form-div" className="truth-form-div">
        <form id="truth-form" className="truth-form">
          <label htmlFor="content">
            Speaker, what is your truth?
            <input type="text" value={this.state.content} onChange={this.handleChange} name="content" />
          </label>
          <br />
          <label htmlFor="speaker-id">
            Speaker ID
            <input type="text" value={this.state.speaker_id} onChange={this.handleChange} name="speaker-id" />
          </label>
          <br />
          <label htmlFor="truth-id">
            Truth ID (update/delete)
            <input type="text" value={this.state.truth_id} onChange={this.handleChange} name="truth-id" />
          </label>
          <br />
          <input type="button" value="Testify" onClick={(e) => this.props.onTestify(this.state.content, this.state.speaker_id)} /> {/* TODO: rewrite function for Testify */}
          <input type="button" value="Update" onClick={(e) => this.props.onUpdateTruth(this.state.content, this.state.speaker_id, this.state.truth_id)} /> {/* TODO: rewrite function for UpdateTruth */}
          <input type="button" value="Delete" onClick={(e) => this.props.onDeleteTruth(this.state.speaker_id, this.state.truth_id)} /> {/* TODO: rewrite function for DeleteTruth */}
        </form>
      </div>
    );
  }
}

class TruthCapture extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allSpeakers: [
        {
          speaker_id: 1,
          name: "Anonymous",
          timestamp: "1981-10-31 00:00:00",
          truths: [
            {
              truth_id: 1,
              content: "I like sunlight more than rain",
              timestamp: "2014-09-27 12:00:00",
            },
            {
              truth_id: 2,
              content: "Selfishness",
              timestamp: "2018-09-27 21:00:00",
            },
            {
              truth_id: 3,
              content: "I cried at the temple at Burning Man",
              timestamp: "2019-06-27 12:00:00",
            },
          ],
        },
        {
          speaker_id: 2,
          name: "Audre Lorde",
          timestamp: "1934-02-18 12:00:00",
          truths: [
            {
              truth_id: 4,
              content: "Your silence will not protect you",
              timestamp: "1977-12-28 00:00:00",
            },
          ],
        },
        {
          speaker_id: 3,
          name: "Oliver Ayers",
          timestamp: "1990-02-16 15:43:00",
          truths: [
            {
              truth_id: 5,
              content: "Gender is a myth",
              timestamp: "2020-09-27 00:00:00",
            },
          ]
        },
        {
          speaker_id: 4,
          name: "Bailey Davenport",
          timestamp: "1990-01-02 00:00:00",
          truths: [
            {
              truth_id: 6,
              content: "There is a war going on",
              timestamp: "2017-09-27 00:00:00",
            },
            {
              truth_id: 7,
              content: "Your silence will not save you",
              timestamp: "2009-09-27 00:00:00",
            },
          ],
        },
      ],
      allTruths: [
        {
          truth_id: 1,
          content: "I like sunlight more than rain",
          timestamp: "2014-09-27 12:00:00",
          speaker: {
            speaker_id: 1,
            name: "Anonymous",
            timestamp: "1981-10-31 00:00:00",
          }
        },
        {
          truth_id: 2,
          content: "Selfishness",
          timestamp: "2018-09-27 21:00:00",
          speaker: {
            speaker_id: 1,
            name: "Anonymous",
            timestamp: "1981-10-31 00:00:00",
          }
        },
        {
          truth_id: 3,
          content: "I cried at the temple at Burning Man",
          timestamp: "2019-06-27 12:00:00",
          speaker: {
            speaker_id: 1,
            name: "Anonymous",
            timestamp: "1981-10-31 00:00:00",
          }
        },
        {
          truth_id: 4,
          content: "Your silence will not protect you",
          timestamp: "1977-12-28 00:00:00",
          speaker: {
            speaker_id: 2,
            name: "Audre Lorde",
            timestamp: "1934-02-18 12:00:00",
          }
        },
        {
          truth_id: 5,
          content: "Gender is a myth",
          timestamp: "2020-09-27 00:00:00",
          speaker: {
            speaker_id: 3,
            name: "Oliver Ayers",
            timestamp: "1990-02-16 15:43:00",
          }
        },
        {
          truth_id: 6,
          content: "There is a war going on",
          timestamp: "2017-09-27 00:00:00",
          speaker: {
            speaker_id: 4,
            name: "Bailey Davenport",
            timestamp: "1990-01-02 00:00:00",
          }
        },
        {
          truth_id: 7,
          content: "Your silence will not save you",
          timestamp: "2009-09-27 00:00:00",
          speaker: {
            speaker_id: 4,
            name: "Bailey Davenport",
            timestamp: "1990-01-02 00:00:00",
          }
        },
      ]
    };
    this.handleCreateSpeaker = this.handleCreateSpeaker.bind(this);
    this.handleUpdateSpeaker = this.handleUpdateSpeaker.bind(this);
    this.handleDeleteSpeaker = this.handleDeleteSpeaker.bind(this);
    
    this.handleTestify = this.handleTestify.bind(this);
    this.handleUpdateTruth = this.handleUpdateTruth.bind(this);
    this.handleDeleteTruth = this.handleDeleteTruth.bind(this);
  }

  // const baseURL = "http://localhost:5000/api";

  speakerExists(speaker_id) {
    // this function retrieves all the speaker_id data. If the input speaker_id is included in that data, the function returns true. If it is not, the function returns false.
    // reload speaker data
    this.mountSpeakers();
    // convert speaker_id input to int, if it isn't already
    speaker_id = parseInt(speaker_id);
    // array of all speaker objects
    let speakers = this.state.allSpeakers.slice();
    // array of IDs for all speaker objects
    let speakerIDs = speakers.map(speaker => speaker.speaker_id);
    return (speakerIDs.includes(speaker_id));
  }

  speakerTwinExists(name) {
    // this checks to see if there are any speakers in the speakers database with the same "name" property as the input name
    let speakers = this.state.allSpeakers.slice();
    let speakerNames = speakers.map(speaker => speaker.name);
    let i = speakerNames.indexOf(name);
    if (speakerNames[i]) {
      return true;
    } else {
      return false;
    }
  }

  findSpeakerByID(speaker_id) {
    // this function looks up a speaker object by its speaker_id, and if it exists, returns the speaker object
    this.mountSpeakers();
    let speakers = this.state.allSpeakers.slice();
    let speakerIDs = speakers.map(speaker => speaker.speaker_id);
    let i = speakerIDs.indexOf(parseInt(speaker_id));
    let thisSpeaker = speakers[i];
    let message = "";
    if (thisSpeaker) {
      // successfully identified a speaker object
      message = "Speaker object found: " + thisSpeaker.name;
      console.log(message);
      return thisSpeaker;
    } else {
      // did not find speaker object
      message = "No speaker found for speaker_id: " + speaker_id;
      console.log(message);
      return undefined;
    }
  }

  findSpeakerByName(name) {
    // this function looks up a speaker by its name property, and if it exists, returns the speaker object
    // reset state's allSpeakers property
    this.mountSpeakers();
    let speakers = this.state.allSpeakers.slice();
    let speakerNames = speakers.map(speaker => speaker.name);
    let i = speakerNames.indexOf(name);
    let thisSpeaker = speakers[i];
    // for feedback
    let message = "";
    if (thisSpeaker) {
      // successfully identified a speaker object
      message = "Speaker object found: " + thisSpeaker.name;
      console.log(message);
      return thisSpeaker;
    } else {
      // did not find speaker object
      message = "No speaker found with the name: " + name;
      console.log(message);
      return undefined;
    }
  }

  findSpeakerIDByName(name) {
    // this function looks up a speaker object by its name property, and if it exists, returns the speaker_id
    // BUG: this function can't find a newly created speaker, for some reason - despite adding "this.mountSpeakers()" to try to refresh the data. clearly that's not how you do that, but i don't know how to fix it. it doesn't strictly matter, at this point, but it bothers me that i don't understand it. 
    // TODO: come back to this and figure it out.
    let message = "";
    this.mountSpeakers();
    let speakers = this.state.allSpeakers.slice();
    let speakerNames = speakers.map(speaker => speaker.name);
    let i = speakerNames.indexOf(name);
    let thisSpeaker = speakers[i];
    if (thisSpeaker) {
      // successfully identified a speaker object with this name property
      message = "speaker found";
      console.log(message);

      if (thisSpeaker.name) {
        // found speaker with this name
        message = "found speaker with name \"" + name + "\"";
        console.log(message);

        if (thisSpeaker.speaker_id || (thisSpeaker.speaker_id === 0)) {
          // found speaker's speaker_id
          message = "found speaker_id: " + thisSpeaker.speaker_id + "for speaker with name \"" + thisSpeaker.name + "\"";
          console.log(message);

          return thisSpeaker.speaker_id;
        } else {
          // did not find speaker's speaker_id
          message = "did not find speaker_id";
          console.log(message);

          return undefined;
        }
      } else {
        // did not find speaker with this name
        message = "did not find speaker with this name";
        console.log(message);

        return undefined;
      }
    } else {
      // did not identify a speaker object
      message = "no speaker found";
      console.log(message);

      return undefined;
    }

  }

  // TODO: bug with user feedback, not critical (see below)
  handleCreateSpeaker(name) {
    // post speaker URL
    let postSpeakerURL = "http://localhost:5000/api/speakers";
    // load the speakers data
    this.mountSpeakers();
    // for user feedback
    let message = "";
    // establish that a name was input
    if (name) {
      // proceed
      // check for duplicate
      if (this.speakerTwinExists(name)) {
        // oh dang, a speaker with this name already exists
        message = "Error: A speaker with the name \"" + name + "\" already exists. Please enter a different name.";
        console.log(message);
        alert(message);
      } else {
        // no duplicate! add new speaker
        axios.post(postSpeakerURL, {
          name: name
        })
        .then(function (response) {
          // handle success
          console.log(response);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
        // set state (frontend) to match updated database (backend)
        this.mountSpeakers();
        // BUG: for some reason, this does not behave as expected. the findSpeakerIDByName function returns "undefined" - i think this is because of the asynchronicity of mountSpeakers, but using a .then() statement on it didn't fix the problem, because i couldn't access "this" or findSpeakerIDByName within the .then() statement. for all practical purposes, handleCreateSpeaker functions just fine, and i don't 100% need to provide this feedback to the user in this way, because right after this, the speakers table display updates and the user can see that their speaker has been added, and what the speaker_id is. TODO: investigate
        // confirm that the new speaker is loaded
        let new_speaker_id = this.findSpeakerIDByName(name);
        // let new_speaker = this.findSpeakerByName(name);
        // report success to user
        message = "Success: Speaker #" + new_speaker_id + " \"" + name + "\" was added to the database.";
        // message = "Speaker #" + new_speaker.speaker_id + " \"" + new_speaker.name + "\" was added to the database";
        console.log(message);
        alert(message);
      }
    } else {
      // no name input
      message = "Error: No name received. Please enter a name.";
      console.log(message);
      alert(message);
    }
  }

  // TODO: bug with user feedback on success, not critical, same as handleCreateSpeaker (see notes)
  handleUpdateSpeaker(speaker_id, name) {
    // load speakers data
    this.mountSpeakers();
    // baseURL
    const baseURL = "http://localhost:5000/api";
    // for user feedback
    let message = "";
    // establish that a speaker_id was input
    if (speaker_id) {
      // received speaker_id: proceed
      // establish that a name was input
      if (name) {
        // received name: proceed
        // does speaker exist?
        if (this.speakerExists(speaker_id)) {
          // speaker found for input speaker_id: proceed
          // check for duplicate
          if (!(this.speakerTwinExists(name))) {
            // unique name: proceed
            // update/put speaker URL
            let putSpeakerURL = baseURL + "/speakers/" + speaker_id;
            // get old speaker name for user feedback
            let thisSpeaker = this.findSpeakerByID(speaker_id);
            let oldSpeakerName = thisSpeaker.name;
            message = "Are you sure you want to update the name of speaker #" + speaker_id + " from \"" + oldSpeakerName + "\" to \"" + name + "\"?";
            alert(message);
            // update speaker
            axios.put(putSpeakerURL, {
              name: name
            })
            .then(function (response) {
              // handle success
              console.log(response);
            })
            .catch(function (error) {
              // handle error
              console.log(error);
            });
            // reload speakers data
            this.mountSpeakers();
            // retrieve this speaker's new name
            // BUG: this is not retrieving the NEW name but the OLD name. Not critical but I would like to fix it.
            thisSpeaker = this.findSpeakerByID(speaker_id);
            let newSpeakerName = thisSpeaker.name;
            // report success to user
            message = "Success: Speaker #" + speaker_id + " now has the name \"" + newSpeakerName + "\"";
            console.log(message);
            // temporary user feedback message until I can fix bug
            message = "Success: Speaker #" + speaker_id + " now has the name \"" + name + "\"";
            alert(message);
          } else {
            // speaker with this name already exists
            message = "Error: A speaker with the name \"" + name + "\" already exists. Please enter a different name.";
            console.log(message);
            alert(message);
          }
        } else {
          // did not find speaker for input speaker_id
          message = "Error: Speaker #" + speaker_id + " not found. Please enter a valid speaker ID.";
          console.log(message);
          alert(message);
        }
      } else {
        // did not receive name
        message = "Error: No name received. Please enter a new name for this speaker.";
        console.log(message);
        alert(message);
      }
    } else {
      // did not receive speaker_id
      message = "Error:  No speaker ID received. Please enter the ID for the speaker you wish to update.";
      console.log(message);
      alert(message);
    }
  }

  // TODO: instead of deleting truths belonging to speaker, reassign them to "Anonymous" - write a reassignation function
  handleDeleteSpeaker(speaker_id) {
    // load the speakers data
    this.mountSpeakers();
    // for user feedback
    var message = "";
    // establish that a speaker_id was input
    if (speaker_id) {
      // received speaker_id: proceed
      // delete speaker URL
      let deleteSpeakerURL = "http://localhost:5000/api/speakers/" + speaker_id;
      // establish that input speaker_id is valid
      if (this.speakerExists(speaker_id)) {
        // valid speaker_id: proceed
        let speakers = this.state.allSpeakers.slice();
        let speakerIDs = speakers.map(speaker => speaker.speaker_id);
        let i = speakerIDs.indexOf(parseInt(speaker_id));
        let thisSpeaker = speakers[i];
        message = "Are you sure you want to delete speaker #" + speaker_id + ": \"" + thisSpeaker.name + "\"?";
        alert(message);
        // delete speaker
        axios.delete(deleteSpeakerURL)
        .then(function (response) {
          // handle success
          console.log(response);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        // report success to user
        message = "Success: Speaker #" + speaker_id + " \"" + thisSpeaker.name + "\" was deleted.";
        console.log(message);
        alert(message);
      } else {
        // did not find speaker for input speaker_id
        message = "Error: Speaker #" + speaker_id + " not found. Please enter a valid speaker ID.";
        console.log(message);
        alert(message);
      }
    } else {
      // did not receive speaker_id
      message = "Error: No speaker ID received. Please enter a speaker ID.";
      console.log(message);
      alert(message);
    }
  }

  truthExists(truth_id, speaker_id) {
    // this function returns true if the input IDs are both valid AND the truth_id indicates a truth object that is associated with a speaker object indicated by the speaker_id. If either ID is invalid, or the ID combination is invalid, it returns false.
    // reload speaker data
    this.mountSpeakers();
    // convert ID inputs to int, if they aren't already
    speaker_id = parseInt(speaker_id);
    truth_id = parseInt(truth_id);
    // establish that speaker_id is valid
    if (this.speakerExists(speaker_id)) {
      // get the speaker object
      let thisSpeaker = this.findSpeakerByID(speaker_id);
      // array of all truth objects associated with this speaker
      let speakerTruths = thisSpeaker.truths;
      // array of IDs for all truth objects associated with this speaker
      let speakerTruthIDs = speakerTruths.map(truth => truth.truth_id);
      return (speakerTruthIDs.includes(truth_id));
    } else {
      // invalid speaker_id
      console.log("invalid speaker_id");
      return false;
    }
  }

  // note: a truth object is always supposed to be assigned a unique truth_id upon creation, but what if an error occurs? should this function look up by speaker_id as well as truth_id?
  findTruthByID(truth_id) {
    // this function looks up a truth object by its truth_id, and if it exists, returns the truth object
    this.mountTruths();
    let truths = this.state.allTruths.slice();
    let truthIDs = truths.map(truth => truth.truth_id);
    let i = truthIDs.indexOf(parseInt(truth_id));
    let thisTruth = truths[i];
    let message = "";
    if (thisTruth) {
      // successfully identified a truth object
      message = "Truth object found: " + thisTruth.content;
      console.log(message);
      return thisTruth;
    } else {
      // did not find truth object
      message = "No truth found for truth_id: " + truth_id;
      console.log(message);
      return undefined;
    }
  }

  truthTwinExists(content, speaker_id) {
    // this function retrieves the speaker associated with the input speaker_id, and then retrieves the array of truth objects associated with that speaker. If the input content is identical to the content of any of those truth objects, the function returns True. If not, the function returns False.
    let speakers = this.state.allSpeakers.slice();
    // find the speaker
    let thisSpeaker = this.findSpeakerByID(parseInt(speaker_id));
    // get all the truth objects for this speaker
    let speakerTruths = thisSpeaker.truths.slice();
    // get all the contents (text) of those truths
    speakerTruths = speakerTruths.map(truth => truth.content);
    // find the index of the truth content that matches the input content (if it exists)
    let i = speakerTruths.indexOf(content);
    if (speakerTruths[i]) {
      return true;
    } else {
      return false;
    }
  }

  handleTestify(content, speaker_id) {
    // load truths data
    this.mountTruths();
    // for user feedback
    let message = "";
    // establish that a speaker_id was input
    if (speaker_id) {
      // establish that the input speaker_id is valid
      if (this.speakerExists(speaker_id)) {
        // speaker found for input speaker_id! proceed
        // post truth URL
        let postTruthURL = "http://localhost:5000/api/speakers/" + speaker_id + "/truths";
        // establish that content (text) was input
        if (content) {
          // check for duplicate (identical truth content, same speaker)
          if (this.truthTwinExists(content, speaker_id)) {
            // this truth has already been shared by this speaker, do not create
            message = "Error: A truth with the text: \n\n" + content + "\n\n has already been created for this speaker.";
            console.log(message);
            alert(message);
          } else {
            speaker_id = parseInt(speaker_id);
            // no duplicate! add new truth!
            axios.post(postTruthURL, {
              content: content,
              speaker_id: speaker_id
            })
            .then(function (response) {
              // handle success
              console.log(response);
            })
            .catch(function (error) {
              // handle error
              console.log(error);
            });
            // set state (frontend) to match updated database (backend)
            this.mountTruths();
            // report success to user (TODO: report it with the NAME of the speaker and the ID of the newly created truth)
            message = "Success: New truth added for speaker #" + speaker_id + ": \n\n" + content;
            console.log(message);
            alert(message);
          }
        } else {
          // did not receive content (text)
          message = "Error: No content (text) received. Please enter text for this truth.";
          console.log(message);
          alert(message);
        }
      } else {
        // did not find speaker for input speaker_id
        message = "Error: Speaker #" + speaker_id + " not found. Please enter a valid speaker ID.";
        console.log(message);
        alert(message);
      }      
    } else {
      // did not receive speaker_id
      message = "Error: No speaker ID received. Please enter a speaker ID.";
      console.log(message);
      alert(message);
    }
  }

  // TODO: bug with user feedback on success, not critical, same as above (see notes)
  handleUpdateTruth(content, speaker_id, truth_id) {
    // load truths data
    this.mountTruths();
    // baseURL
    const baseURL = "http://localhost:5000/api";
    // for user feedback
    let message = "";
    // establish that speaker_id was input
    if (speaker_id) {
      // received speaker_id: proceed
      // establish that truth_id was input
      if (truth_id) {
        // received truth_id: proceed
        // establish that content was input
        if (content) {
          // received content: proceed
          // establish that input speaker_id is valid
          if (this.speakerExists(speaker_id)) {
            // valid speaker_id: proceed
            // establish that truth exists
            if (this.truthExists(truth_id, speaker_id)) {
              // truth exists: proceed
              // check for duplicate
              if (!(this.truthTwinExists(content, speaker_id))) {
                // unique truth content for this speaker: proceed
                // update/put truth URL
                let putTruthURL = baseURL + "/speakers/" + speaker_id + "/truths/" + truth_id;
                // get speaker name and old truth content, for user feedback
                let thisTruth = this.findTruthByID(truth_id);
                let oldTruthContent = thisTruth.content;
                let truthSpeaker = thisTruth.speaker.name;
                message = "Are you sure you want to update the content (text) of truth #" + truth_id + " for speaker #" + speaker_id + " \"" + truthSpeaker + "\"? \n\nOld content: \n\n" + oldTruthContent + "\n\nwill be updated to: \n\n" + content;
                alert(message);
                // update truth
                axios.put(putTruthURL, {
                  content: content
                })
                .then(function (response) {
                  // handle success
                  console.log(response);
                })
                .catch(function (error) {
                  // handle error
                  console.log(error);
                });
                // reload truths data
                this.mountTruths();
                // retrieve truth's new content
                thisTruth = this.findTruthByID(truth_id);
                let newtruthContent = thisTruth.content;
                // report success to user
                message = "Success: The content (text) of truth #" + truth_id + " for speaker #" + speaker_id + " \"" + truthSpeaker + "\" has been updated to: \n\n" + newtruthContent;
                console.log(message);
                // temporary user feedback message until I can fix bug
                message = "Success: The content (text) of truth #" + truth_id + " for speaker #" + speaker_id + " \"" + truthSpeaker + "\" has been updated to: \n\n" + content;
                alert(message);
              } else {
                // a truth with this content already exists for this speaker
                message = "Error: A truth with the text: \n\n" + content + "\n\n has already been created for this speaker.";
                console.log(message);
                alert(message);
              }
            } else {
              // did not find truth with these IDs
              message = "Error: Truth #" + truth_id + " for speaker #" + speaker_id + " not found. Please enter a valid truth ID/speaker ID combination.";
              console.log(message);
              alert(message);
            }
          } else {
            // did not find speaker for input speaker_id
            message = "Error: Speaker #" + speaker_id + " not found. Please enter a valid speaker ID.";
            console.log(message);
            alert(message);
          }
        } else {
          // did not receive content (text)
          message = "Error: No content (text) received. Please enter new text for this truth.";
          console.log(message);
          alert(message);
        }
      } else {
        // did not receive truth_id
        message = "Error: No truth ID received. Please enter a truth ID.";
        console.log(message);
        alert(message);
      }
    } else {
      // did not receive speaker_id
      message = "Error: No speaker ID received. Please enter a speaker ID.";
      console.log(message);
      alert(message);
    }
  }

  handleDeleteTruth(speaker_id, truth_id) {
    // load the truths data
    this.mountTruths();
    // baseURL
    const baseURL = "http://localhost:5000/api";
    // for user feedback
    var message = "";
    // establish that a speaker_id was input
    if (speaker_id) {
      // received speaker_id: proceed
      // establish that a truth_id was input
      if (truth_id) {
        // received truth_id: proceed
        // establish that the input speaker_id is valid
        if (this.speakerExists(speaker_id)) {
          // valid speaker_id: proceed
          // establish that truth exists
          if (this.truthExists(truth_id, speaker_id)) {
            // truth exists! proceed
            // delete truth URL
            let deleteTruthURL = baseURL + "/speakers/" + speaker_id + "/truths/" + truth_id;
            // get speaker name and truth content, for user feedback
            let thisTruth = this.findTruthByID(truth_id);
            let truthContent = thisTruth.content;
            let truthSpeaker = thisTruth.speaker.name;
            message = "Are you sure you want to delete truth #" + truth_id + ": \n\n" + truthContent + "\n\nfor speaker #" + speaker_id + " \"" + truthSpeaker + "\" from the Archive?";
            alert(message);
            // delete truth
            axios.delete(deleteTruthURL)
            .then(function (response) {
              // handle success
              console.log(response);
            })
            .catch(function (error) {
              // handle error
              console.log(error);
            });
            // report success to user
            message = "Success: Truth #" + truth_id + ": \n\n" + truthContent + "\n\nfor speaker #" + speaker_id + " \"" + truthSpeaker + "\" was deleted from the Archive.";
            console.log(message);
            alert(message);
          } else {
            // did not find truth with these IDs
            message = "Error: Truth #" + truth_id + " for speaker #" + speaker_id + " not found. Please enter a valid truth ID/speaker ID combination.";
            console.log(message);
            alert(message);
          }
        } else {
          // did not find speaker for input speaker_id
          message = "Error: Speaker #" + speaker_id + " not found. Please enter a valid speaker ID.";
          console.log(message);
          alert(message);
        }
      } else {
        // did not receive truth_id
        message = "Error: No truth ID received. Please enter a truth ID.";
        console.log(message);
        alert(message);
      }
    } else {
      // did not receive speaker_id
      message = "Error: No speaker ID received. Please enter a speaker ID.";
      console.log(message);
      alert(message);
    }
  }

  async mountSpeakers() {
    console.log("[mountSpeakers]: re/loading speakers data");

    let remoteSpeakers = await axios.get("http://localhost:5000/api/speakers");
    remoteSpeakers = remoteSpeakers.data;
    console.log("[mountSpeakers]: speakers received:", remoteSpeakers);
    this.setState({ allSpeakers: remoteSpeakers });
  }

  async mountTruths() {
    console.log("[mountTruths]: re/loading truths data");

    let remoteTruths = await axios.get("http://localhost:5000/api/truths");
    remoteTruths = remoteTruths.data;
    console.log("[mountTruths]: truths received:", remoteTruths);
    this.setState({ allTruths: remoteTruths });
  }

  async componentDidMount() {
    console.log("truth capture app loaded");

    this.mountSpeakers();

    this.mountTruths();

  }

  render() {
    const archiveTruths = this.state.allTruths;
    const archiveSpeakers = this.state.allSpeakers;

    return (
      <div className="container">
        <div id="truthcapture">
          <div className="entry">
            <SpeakerEntry
              onCreateSpeaker={this.handleCreateSpeaker}
              onUpdateSpeaker={this.handleUpdateSpeaker}
              onDeleteSpeaker={this.handleDeleteSpeaker}
             />
            <TruthEntry 
              onTestify={this.handleTestify} 
              onUpdateTruth={this.handleUpdateTruth} 
              onDeleteTruth={this.handleDeleteTruth}
            />
          </div>
          <hr />
          <div className="display">
            <Display truthDisplay={archiveTruths} speakerDisplay={archiveSpeakers} />
          </div>
        </div>
      </div>
    );
  }
}

// ==============

ReactDOM.render(
  <TruthCapture />,
  document.getElementById('root')
);