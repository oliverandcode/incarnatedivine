import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

export function Truth(props) {
  return(
    <li>{props.value}</li>
  );
}

export function Display(props) {
  return(
    <ul>
      {props.archiveDisplay.map(
        (theTruth) => 
        (<Truth value={theTruth} />)
      )}
    </ul>
  );
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
      archiveCapture: ["I like sunlight more than rain", "I cried at the temple at Burning Man", "Your silence will not protect you", "Selfishness", "There is a war going on", "Gender is a myth"],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(truthText) {
    let archiveSubmit = this.state.archiveCapture.slice();
    archiveSubmit.push(truthText);
    this.setState({archiveCapture: archiveSubmit});
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