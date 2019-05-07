import React from 'react';
import ReactDOM from 'react-dom';
import TypeMe from '../index';

const div = document.createElement('div');

it('renders without crashing', () => {
  ReactDOM.render(<TypeMe />, div);
});

it('renders text passed as children', () => {
  ReactDOM.render(<TypeMe>Hello, there!</TypeMe>, div);
})
