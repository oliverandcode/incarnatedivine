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

  handleCreateSpeaker(name) {
    // TODO: write function
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
    
    if (content && speaker_id) {
      if (this.truthDuplicate(content, speaker_id)) {
        console.log("error: this speaker already has an identical truth");
      } else {
        const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
        archiveTestify.push(
          {speaker_id: speaker_id, timestamp: timestamp, content: content}
        );
        axios.post('http://localhost:5000/api/truths', {
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
        })
      }
    } else {
      console.log("error: ", "problem with content or speaker input");
    }

    this.setState({allTruths: archiveTestify});
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

  async componentDidMount() {
    console.log("truth capture app loaded");

    let remoteTruths = await axios.get("http://localhost:5000/api/truths");
    remoteTruths = remoteTruths.data;
    console.log("[truthcapture/componentDidMount]: truths received:", remoteTruths);
    this.setState({ allTruths: remoteTruths });

    let remoteSpeakers = await axios.get("http://localhost:5000/api/speakers");
    remoteSpeakers = remoteSpeakers.data;
    console.log("[truthcapture/componentDidMount]: speakers received:", remoteSpeakers);
    this.setState({ allSpeakers: remoteSpeakers});
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