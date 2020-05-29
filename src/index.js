import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import axios from 'axios';

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
  console.log("props.archiveDisplay", props.archiveDisplay);

  return(
    <div id="table">
      <h1 id="title">List of Truths</h1>
      <table id="truths">
        <thead></thead>
        <tbody>
          <tr>
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
      value: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  render() {
    return (
      <form>
        <label>
          What is your truth?
          <input type="text" value={this.state.value} onChange={this.handleChange} name="truth" />
        </label>

        <input type="button" value="Testify" onClick={(e) => this.props.onClick(this.state.value)} />

      </form>
    );
  }
}

class TruthCapture extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      archiveCapture: [
        // array of objects
        {hexcode: "yellow", timestamp: "2020-05-28 10:00:00", truthtext: "I like sunlight more than rain"},
        {hexcode: "greyblue", timestamp: "2020-05-28 10:00:00", truthtext: "I cried at the temple at Burning Man"},
        {hexcode: "000000", timestamp: "2020-05-28 10:00:00", truthtext: "Your silence will not protect you"},
        {hexcode: "green", timestamp: "2020-05-28 10:00:00", truthtext: "Selfishness"},
        {hexcode: "red", timestamp: "2020-05-28 10:00:00", truthtext: "There is a war going on"},
        {hexcode: "millennialpink", timestamp: "2020-05-28 10:00:00", truthtext: "Gender is a myth"}
        // original array of strings:
        // "I like sunlight more than rain", "I cried at the temple at Burning Man", "Your silence will not protect you", "Selfishness", "There is a war going on", "Gender is a myth"
      ],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(truthText) {
    let archiveSubmit = this.state.archiveCapture.slice();
    archiveSubmit.push(truthText);
    this.setState({archiveCapture: archiveSubmit});
  }

  async componentDidMount() {
    console.log("truth capture app loaded");

    const remoteTruths = await axios.get("http://localhost:5000/api/truths");
    console.log("[truthcapture/componentDidMount]: truths received:", remoteTruths);
    this.setState({ archiveCapture: remoteTruths.data });
  }

  render() {
    const archiveArchive = this.state.archiveCapture;

    return (
      <div>
        <div className="display">
          <Display archiveDisplay={archiveArchive} />
        </div>
        <div className="entry">
          <Entry onClick={this.handleSubmit} />
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