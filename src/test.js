import React from 'react';
import { render, cleanup } from 'react-testing-library';
import TypeMe from './index';
import Text from './Text';

let div;

afterEach(() => {
  document.body.removeChild(div);
  div = null;
  cleanup();
});

/*
<Text />
- renders text passed as props
- onAnimationEnd callback executes once after full text is rendered
- delete characters 
- add lineBreak after render
- trigger startAnimation manually
- change cursor
- keep cursor after animation
- hide cursor after animation
*/

it('<Text/> renders text passed as children', done => {
  new Promise(resolve => {
    const { container } = render(
      <Text
        onAnimationEnd={() => {
          resolve();
        }}
      >
        Hello!
      </Text>
    );
    div = container;
  }).then(() => {
    done();
    expect(div).toMatchSnapshot();
  });
});

/* 
<TypeMe />
- renders without crashing
*/

it('<TypeMe/> renders without crashing', done => {
  const { container } = render(<TypeMe />);
  setTimeout(() => {
    div = container;
    expect(div).toMatchSnapshot();
    done();
  }, 1000);
});
