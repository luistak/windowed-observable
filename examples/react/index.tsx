import "react-app-polyfill/ie11";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  ObservableProvider,
  useObservable,
} from "../../packages/react-windowed-observable/dist";

const Bla = () => {
  const { data } = useObservable();

  return (
    <div>
      <span>{data}</span>
      <h2> AAA </h2>
      {/* <Thing /> */}
    </div>
  );
};

const App = () => {
  return (
    <ObservableProvider<string> namespace="blabla">
      <div>
        <h1>Live reload </h1>
        <Bla />
      </div>
    </ObservableProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
