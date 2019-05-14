import React from 'react';
import { render, cleanup } from 'react-testing-library';
import TypeMe, { LineBreak, Delete } from '../index';

let div;
let cb;

afterEach(() => {
  document.body.removeChild(div);
  div = null;
  cb = null;
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

describe('<TypeMe /> component', () => {
  it('renders without crashing', done => {
    const { container } = render(<TypeMe />);
    setTimeout(() => {
      div = container;
      expect(div).toMatchSnapshot();
      done();
    }, 1000);
  });

  it('renders children passed as string', done => {
    new Promise(resolve => {
      cb = jest.fn(() => {
        resolve();
      });
      const { container } = render(<TypeMe onAnimationEnd={cb}>hello</TypeMe>);
      div = container;
    }).then(() => {
      done();
      expect(cb).toHaveBeenCalledTimes(1);
      expect(div).toMatchSnapshot();
    });
  });

  it('renders children passed as array', done => {
    new Promise(resolve => {
      cb = jest.fn(() => {
        resolve();
      });
      const { container } = render(
        <TypeMe onAnimationEnd={cb}>{['hello']}</TypeMe>
      );
      div = container;
    }).then(() => {
      done();
      expect(div).toMatchSnapshot();
      expect(cb).toHaveBeenCalledTimes(1);
    });
  });

  it('renders string passed as prop', done => {
    new Promise(resolve => {
      cb = jest.fn(() => {
        resolve();
      });
      const { container } = render(
        <TypeMe onAnimationEnd={cb} strings={'hello'} />
      );
      div = container;
    }).then(() => {
      done();
      expect(div).toMatchSnapshot();
      expect(cb).toHaveBeenCalledTimes(1);
    });
  });

  it('renders array passed as prop', done => {
    new Promise(resolve => {
      cb = jest.fn(() => {
        resolve();
      });
      const { container } = render(
        <TypeMe onAnimationEnd={cb} strings={['hello']} />
      );
      div = container;
    }).then(() => {
      done();
      expect(div).toMatchSnapshot();
      expect(cb).toHaveBeenCalledTimes(1);
    });
  });

  it('renders multiple items passed as prop', done => {
    new Promise(resolve => {
      cb = jest.fn(() => {
        resolve();
      });
      const { container } = render(
        <TypeMe onAnimationEnd={cb} strings={['hello', 'there']} />
      );
      div = container;
    }).then(() => {
      done();
      expect(div).toMatchSnapshot();
      expect(cb).toHaveBeenCalledTimes(1);
    });
  });

  it('renders with className as prop', done => {
    new Promise(resolve => {
      cb = jest.fn(() => {
        resolve();
      });
      const { container } = render(
        <TypeMe onAnimationEnd={cb} strings={['hello']} className="new" />
      );
      div = container;
    }).then(() => {
      done();
      expect(div).toMatchSnapshot();
      expect(cb).toHaveBeenCalledTimes(1);
    });
  });

  it('renders with deleted characters', done => {
    new Promise(resolve => {
      cb = jest.fn(() => {
        resolve();
      });
      const { container } = render(
        <TypeMe
          onAnimationEnd={cb}
          strings={['hello', <Delete characters={4} />, 'ola!']}
        />
      );
      div = container;
    }).then(() => {
      done();
      expect(div).toMatchSnapshot();
      expect(cb).toHaveBeenCalledTimes(1);
    });
  });

  it('renders break line', done => {
    new Promise(resolve => {
      cb = jest.fn(() => {
        resolve();
      });
      const { container } = render(
        <TypeMe
          onAnimationEnd={cb}
          strings={['hello', <LineBreak />, 'there']}
        />
      );
      div = container;
    }).then(() => {
      done();
      expect(div).toMatchSnapshot();
      expect(cb).toHaveBeenCalledTimes(1);
    });
  });

  // it('<TypeMe/> onAnimationEnd called once when animation ends', done => {
  //   let cb;
  //   new Promise(resolve => {
  //     cb = jest.fn(() => {
  //       resolve();
  //     });
  //     const { container } = render(<TypeMe onAnimationEnd={cb}>Hello!</TypeMe>);
  //     div = container;
  //   }).then(() => {
  //     done();
  //     expect(cb).toHaveBeenCalledTimes(1);
  //     expect(div).toMatchSnapshot();
  //   });
  // });
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
