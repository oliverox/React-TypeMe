import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';
import TypeMe, { Text } from '../src';

import './styles.css';

storiesOf('TypeMe', module)
  .add('with text as children', () => (
    <TypeMe className="highlighted">
      The world is but one country
    </TypeMe>
  ))
  .add('with text as props', () => (
    <TypeMe strings={['Hello, I am a string passed via props.']} />
  ))
  .add('hide cursor after animation', () => (
    <TypeMe hideCursor={true}>Hello, my cursor will auto-hide after.</TypeMe>
  ));

storiesOf('Welcome', module).add('to Storybook', () => (
  <Welcome showApp={linkTo('Button')} />
));

storiesOf('Button', module)
  .add('with text', () => (
    <Button onClick={action('clicked')}>Hello Button</Button>
  ))
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>
      <span role="img" aria-label="so cool">
        😀 😎 👍 💯
      </span>
    </Button>
  ));
