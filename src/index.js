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
          <input type="button" value="Update" onClick={(e) => this.props.onUpdateSpeaker(this.state.name, this.state.speaker_id)} /> {/* TODO: write function for UpdateSpeaker */}
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

  speakerExists(speaker_id) {
    let speakers = this.state.allSpeakers.slice();
    let speakerIDs = speakers.map(speaker => speaker.speaker_id);
    let i = speakerIDs.indexOf(parseInt(speaker_id));
    if (speakerIDs[i]) {
      return true;
    } else {
      return false;
    }
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

  findSpeakerByName(name) {
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
      alert(message);

      if (thisSpeaker.name) {
        // found speaker with this name
        message = "found speaker with name \"" + name + "\"";
        console.log(message);
        alert(message);

        if (thisSpeaker.speaker_id || (thisSpeaker.speaker_id === 0)) {
          // found speaker's speaker_id
          message = "found speaker_id: " + thisSpeaker.speaker_id + "for speaker with name \"" + thisSpeaker.name + "\"";
          console.log(message);
          alert(message);

          return thisSpeaker.speaker_id;
        } else {
          // did not find speaker's speaker_id
          message = "did not find speaker_id";
          console.log(message);
          alert(message);

          return undefined;
        }
      } else {
        // did not find speaker with this name
        message = "did not find speaker with this name";
        console.log(message);
        alert(message);

        return undefined;
      }
    } else {
      // did not identify a speaker object
      message = "no speaker found";
      console.log(message);
      alert(message);

      return undefined;
    }

  }

  handleCreateSpeaker(input_name) {
    // post URL
    let postURL = "http://localhost:5000/api/speakers";
    // load the speakers data (unnecessary?)
    this.mountSpeakers();
    // for feedback
    let message = "";
    // establish that a name was input
    if (input_name) {
      // proceed
      // check for duplicate
      if (this.speakerTwinExists(input_name)) {
        // oh dang, a speaker with this name already exists
        message = "error: speaker with name \"" + input_name +"\" already exists";
        console.log(message);
        alert(message);
      } else {
        // no duplicate! add new speaker
        axios.post(postURL, {
          name: input_name
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
        // BUG: for some reason, this does not behave as expected. the findSpeakerByName function returns "undefined" - i think this is because of the asynchronicity of mountSpeakers, but using a .then() statement on it didn't fix the problem, because i couldn't access "this" or findSpeakerByName within the .then() statement. for all practical purposes, handleCreateSpeaker functions just fine, and i don't 100% need to provide this feedback to the user in this way, because right after this, the speakers table display updates and the user can see that their speaker has been added, and what the speaker_id is. TODO: investigate
        // confirm that the new speaker is loaded
        let new_speaker_id = this.findSpeakerByName(input_name);
        // report success to user
        message = "speaker #" + new_speaker_id + " \"" + input_name + "\" was added to the database";
        console.log(message);
        alert(message);
      }
    } else {
      // no name input
      message = "error: problem with name input"
      console.log(message);
      alert(message);
    }
  }

  handleUpdateSpeaker(name, speaker_id) {
    // TODO: write function
  }

  handleDeleteSpeaker(speaker_id) {
    // TODO: write function
  }

  truthExists(truth_id, speaker_id) {
    // TODO: make sure function accounts for edge case where a truth is somehow created that has a duplicate truth_id but is assigned to a different speaker and is in fact unique? not supposed to happen. anyway, always look up truths by both speaker_id and truth_id?
    let archiveExist = this.state.allTruths.slice();
    let truthIDarray = archiveExist.map(truth => truth.truth_id);
    let i = truthIDarray.indexOf(parseInt(truth_id));
    if (truthIDarray[i]) {
      return true;
    } else {
      return false;
    }
  }

  truthDuplicate(content, speaker_id) {
    // TODO: make this work now that speakers are objects and not just string properties
    let archiveDuplicate = this.state.allTruths.slice();
    let contentArray = archiveDuplicate.map(truth => truth.content);
    let speakerArray = archiveDuplicate.map(truth => truth.speaker.speaker_id);
    let contentIndex = contentArray.indexOf(content);
    let speakerIndex = speakerArray.indexOf(parseInt(speaker_id));
    // if both content and speaker_id have existing matches...
    if (contentArray[contentIndex] && speakerArray[speakerIndex]) {
      // ...check to see if their index values match
      if (contentIndex === speakerIndex) {
        // if their index values match, then this truth has already been spoken by the speaker with this speaker_id
        return true;
      } else {
        // otherwise (if the index values do not match) there's no duplicate
        return false;
      }
    } else {
      // if either content or speaker_id doesn't have a match, it's fine, there's no duplicate
      return false;
    }
  }

  handleTestify(content, speaker_id) {
    // TODO: refactor
    let archiveTestify = this.state.allTruths.slice();
    
  }

  handleUpdateTruth(content, speaker_id, truth_id) {
    // TODO: refactor
    let archiveUpdate = this.state.allTruths.slice();
    let arrayID = archiveUpdate.map(truthObject => truthObject.truth_id);

    this.setState({allTruths: archiveUpdate});
  }

  handleDeleteTruth(inputID) {
    // TODO: refactor
    let truthID = parseInt(inputID);

    let archiveDelete = this.state.allTruths.slice();
    let arrayID = archiveDelete.map(truthObject => truthObject.id);

    let truthIndex = arrayID.indexOf(truthID);
    let thisTruth = archiveDelete[truthIndex];

    if (inputID) {
      if (this.truthExists(inputID)) {
        alert("are you sure you want to delete this truth: '" + thisTruth.content + "'?");
        archiveDelete = archiveDelete.filter(truthObject => truthObject.id !== truthID);

        let baseURL = 'http://localhost:5000/api/truths/';
        let truthURL = baseURL + thisTruth.id.toString();

        axios.delete(truthURL)
        .then(function (response) {
          // handle success
          console.log(response);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
      } else {
        console.log("error: ", "truth #", inputID, " not found");
      }
    } else {
      console.log("error: ", "problem with ID input ", inputID);
    }

    this.setState({allTruths: archiveDelete});
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