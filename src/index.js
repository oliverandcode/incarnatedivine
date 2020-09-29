import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import axios from 'axios';
import moment from 'moment';

export function Truth(props) {
  return(
    <tr>
      <td>{props.id}</td>
      <td>{props.content}</td>
      <td>{props.speaker}</td>
      <td>{props.timestamp}</td>
    </tr>
  );
}

export function Display(props) {
  return(
    <div id="table">
      <h1 id="list-title" className="list-title">Archive</h1>
      <table id="truth-table" className="truth-table">
        <thead></thead>
        <tbody>
          <tr id="table-head-row">
            <th>ID</th>
            <th>Truth</th>
            <th>Speaker</th>
            <th>Time</th>
          </tr>
            {props.truthDisplay.map(
              (truth) =>
              (<Truth key={truth.truth_id}
                speaker={truth.speaker.name} 
                id = {truth.truth_id} 
                content={truth.content} 
                timestamp={truth.timestamp} />)
            )}
        </tbody>
      </table>
    </div>
  );  
}

class Entry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      truthtext: '',
      speaker: '',
      id: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    if (event.target.name === "truthtext") {
      this.setState({truthtext: event.target.value});
    } else if (event.target.name === "speaker") {
      this.setState({speaker: event.target.value});
    } else if (event.target.name === "truth-id") {
      this.setState({id: event.target.value});
    }
  }

  render() {
    return (
      <form className="truth-form">
        <label htmlFor="truthtext">
          What is your truth? 
          <input type="text" value={this.state.truthtext} onChange={this.handleChange} name="truthtext" />
        </label>
        <br />
        <label htmlFor="speaker">
          Who is the truth speaker?
          <input type="text" value={this.state.speaker} onChange={this.handleChange} name="speaker" />
        </label>
        <br />
        <label htmlFor="truth-id">
          Truth ID (update/delete):
          <input type="text" value={this.state.id} onChange={this.handleChange} name="truth-id" />
        </label>
        <br />

        <input type="button" value="Testify" onClick={(e) => this.props.onSubmit(this.state.truthtext, this.state.speaker)} />
        <input type="button" value="Update" onClick={(e) => this.props.onUpdate(this.state.truthtext, this.state.speaker, this.state.id)} />
        <input type="button" value="Delete" onClick={(e) => this.props.onDelete(this.state.id)} />

      </form>
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
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  existence(inputID) {
    let archiveExist = this.state.archiveCapture.slice();
    let arrayID = archiveExist.map(truth => truth.id);
    let i = arrayID.indexOf(parseInt(inputID));
    if (arrayID[i]) {
      return true;
    } else {
      return false;
    }
  }

  duplicateExists(truthtext, speaker) {
    let archiveDuplicate = this.state.archiveCapture.slice();
    let textArray = archiveDuplicate.map(truth => truth.truthtext);
    let speakerArray = archiveDuplicate.map(truth => truth.speaker);
    let textIndex = textArray.indexOf(truthtext);
    let speakerIndex = speakerArray.indexOf(speaker);
    // if both truthtext and speaker have existing matches...
    if (textArray[textIndex] && speakerArray[speakerIndex]) {
      // ...check to see if their index values match
      if (textIndex === speakerIndex) {
        // if their index values match, they belong to the same truth object, which means there IS a duplicate
        return true;
      } else {
        // otherwise (if the index values do not match) there's no duplicate
        return false;
      }
    } else {
      // if either truthtext or speaker doesn't have a match, it's fine, there's no duplicate
      return false;
    }
  }

  handleSubmit(truthtext, speaker) {
    let archiveSubmit = this.state.archiveCapture.slice();
    
    if (truthtext && speaker) {
      if (this.duplicateExists(truthtext, speaker)) {
        console.log("error: truthtext with speaker already exists");
      } else {
        const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
        archiveSubmit.push(
          {speaker: speaker, timestamp: timestamp, truthtext: truthtext}
        );
        axios.post('http://localhost:5000/api/truths', {
          truthtext: truthtext,
          speaker: speaker
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
      console.log("error: ", "problem with truthtext or speaker input");
    }

    this.setState({archiveCapture: archiveSubmit});
  }

  handleUpdate(truthtext, speaker, inputID) {
    let archiveUpdate = this.state.archiveCapture.slice();
    let arrayID = archiveUpdate.map(truthObject => truthObject.id);

    if (inputID) {
      const baseURL = "http://localhost:5000/api/truths/";
      let truthURL = baseURL + inputID;

      const updateTimestamp = moment().format('YYYY-MM-DD HH:mm:ss');
  
      let truthID = parseInt(inputID);

      let truthIndex = arrayID.indexOf(truthID);
      let thisTruth = archiveUpdate[truthIndex];
      
      var alertString = "alert string default text";

      if (this.existence(inputID)) {
        let currentTruthStatusString = "current truthtext: " + thisTruth.truthtext + "\n current speaker: " + thisTruth.speaker + "\n id: " + thisTruth.id;

        console.log("updating this truth: \n \n", currentTruthStatusString);

        if (truthtext && speaker) {
          // are both truthtext and speaker identical to current values? if so, prompt user to change one or both of them. if either of them are different from current values, update that value

          if (truthtext !== thisTruth.truthtext) {
            // truthtext is new
            // check speaker for difference then update one or both values 
            if (speaker !== thisTruth.speaker) {
              // truthtext is new, and so is speaker
              // update BOTH truthtext AND speaker
              // update timestamp

              thisTruth.truthtext = truthtext;
              thisTruth.speaker = speaker;
              thisTruth.timestamp = updateTimestamp;

              currentTruthStatusString = "current truthtext: " + thisTruth.truthtext + "\n current speaker: " + thisTruth.speaker + "\n id: " + thisTruth.id;
              console.log("truth successfully updated. current truth status: \n \n", currentTruthStatusString);
              alertString = "Truth successfully updated! Current truth status: \n \n" + currentTruthStatusString;
              alert(alertString);

              axios.put(truthURL, {
                truthtext: truthtext,
                speaker: speaker,
                timestamp: updateTimestamp
              })
              .then(function (response) {
                // handle success
                console.log(response);
              })
              .catch(function (error) {
                // handle error
                console.log(error);
              })
            } else {
              // truthtext is new, but speaker is NOT
              // update truthtext but NOT speaker (because it's the same) - is this an unnecessary extra step? as long as one of the values is different I have to update the truth object, and I can just set it to the desired values even if one of them doesn't change anything - the timestamp will still change, and it should still update correctly.
              // update timestamp

              thisTruth.truthtext = truthtext;
              thisTruth.timestamp = updateTimestamp;

              currentTruthStatusString = "current truthtext: " + thisTruth.truthtext + "\n current speaker: " + thisTruth.speaker + "\n id: " + thisTruth.id;
              console.log("truth successfully updated. current truth status: \n \n", currentTruthStatusString);
              alertString = "Truth successfully updated! Current truth status: \n \n" + currentTruthStatusString;
              alert(alertString);

              axios.put(truthURL, {
                truthtext: truthtext,
                timestamp: updateTimestamp
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
          } else if (speaker !== thisTruth.speaker) {
            // truthtext is entered, unchanged, but speaker is new
            // update speaker but NOT truthtext
            // update timestamp
            thisTruth.speaker = speaker;
            thisTruth.timestamp = updateTimestamp;

            currentTruthStatusString = "current truthtext: " + thisTruth.truthtext + "\n current speaker: " + thisTruth.speaker + "\n id: " + thisTruth.id;
            console.log("truth successfully updated. current truth status: \n \n", currentTruthStatusString);
            alertString = "Truth successfully updated! Current truth status: \n \n" + currentTruthStatusString;
            alert(alertString);

            axios.put(truthURL, {
              speaker: speaker,
              timestamp: updateTimestamp
            })
            .then(function (response) {
              // handle success
              console.log(response);
            })
            .catch(function (error) {
              // handle error
              console.log(error);
            })
          } else {
            // valid id was input, truthtext entered but identical to current value, speaker entered but identical to current value. no update, prompt user to change one or both values.
            console.log("truthtext and speaker both identical to current values. no update needed.");
            alertString = "No change detected. Enter new truthtext or speaker for this truth? \n \n" + currentTruthStatusString;
            alert(alertString);
          }
        } else if (truthtext) {
          // if truthtext is entered but speaker is blank, check if truthtext is identical to current value. if not, update truthtext (do NOT update speaker!). if it's identical, prompt user to change it.
          if (truthtext !== thisTruth.truthtext) {
            // update truthtext. do NOT change the speaker!
            // update timestamp
            thisTruth.truthtext = truthtext;
            thisTruth.timestamp = updateTimestamp;

            currentTruthStatusString = "current truthtext: " + thisTruth.truthtext + "\n current speaker: " + thisTruth.speaker + "\n id: " + thisTruth.id;
            console.log("truth successfully updated. current truth status: \n \n", currentTruthStatusString);
            alertString = "Truth successfully updated! Current truth status: \n \n" + currentTruthStatusString;
            alert(alertString);

            axios.put(truthURL, {
              truthtext: truthtext,
              timestamp: updateTimestamp
            })
            .then(function (response) {
              // handle success
              console.log(response);
            })
            .catch(function (error) {
              // handle error
              console.log(error);
            })
          } else {
            // valid id was input, truthtext entered, speaker blank, truthtext identical to current value. no update, prompt user to change truthtext.
            console.log("truthtext entered but identical to current value. speaker field is blank.");
            alertString = "No change detected. Enter new truthtext for this truth? \n \n" + currentTruthStatusString;
            alert(alertString);
          }
        } else if (speaker) {
          // if speaker is entered but truthtext is blank, check if speaker is identical to current value. if not, update speaker (do NOT update truthtext!). if it's identical, prompt user to change it.
          if (speaker !== thisTruth.speaker) {
            // update speaker. do NOT change the truthtext!
            // update timestamp
            thisTruth.speaker = speaker;
            thisTruth.timestamp = updateTimestamp;

            currentTruthStatusString = "current truthtext: " + thisTruth.truthtext + "\n current speaker: " + thisTruth.speaker + "\n id: " + thisTruth.id;
            console.log("truth successfully updated. current truth status: \n \n", currentTruthStatusString);
            alertString = "Truth successfully updated! Current truth status: \n \n" + currentTruthStatusString;
            alert(alertString);
            
            axios.put(truthURL, {
              speaker: speaker,
              timestamp: updateTimestamp
            })
            .then(function (response) {
              // handle success
              console.log(response);
            })
            .catch(function (error) {
              // handle error
              console.log(error);
            })
          } else {
            // valid id was input, speaker entered, truthtext blank, speaker identical to current value. no update, prompt user to change speaker.
            console.log("speaker entered but identical to current value. truthtext field is blank.");
            alertString = "No change detected. Enter new speaker for this truth? \n \n" + currentTruthStatusString;
            alert(alertString);
          }
        } else {
          // id was input, matches existing truth id, but both speaker and truthtext fields are blank. no update, prompt user for speaker or truthtext input.
          console.log("speaker and truthtext fields left blank");
          alertString = "No truthtext or speaker input detected. Enter new truthtext or speaker for this truth? \n \n" + currentTruthStatusString;
          alert(alertString);
        }

      } else {
        // inputID was entered but doesn't match any ids of truths in database
        console.log("error: truth with ID #", inputID, " not found");
        alertString = "Truth with ID #" + inputID + " not found. Try a different ID.";
        alert(alertString);
      }
    } else {
      // no id input recognized
      console.log("error: ", "problem with ID input: ", inputID);
      alertString = "Please enter an ID for a truth to be updated.";
      alert(alertString);
    }

    this.setState({archiveCapture: archiveUpdate});
  }

  handleDelete(inputID) {
    let truthID = parseInt(inputID);

    let archiveDelete = this.state.archiveCapture.slice();
    let arrayID = archiveDelete.map(truthObject => truthObject.id);

    let truthIndex = arrayID.indexOf(truthID);
    let thisTruth = archiveDelete[truthIndex];

    if (inputID) {
      if (this.existence(inputID)) {
        alert("are you sure you want to delete this truth: '" + thisTruth.truthtext + "'?");
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

    this.setState({archiveCapture: archiveDelete});
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

    return (
      <div className="container">
        <div id="truthcapture">
          <div className="entry">
            <Entry 
              onSubmit={this.handleSubmit} 
              onUpdate={this.handleUpdate} 
              onDelete={this.handleDelete}
            />
          </div>
          <div className="display">
            <Display truthDisplay={archiveTruths} />
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