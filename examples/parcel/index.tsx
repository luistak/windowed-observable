import "react-app-polyfill/ie11";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { createReactObservable } from "../../packages/react-windowed-observable/dist";

const { ObservableProvider, useObservable } = createReactObservable("blabla", {
  initialData: "1234",
});

const ChildComponent = () => {
  const { data } = useObservable();

  return (
    <div>
      <span>{data}</span>
      <h2> AAAaaaa </h2>
    </div>
  );
};

const App = () => {
  return (
    <ObservableProvider>
      <h1>Parcel example </h1>
      <ChildComponent />
    </ObservableProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
