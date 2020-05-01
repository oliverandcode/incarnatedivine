import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Entry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('I accept your truth: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          What is your truth?
          <input type="text" value={this.state.value} onChange={this.handleChange} name="truth" />
        </label>
        <input type="submit" value="Testify" />
      </form>
    );
  }
}

class Truth extends React.Component {
  render() {
    return (
      <button
        className="truth"
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button>
    );
  }
}

class Display extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      archive: ["I like sunlight more than rain", "I cried at the temple at Burning Man", "Your silence will not protect you", "Selfishness", "There is a war going on", "Gender is a myth"]
    };
  }

  handleClick(i) {
    const archive = this.state.archive.slice();
    archive[i] = "Truth";
    this.setState({archive: archive});
  }

  renderTruth(i) {
    return (
      <Truth 
        value={this.state.archive[i]} 
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const archive = this.state.archive;

    let archiveList = Array(0);

    for (let i = 0; i < archive.length; i++) {
      archiveList.push(<li>{this.renderTruth(i)}</li>);
    };

    return (
      <ul>{archiveList}</ul>
    );
  }
}

class TruthCapture extends React.Component {
  render() {
    return (
      <div>
        <div className="display">
          <Display />
        </div>
        <div className="entry">
          <Entry />
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