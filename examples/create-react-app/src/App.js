import React from 'react';
import logo from './logo.svg';
import './App.css';

import { createReactObservable } from 'react-windowed-observable';

const { ObservableProvider, useObservable } = createReactObservable('Example', { initialData: 'Initial example data' });

// Dummy example receiving data
function Title() {
  const { data } = useObservable();

  return (
    <h1>{data}</h1>
  );
}

function Body() {
  return (
    <>
      <Title />
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
    </>
  );
}

// Publishing new data
function SomeComponent() {
  const { publish } = useObservable();

  const handleInputChange = (e) => {
    e.preventDefault();

    publish(e.target.value)
  }

  return (
    <input type="text" placeholder="Type a new title" onChange={handleInputChange} />
  )
}

function App() {
  return (
    <ObservableProvider>
      <div className="App">
        <header className="App-header">
          <Body />
          <br />
          <SomeComponent />
        </header>
      </div>
    </ObservableProvider>
  );
}

export default App;
