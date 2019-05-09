import React from 'react';
import { render, cleanup } from 'react-testing-library';
import TypeMe from '../index';
// import Text from './Text';

let div;

afterEach(() => {
  document.body.removeChild(div);
  div = null;
  cleanup();
});

/* 
<TypeMe />
  - renders without crashing
  - onAnimationEnd called once when animation ends
  - renders with string passed as children
  - renders with string passed as props
  - renders multiple instances 
  - animationEnd callback executed once successfully
*/

describe('<TypeMe/> component', () => {
  // renders without crashing
  it('<TypeMe/> renders without crashing', done => {
    const { container } = render(<TypeMe />);
    setTimeout(() => {
      div = container;
      expect(div).toMatchSnapshot();
      done();
    }, 1000);
  });

  it('<TypeMe/> onAnimationEnd called once when animation ends', done => {
    let cb;
    new Promise(resolve => {
      cb = jest.fn(() => {
        resolve();
      });
      const { container } = render(<TypeMe onAnimationEnd={cb}>Hello!</TypeMe>);
      div = container;
    }).then(() => {
      done();
      expect(cb).toHaveBeenCalledTimes(1);
      expect(div).toMatchSnapshot();
    });
  });
  // it('<TypeMe/> renders with string passed as children', done => {
  //   const { container } = render(<TypeMe />);
  //   setTimeout(() => {
  //     div = container;
  //     expect(div).toMatchSnapshot();
  //     done();
  //   }, 1000);
  // })

  // // renders multiple instances
  // it('<TypeMe/> renders multiple instances', done => {
  //   const { container } = render(<TypeMe />);
  //   setTimeout(() => {
  //     div = container;
  //     expect(div).toMatchSnapshot();
  //     done();
  //   }, 1000);
  // })
});
