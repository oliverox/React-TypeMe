import React from 'react';
import { render, cleanup } from 'react-testing-library';
import Text from '../Text';

let div;

afterEach(() => {
  document.body.removeChild(div);
  div = null;
  cleanup();
});

describe('<Text/> component', () => {

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

  it(`<Text/> onAnimationEnd callback executed once successfully`, done => {
    let cb;
    new Promise(resolve => {
      cb = jest.fn(() => {
        resolve();
      });
      const { container } = render(<Text onAnimationEnd={cb}>Hello!</Text>);
      div = container;
    }).then(() => {
      done();
      expect(cb).toHaveBeenCalledTimes(1);
      expect(div).toMatchSnapshot();
      cb = null;
    });
  });

  it('<Text/> renders text with deleted characters', done => {
    new Promise(resolve => {
      const { container } = render(
        <Text
          deleteCharacters={7}
          onAnimationEnd={() => {
            resolve();
          }}
        >
          Hello world!
        </Text>
      );
      div = container;
    }).then(() => {
      done();
      expect(div).toMatchSnapshot();
    });
  });

  it('<Text/> renders with a line break character', done => {
    new Promise(resolve => {
      const { container } = render(
        <Text
          lineBreak={true}
          onAnimationEnd={() => {
            resolve();
          }}
        >
          Line break?
        </Text>
      );
      div = container;
    }).then(() => {
      done();
      expect(div).toMatchSnapshot();
    });
  });

  it('<Text/> with manually triggered start animation', done => {
    new Promise(resolve => {
      const { container, rerender } = render(
        <Text startAnimation={false}>Nope</Text>
      );
      setTimeout(() => {
        rerender(
          <Text
            startAnimation={true}
            onAnimationEnd={() => {
              resolve();
            }}
          >
            Yes
          </Text>
        );
      }, 500);
      div = container;
    }).then(() => {
      done();
      expect(div).toMatchSnapshot();
    });
  });

  it('<Text/> renders with new cursor character', done => {
    new Promise(resolve => {
      const { container } = render(
        <Text
          cursorCharacter="_"
          onAnimationEnd={() => {
            resolve();
          }}
        >
          New cursor?
        </Text>
      );
      div = container;
    }).then(() => {
      done();
      expect(div).toMatchSnapshot();
    });
  });

  it('<Text/> hides cursor after animation', done => {
    new Promise(resolve => {
      const { container } = render(
        <Text
          hideCursor={true}
          onAnimationEnd={() => {
            resolve();
          }}
        >
          Cursor hidden?
        </Text>
      );
      div = container;
    }).then(() => {
      done();
      expect(div).toMatchSnapshot();
    });
  });

  it('<Text/> keep cursor after animation', done => {
    new Promise(resolve => {
      const { container } = render(
        <Text
          hideCursor={false}
          onAnimationEnd={() => {
            resolve();
          }}
        >
          Cursor hidden?
        </Text>
      );
      div = container;
    }).then(() => {
      done();
      expect(div).toMatchSnapshot();
    });
  });
});
