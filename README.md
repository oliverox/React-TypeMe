# React-TypeMe

A tiny typewriter animation React component, simple and powerful.

## Overview

React-TypeMe is a typewriter animation component built to be simple and powerful. 
It was created primarily to learn about React Hooks. It is built as React functional component.


## Features

* Extremely lightweight (< 2KB gzipped including styling).
* Create string looping animation.
* Customize where your line breaks.
* Simulate character deletions where necessary.
* Control typing and backspace speeds.
* Use your own cursor character.
* Easily add custom delays.
* Control when to start your typing animation.
* Made solely for React - No external dependencies.
* Renders @ 60fps using `requestAnimationFrame`.
* Storybook implementation examples.

##

## Installation

```bash
npm install react-typeme
```

### Usage

```JSX

import TypeMe, { LineBreak, Delete } from 'react-typeme';

// Example #1: text passed as children
<TypeMe>The earth is but one country, and mankind its citizens.</TypeMe>

// Example #2: text passed as prop, with a line break
<TypeMe strings={[
  'The earth is but one country,', 
  <LineBreak />, 
  'And mankind its citizens.'
]} />

// Example #3: text passed as prop, with backspace simulation
<TypeMe strings={[
  'The earth is but one country and mankind its people', 
  <Delete characters={6} />, 
  'citizens.'
]} />

```