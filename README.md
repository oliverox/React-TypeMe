# React-TypeMe
[![npm version](https://badge.fury.io/js/react-typeme.svg)](https://badge.fury.io/js/react-typeme)
<img src="https://img.shields.io/npm/dm/react-typeme.svg">

A tiny typewriter animation React component, simple and powerful.

<img src="https://raw.githubusercontent.com/oliverox/react-typeme/master/demo.gif" width="800">

## Overview

React-TypeMe is a typewriter animation simulator component built to be simple and powerful. 
It was created primarily to learn about the awesome React Hooks. It is built as React functional component.


## Features

* Extremely lightweight (< 2KB gzipped including styling).
* Create string looping animation.
* Customize where your line breaks.
* Simulate character deletions where necessary.
* Control typing and backspace speeds if desired.
* Use your own cursor character.
* Easily add custom delays.
* Control when to start your typing animation.
* Made solely for React - No external dependencies.
* Storybook implementation examples.

## Installation

```bash
npm install react-typeme
```

### Usage

```jsx
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

## License options
`React-TypeMe` is completely free to use within your open source or personal project. To use it in a commercial project, please purchase either a single license use or an unlimited license &mdash; I'll also gladly help if you encounter any issues / bugs.

Personal or Open Source - **FREE!**

[Single Commercial License](https://react-typeme.netlify.com/#license)

[Extended Commercial License](https://react-typeme.netlify.com/#license)


## License
GPL-3.0 © [Oliver Oxenham](mailto:oliver.oxenham+typeme@gmail.com)