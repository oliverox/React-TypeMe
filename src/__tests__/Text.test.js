import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import Text from '../Text';

const div = document.createElement('div');

it('renders without crashing', () => {
  ReactDOM.render(<Text />, div);
});

it('renders text passed as children', done => {
  renderer.wait(() => {
    ReactDOM.render(<Text>Hello!</Text>, div);
  });
  const span = div.querySelector('span span');
  expect(span.textContent).toBe('Hello!');
});

// it('renders text passed as props', () => {
//   ReactDOM.render(<TypeMe strings={['>Hello, there!']} />, div);
// })
