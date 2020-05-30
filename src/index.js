import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import axios from 'axios';
import moment from 'moment';

export function Truth(props) {
  return(
    <tr key={props.hexcode}>
      <td>{props.truthtext}</td>
      <td>{props.hexcode}</td>
      <td>{props.timestamp}</td>
    </tr>
  );
}

export function Display(props) {
  return(
    <div id="table">
      <h1 id="list-title">List of Truths</h1>
      <table id="truthtable">
        <thead></thead>
        <tbody>
          <tr id="table-head-row">
            <th>Truth</th>
            <th>Hex</th>
            <th>Time</th>
          </tr>
            {props.archiveDisplay.map(
              (truth) =>
              (<Truth 
                hexcode={truth.hexcode} 
                truthtext={truth.truthtext} 
                timestamp={truth.timestamp} />)
            )}
        </tbody>
      </table>
    </div>
  )  
}

class Entry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      truthtext: '',
      hexcode: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    if (event.target.name === "truthtext") {
      this.setState({truthtext: event.target.value})
    } else if (event.target.name === "hexcode") {
      this.setState({hexcode: event.target.value})
    }
  }

  render() {
    return (
      <form>
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

        <input type="button" value="Testify" onClick={(e) => this.props.onClick(this.state.truthtext, this.state.hexcode)} />

      </form>
    );
  }
}

class TruthCapture extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      archiveCapture: [
        {hexcode: "yellow", timestamp: "2020-05-28 10:00:00", truthtext: "I like sunlight more than rain"},
        {hexcode: "greyblue", timestamp: "2020-05-28 10:00:00", truthtext: "I cried at the temple at Burning Man"},
        {hexcode: "000000", timestamp: "2020-05-28 10:00:00", truthtext: "Your silence will not protect you"},
        {hexcode: "green", timestamp: "2020-05-28 10:00:00", truthtext: "Selfishness"},
        {hexcode: "red", timestamp: "2020-05-28 10:00:00", truthtext: "There is a war going on"},
        {hexcode: "millennialpink", timestamp: "2020-05-28 10:00:00", truthtext: "Gender is a myth"}
      ],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(truthtext, hexcode) {
    let archiveSubmit = this.state.archiveCapture.slice();

    if (truthtext && hexcode) {
      if (hexcode in archiveSubmit) {
        console.log("error: ", "truth with hexcode already exists")
      } else {
        const timestamp = moment().format('YYYY-MM-DD hh:mm:ss');
        archiveSubmit.push(
          {hexcode: hexcode, timestamp: timestamp, truthtext: truthtext}
        )
      }
    } else {
      console.log("error: ", "problem with truthtext or hexcode input")
    }

    this.setState({archiveCapture: archiveSubmit});
  }

  async componentDidMount() {
    console.log("truth capture app loaded");

    const remoteTruths = await axios.get("http://localhost:5000/api/truths");
    console.log("[truthcapture/componentDidMount]: truths received:", remoteTruths.data);
    this.setState({ archiveCapture: remoteTruths.data });
  }

  render() {
    const archiveArchive = this.state.archiveCapture;

    return (
      <div className="container">
        <div id="truthcapture">
          <div className="entry">
            <Entry onClick={this.handleSubmit} />
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