<div align="center">
  <h1>windowed-observable</h1>

  <img
    width="200"
    height="auto"
    alt="Windowed observable"
    src="https://res.cloudinary.com/daiqkausy/image/upload/v1596144724/windowed-observable.png"
  />

  <p>Messaging lib using a pub/sub observable scoped by namespaces.</p>
</div>
<hr />

![Npm version](https://img.shields.io/npm/v/windowed-observable)
![Build](https://img.shields.io/github/workflow/status/luistak/windowed-observable/CI/master)
![Size](https://img.shields.io/bundlephobia/minzip/windowed-observable)
![License](https://img.shields.io/github/license/luistak/windowed-observable)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style)](http://makeapullrequest.com)
![Downloads](https://img.shields.io/npm/dt/windowed-observable)

**windowed-observable** is a library for messaging using Observables, making it easier to communicate multiple apps or parts of an app using the window. It exposes an Observable that behaves like a scoped Pub/Sub topic using namespaces.

## 📦 Installation
```sh
npm install windowed-observable

# or

yarn add windowed-observable
```

## ⌨️ Introduction

An *observable* look like a pub/sub topic, there are scoped events and observers(listeners) on each namespace, and those namespaces can be cleared, and changed.

## 🔨 Usages

### Common usage
```ts
import { Observable } from 'windowed-observable';
const observable = new Observable('konoha');
observable.subscribe((ninja) => {
  console.log(ninja)
})
observable.publish('Uchiha Shisui');
// > Uchiha Shisui
```

### Retrieving latest event
```ts
import { Observable } from 'windowed-observable';

const observable = new Observable('konoha');

observable.publish('Senju Tobirama');

observable.subscribe((ninja) => console.log(ninja), { latest: true });
// > Senju Tobirama
```

### Unsubscribing and clearing
```ts
import { Observable } from 'windowed-observable';

const observable = new Observable('konoha');

const observer = (ninja) => console.log(ninja);

observable.subscribe(observer)
observable.publish('Uzumaki Naruto');
// > Uzumaki Naruto

// Unsubscribing
observable.unsubscribe(observer);

// Clearing
observable.clear();
```

### React

Simple react usage

#### Observer component
```tsx
import React, { Component } from 'react';
import { Observable } from 'windowed-observable';

const observable = new Observable('konoha');

class NinjasList extends Component {
  state: {
    ninjas: []
  }

  componentDidMount() {
    this.observer = (ninja) => {
      const ninjas = this.state.ninjas.concat(ninja);

      this.setState({ ninjas });
    }

    observable.subscribe(this.observer);
  }

  componentWillUnmount() {
    observable.unsubscribe(this.observer);
  }

  render() {
    ...
    // ninjas listing
  }
}
```

#### Publisher component

```tsx
import React from 'react';
import { Observable } from 'windowed-observable';

const observable = new Observable('konoha');

const handleClick = ninja => () => observable.publish(ninja);

const AddNinjaButton = ({ ninja }) => (
  <button onClick={handleClick(ninja)}> Add ninja </button>
);
```

