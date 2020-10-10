import React, { ChangeEvent } from 'react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import mockConsole from 'jest-mock-console';
import { Observable } from 'windowed-observable';

import { UseObservableError } from '../context';
import { createReactObservable } from '../';

function renderObservable({ namespace = 'bla', observableOptions = {} } = {}) {
  const {
    ObservableProvider,
    useObservable,
    observable,
  } = createReactObservable(namespace, observableOptions);

  const LABELS = {
    EMPTY: 'Empty',
    PUBLISHER: 'Type machine',
  };

  function MockyConsumer() {
    const { data } = useObservable();
    return <div>{data || LABELS.EMPTY}</div>;
  }

  function MockyPublisher() {
    const { publish } = useObservable();
    const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
      publish(e.target.value);

    return (
      <label>
        {LABELS.PUBLISHER}
        <input
          type="text"
          placeholder="Type something in here"
          onChange={handleChange}
        />
      </label>
    );
  }

  function Appy() {
    return (
      <main>
        <h1>Some title</h1>
        <MockyConsumer />
        <MockyPublisher />
      </main>
    );
  }

  return {
    ...render(<Appy />, { wrapper: ObservableProvider }),
    observable,
    LABELS,
  };
}

describe('createReactObersable', () => {
  it('should create an observable', () => {
    const {
      observable,
      useObservable,
      ObservableProvider,
    } = createReactObservable('namespace');

    expect(useObservable).toBeDefined();
    expect(ObservableProvider).toBeDefined();
    expect(observable).toBeInstanceOf(Observable);
  });
  it('should NOT render when using "useObservable" WITHOUT the "ObservableProvider"', () => {
    mockConsole('error');
    function preventError(e: { preventDefault: () => void }) {
      e.preventDefault();
    }
    window.addEventListener('error', preventError);

    function flackyRender() {
      const { useObservable } = createReactObservable('namespace');
      function MockyComponent() {
        const { data } = useObservable();
        return <div>{data}</div>;
      }

      render(<MockyComponent />);
    }

    expect(flackyRender).toThrowErrorMatchingInlineSnapshot(
      `"${UseObservableError}"`
    );

    window.removeEventListener('error', preventError);
  });
  it('should render an empty component correctly when using "useObservable" WITH the "ObservableProvider"', () => {
    const { LABELS } = renderObservable();

    expect(screen.getByText(LABELS.EMPTY)).toBeInTheDocument();
  });
  it('should render the "initialData" correctly', () => {
    const initialData = 'Something awesome';
    renderObservable({ observableOptions: { initialData } });

    expect(screen.getByText(initialData)).toBeInTheDocument();
  });
  it('should change the observable data when published correctly', () => {
    const { LABELS } = renderObservable();

    const awesomeString = 'Lorem Ipsum, bla bla bli';
    expect(screen.getByText(LABELS.EMPTY)).toBeInTheDocument();
    const publisherInput = screen.getByLabelText(LABELS.PUBLISHER);
    userEvent.type(publisherInput, awesomeString);

    expect(publisherInput).toHaveValue(awesomeString);
    expect(screen.getByText(awesomeString)).toBeInTheDocument();
  });
  it('should render change correctly if the observable data changes', async () => {
    const { LABELS, observable } = renderObservable();

    expect(screen.getByText(LABELS.EMPTY)).toBeInTheDocument();

    const awesomeString = 'Something awesome new';
    act(() => observable.publish(awesomeString));

    expect(await screen.findByText(awesomeString)).toBeInTheDocument();
  });
});
