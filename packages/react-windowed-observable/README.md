<div align="center">
  <h1>react-windowed-observable</h1>

  <img
    width="200"
    height="auto"
    alt="React Windowed observable"
    src="https://res.cloudinary.com/daiqkausy/image/upload/v1596908628/react-windowed-observable.png"
  />

  <p>React abstractions over <a href="https://github.com/luistak/windowed-observable">windowed observable</a>.</p>
</div>
<hr />

![Npm version](https://img.shields.io/npm/v/react-windowed-observable)
![Build](https://img.shields.io/github/workflow/status/luistak/windowed-observable/CI/master)
![Size](https://img.shields.io/bundlephobia/minzip/react-windowed-observable)
![License](https://img.shields.io/npm/l/react-windowed-observable)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style)](http://makeapullrequest.com)
![Downloads](https://img.shields.io/npm/dt/react-windowed-observable)

**react-windowed-observable** is a react library for messaging using Observables, making it easier to communicate multiple apps or parts of an app using the window.


## Installation
```sh
npm install react-windowed-observable

# or

yarn add react-windowed-observable
```

## Introduction

It exposes a hook to use and publish data using an Observable;

An *observable* look like a pub/sub topic, there are scoped events and observers(listeners) on each namespace, and those namespaces can be cleared, and changed.

## Examples

### Basic example
```tsx
import { createReactObservable } from 'react-windowed-observable';

const { useObservable, ObservableProvider } = createReactObservable('fastCartItems');

function App() {
  return (
    <ObservableProvider>
      <Header />
      <ItemDetails />
    </ObservableProvider>
  )
}

function Header() {
  const [items, setItems] = useState([]);
  const { data: newItem } = useObservable();

  useEffect(() => {
    setItems((allItems) => allItems.concat(newItem));
  }, [newItem])

  return (
    <div>
     <h1>Store Name</h1>
     <Cart items={items}/>
    </div>
  );
}

function ItemDetails({ item }) {
  const { publish } = useObservable();

  return (
    <div>
     <h1>{ item.name }</h1>
     <button onClick={() => publish(item)}> Add to cart </button>
    </div>
  );
}
```

### Initial data
```tsx
import { createReactObservable } from 'react-windowed-observable';

const initialItem = {
  name: 'Mouse Gamer',
  price: 120,
  quantity: 3
};

const {
  useObservable,
  ObservableProvider
} = createReactObservable('fastCartItems', { initialData: initialItem });

function App() {
  return (
    <ObservableProvider>
      <SomeComponent />
    </ObservableProvider>
  );
}

function SomeComponent() {
  const { data } = useObservable(); // Starts with the initial Data
  ...
}
```

### Retrieving latest event
```tsx
import { createReactObservable } from 'react-windowed-observable';

const {
  useObservable,
  ObservableProvider
} = createReactObservable('fastCartItems', { latest: true });

function App() {
  return (
    <ObservableProvider>
      <SomeComponent />
    </ObservableProvider>
  );
}

function SomeComponent() {
  const { data } = useObservable(); // start with the latest event on the the 'fastCartItems' namespace

  ...
}
```
