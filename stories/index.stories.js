import React from 'react';

import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

import TypeMe, { LineBreak, Delete, Delay } from '../src/index';
import './styles.css';

// import { Button, Welcome } from '@storybook/react/demo';

storiesOf('TypeMe', module)
  .add('with text as children', () => <TypeMe>I am passed as children</TypeMe>)
  .add('with text as props', () => (
    <TypeMe strings={'I am passed via `strings` prop'} />
  ))
  .add('with className', () => (
    <TypeMe className="title">I have a class applied</TypeMe>
  ))
  .add('with a custom cursor', () => (
    <TypeMe cursorCharacter="_">I have a custom cursor</TypeMe>
  ))
  .add('with faster typing speed', () => (
    <TypeMe typingSpeed={1000}>I am much faster at typing!</TypeMe>
  ))
  .add('hide cursor after animation', () => (
    <TypeMe hideCursor>Hide my cursor after typing</TypeMe>
  ))
  .add('with a line break', () => (
    <TypeMe strings={['Hello there!', <LineBreak />, 'How are you today?']} />
  ))
  .add('with backspace', () => (
    <TypeMe
      strings={[
        'Hello there! How are you today',
        <Delete characters={5} />,
        'doing?'
      ]}
    />
  ))
  .add('with a custom delay', () => (
    <TypeMe
      strings={['Hello there!', <Delay ms={2000} />, ' How are you today?']}
    />
  ))
  .add('loop typing animation', () => <TypeMe loop>I am a loop.</TypeMe>)
  .add('loop after deleting text', () => (
    <TypeMe loop strings={['I am a loop', <Delete />]} />
  ));

// storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

// storiesOf('Button', module)
//   .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
//   .add('with some emoji', () => (
//     <Button onClick={action('clicked')}>
//       <span role="img" aria-label="so cool">
//         😀 😎 👍 💯
//       </span>
//     </Button>
//   ));
