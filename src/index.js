import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Entry extends React.Component {
  render() {
    return (
      <form>
        <label>
          What is your truth?
          <input type="text" />
        </label>
        <input type="submit" value="Testify" />
      </form>
    );
  }
}

class Display extends React.Component {
  render() {
    const archive = ["I like sunlight more than rain", "I cried at the temple at Burning Man", "Your silence will not protect you", "Selfishness",];

    let archiveList = Array(0);

    for (let i = 0; i < archive.length; i++) {
      let listItem = <li>{archive[i]}</li>;
      archiveList.push(listItem);
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