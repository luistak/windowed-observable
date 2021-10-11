import f from 'faker';
import React, { FC } from 'react';
import { act, render, screen } from '@testing-library/react';
import mockConsole from 'jest-mock-console';
import { Observable, Observer } from 'windowed-observable';

import { UseObservableError } from '../context';
import { CreateReactObservableOptions } from '../types';
import { createReactObservable } from '../';

type RenderObservableOptions<T = any> = {
  observableOptions?: CreateReactObservableOptions;
  onChange?: Observer<T>;
};

function renderObservable<T = string>({
  onChange,
  observableOptions = {},
}: RenderObservableOptions<T> = {}) {
  const {
    ObservableProvider,
    useObservable,
    observable,
  } = createReactObservable<T>(f.datatype.uuid(), observableOptions);

  const LABELS = {
    EMPTY: 'Empty',
  };

  function MockyConsumer() {
    const [{ data }] = useObservable();
    return <div>{data || LABELS.EMPTY}</div>;
  }

  function Appy() {
    return (
      <main>
        <h1>Some title</h1>
        <MockyConsumer />
      </main>
    );
  }

  const Wrapper: FC = ({ children }) => (
    <ObservableProvider onChange={onChange}>{children}</ObservableProvider>
  );

  return {
    ...render(<Appy />, { wrapper: Wrapper }),
    observable,
    LABELS,
  };
}

describe('createReactObservable()', () => {
  it('should create an observable', () => {
    const {
      observable,
      useObservable,
      ObservableProvider,
    } = createReactObservable(f.datatype.uuid());

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

    function flakyRender() {
      const { useObservable } = createReactObservable(f.datatype.uuid());
      function MockyComponent() {
        const [{ data }] = useObservable();
        return <div>{data}</div>;
      }

      render(<MockyComponent />);
    }

    expect(flakyRender).toThrowErrorMatchingInlineSnapshot(
      `"${UseObservableError}"`
    );

    window.removeEventListener('error', preventError);
  });
  it('should render an empty component correctly when using "useObservable" WITH the "ObservableProvider"', () => {
    const { LABELS } = renderObservable();

    expect(screen.getByText(LABELS.EMPTY)).toBeInTheDocument();
  });
  it('should render the "initialData" correctly', async () => {
    const initialData = 'Something awesome';
    renderObservable({ observableOptions: { initialData } });

    expect(await screen.findByText(initialData)).toBeInTheDocument();
  });
  it('should render change correctly if the observable data changes', async () => {
    const { LABELS, observable } = renderObservable();

    expect(screen.getByText(LABELS.EMPTY)).toBeInTheDocument();

    const awesomeString = 'Something awesome new';
    act(() => observable.publish(awesomeString));

    expect(await screen.findByText(awesomeString)).toBeInTheDocument();
  });
  it('should trigger onChange correctly when passed', async () => {
    const mockedOnChange = jest.fn();
    const { LABELS, observable } = renderObservable({
      onChange: mockedOnChange,
    });

    expect(screen.getByText(LABELS.EMPTY)).toBeInTheDocument();

    const awesomeString = 'Something awesome newer';
    act(() => observable.publish(awesomeString));

    expect(await screen.findByText(awesomeString)).toBeInTheDocument();
    expect(mockedOnChange).toHaveBeenCalledTimes(1);
    expect(mockedOnChange).toHaveBeenCalledWith(awesomeString, {
      events: [awesomeString],
      lastEvent: undefined,
    });
  });
});
