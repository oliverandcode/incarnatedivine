import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import axios from 'axios';
import moment from 'moment';

export function Truth(props) {
  return(
    <tr>
      <td>{props.id}</td>
      <td>{props.truthtext}</td>
      <td>{props.hexcode}</td>
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
            <th>Hex</th>
            <th>Time</th>
          </tr>
            {props.archiveDisplay.map(
              (truth) =>
              (<Truth key={truth.id}
                hexcode={truth.hexcode} 
                id = {truth.id} 
                truthtext={truth.truthtext} 
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
      hexcode: '',
      id: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    if (event.target.name === "truthtext") {
      this.setState({truthtext: event.target.value});
    } else if (event.target.name === "hexcode") {
      this.setState({hexcode: event.target.value});
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
        <label htmlFor="hexcode">
          Pick a color:
          <input type="text" value={this.state.hexcode} onChange={this.handleChange} name="hexcode" />
        </label>
        <br />
        <label htmlFor="truth-id">
          Enter existing truth ID:
          <input type="text" value={this.state.id} onChange={this.handleChange} name="truth-id" />
        </label>
        <br />

        {/* 
        <label htmlFor="truth-id">Choose a truth:</label>
        <select name="truth-id">
          {props.archiveCapture.map(
            (truth) => 
            (<option value="{truth.id}">{truth.truthtext}</option>)
          )}
        </select> 
        */}

        <input type="button" value="Testify" onClick={(e) => this.props.onSubmit(this.state.truthtext, this.state.hexcode)} />
        <input type="button" value="Update" onClick={(e) => this.props.onUpdate(this.state.truthtext, this.state.hexcode, this.state.id)} />
        <input type="button" value="Delete" onClick={(e) => this.props.onDelete(this.state.id)} />

      </form>
    );
  }
}

class TruthCapture extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      archiveCapture: [
        {id: 1, hexcode: "yellow", timestamp: "2020-05-28 10:00:00", truthtext: "I like sunlight more than rain"},
        // {id: 2, hexcode: "greyblue", timestamp: "2020-05-28 10:00:00", truthtext: "I cried at the temple at Burning Man"},
        // {id: 3, hexcode: "000000", timestamp: "2020-05-28 10:00:00", truthtext: "Your silence will not protect you"},
        // {id: 4, hexcode: "green", timestamp: "2020-05-28 10:00:00", truthtext: "Selfishness"},
        // {id: 5, hexcode: "red", timestamp: "2020-05-28 10:00:00", truthtext: "There is a war going on"},
        // {id: 6, hexcode: "millennialpink", timestamp: "2020-05-28 10:00:00", truthtext: "Gender is a myth"},
      ],
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

  handleSubmit(truth, hex) {
    let archiveSubmit = this.state.archiveCapture.slice();
    
    if (truth && hex) {
      if (this.existence(hex)) {
        console.log("error: ", "truth with hexcode already exists");
      } else {
        const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
        archiveSubmit.push(
          {hexcode: hex, timestamp: timestamp, truthtext: truth}
        );
        axios.post('http://localhost:5000/api/truths', {
          truthtext: truth,
          hexcode: hex
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
      console.log("error: ", "problem with truthtext or hexcode input");
    }

    this.setState({archiveCapture: archiveSubmit});
  }

  handleUpdate(truthtext, hexcode, inputID) {
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
        let currentTruthStatusString = "current truthtext: " + thisTruth.truthtext + "\n current hexcode: " + thisTruth.hexcode + "\n id: " + thisTruth.id;

        console.log("updating this truth: \n \n", currentTruthStatusString);

        if (truthtext && hexcode) {
          // are both truthtext and hexcode identical to current values? if so, prompt user to change one or both of them. if either of them are different from current values, update that value

          if (truthtext !== thisTruth.truthtext) {
            // truthtext is new
            // check hexcode for difference then update one or both values 
            if (hexcode !== thisTruth.hexcode) {
              // truthtext is new, and so is hexcode
              // update BOTH truthtext AND hexcode
              // update timestamp

              thisTruth.truthtext = truthtext;
              thisTruth.hexcode = hexcode;
              thisTruth.timestamp = updateTimestamp;

              currentTruthStatusString = "current truthtext: " + thisTruth.truthtext + "\n current hexcode: " + thisTruth.hexcode + "\n id: " + thisTruth.id;
              console.log("truth successfully updated. current truth status: \n \n", currentTruthStatusString);
              alertString = "Truth successfully updated! Current truth status: \n \n" + currentTruthStatusString;
              alert(alertString);

              axios.put(truthURL, {
                truthtext: truthtext,
                hexcode: hexcode,
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
              // truthtext is new, but hexcode is NOT
              // update truthtext but NOT hexcode (because it's the same) - is this an unnecessary extra step? as long as one of the values is different I have to update the truth object, and I can just set it to the desired values even if one of them doesn't change anything - the timestamp will still change, and it should still update correctly.
              // update timestamp

              thisTruth.truthtext = truthtext;
              thisTruth.timestamp = updateTimestamp;

              currentTruthStatusString = "current truthtext: " + thisTruth.truthtext + "\n current hexcode: " + thisTruth.hexcode + "\n id: " + thisTruth.id;
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
          } else if (hexcode !== thisTruth.hexcode) {
            // truthtext is entered, unchanged, but hexcode is new
            // update hexcode but NOT truthtext
            // update timestamp
            thisTruth.hexcode = hexcode;
            thisTruth.timestamp = updateTimestamp;

            currentTruthStatusString = "current truthtext: " + thisTruth.truthtext + "\n current hexcode: " + thisTruth.hexcode + "\n id: " + thisTruth.id;
            console.log("truth successfully updated. current truth status: \n \n", currentTruthStatusString);
            alertString = "Truth successfully updated! Current truth status: \n \n" + currentTruthStatusString;
            alert(alertString);

            axios.put(truthURL, {
              hexcode: hexcode,
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
            // valid id was input, truthtext entered but identical to current value, hexcode entered but identical to current value. no update, prompt user to change one or both values.
            console.log("truthtext and hexcode both identical to current values. no update needed.");
            alertString = "No change detected. Enter new truthtext or hexcode for this truth? \n \n" + currentTruthStatusString;
            alert(alertString);
          }
        } else if (truthtext) {
          // if truthtext is entered but hexcode is blank, check if truthtext is identical to current value. if not, update truthtext (do NOT update hexcode!). if it's identical, prompt user to change it.
          if (truthtext !== thisTruth.truthtext) {
            // update truthtext. do NOT change the hexcode!
            // update timestamp
            thisTruth.truthtext = truthtext;
            thisTruth.timestamp = updateTimestamp;

            currentTruthStatusString = "current truthtext: " + thisTruth.truthtext + "\n current hexcode: " + thisTruth.hexcode + "\n id: " + thisTruth.id;
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
            // valid id was input, truthtext entered, hexcode blank, truthtext identical to current value. no update, prompt user to change truthtext.
            console.log("truthtext entered but identical to current value. hexcode field is blank.");
            alertString = "No change detected. Enter new truthtext for this truth? \n \n" + currentTruthStatusString;
            alert(alertString);
          }
        } else if (hexcode) {
          // if hexcode is entered but truthtext is blank, check if hexcode is identical to current value. if not, update hexcode (do NOT update truthtext!). if it's identical, prompt user to change it.
          if (hexcode !== thisTruth.hexcode) {
            // update hexcode. do NOT change the truthtext!
            // update timestamp
            thisTruth.hexcode = hexcode;
            thisTruth.timestamp = updateTimestamp;

            currentTruthStatusString = "current truthtext: " + thisTruth.truthtext + "\n current hexcode: " + thisTruth.hexcode + "\n id: " + thisTruth.id;
            console.log("truth successfully updated. current truth status: \n \n", currentTruthStatusString);
            alertString = "Truth successfully updated! Current truth status: \n \n" + currentTruthStatusString;
            alert(alertString);
            
            axios.put(truthURL, {
              hexcode: hexcode,
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
            // valid id was input, hexcode entered, truthtext blank, hexcode identical to current value. no update, prompt user to change hexcode.
            console.log("hexcode entered but identical to current value. truthtext field is blank.");
            alertString = "No change detected. Enter new hexcode for this truth? \n \n" + currentTruthStatusString;
            alert(alertString);
          }
        } else {
          // id was input, matches existing truth id, but both hexcode and truthtext fields are blank. no update, prompt user for hexcode or truthtext input.
          console.log("hexcode and truthtext fields left blank");
          alertString = "No truthtext or hexcode input detected. Enter new truthtext or hexcode for this truth? \n \n" + currentTruthStatusString;
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
    this.setState({ archiveCapture: remoteTruths });
  }

  render() {
    const archiveArchive = this.state.archiveCapture;

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
            <Display archiveDisplay={archiveArchive} />
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