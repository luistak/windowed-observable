import * as React from 'react';
import { render } from '@testing-library/react';

const Thing = () => <div> aaa </div>;

describe('it', () => {
  it('renders without crashing', () => {
    const { container } = render(<Thing />);

    expect(container).toBeInTheDocument();
  });
});
