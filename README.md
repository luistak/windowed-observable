# windowed-observable

**Messaging lib using a Pub/Sub observable scoped by namespaces.**

**windowed-observable** is a library for messaging using Observables, making it easier to communicate multiple apps or parts of an app using the window. It expose a Observable that behaves like a scoped Pub/Sub topic using namespaces.

## Installation
```sh
npm install windowed-obserbale

# or

yarn add windowed-observable
```

## Introduction
The observable is just like a Pub/Sub topic, there are scoped events and observers(listeners) on each namespace, and those namespaces can be cleared, and changed.

## Usages

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

### React App

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

const handleClick = ninja = () => observable.publish(ninja);

const AddNinjaButton = ({ ninja }) => (
  <button onClick={handleClick(ninja)}> Add ninja </button>
);
```