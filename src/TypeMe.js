import React, { useState, useEffect } from 'react';

const BLINK_SPEED = 800; // ms
const INSTANCE_ID =
  Math.random()
    .toString(36)
    .substring(2, 5) +
  Math.random()
    .toString(36)
    .substring(2, 5);
const FORWARD = 1;
const BACKSPACE = -1;
const LINEBREAK = 2;
const PAUSE = 3;
const END = 0;

let nextItem;
let elapsed = 0;
let charIndex = 0;
let itemIndex = 0;
let deleteChar = 0;
let newTypedString = '';

const getNextItem = items => {
  let item;
  if (itemIndex >= items.length) {
    return {
      direction: END // animation ends
    };
  }
  item = items[itemIndex];
  if (typeof item === 'string') {
    return {
      direction: FORWARD,
      string: item
    };
  }
  switch (item.type.name) {
    case 'LineBreak':
      return {
        direction: LINEBREAK
      };

    case 'Delete':
      let delay = false;
      if (deleteChar === 0) {
        deleteChar = item.props.characters;
        delay = true;
      } else {
        deleteChar--;
      }
      return {
        delay,
        direction: BACKSPACE,
        chars: deleteChar
      };

    case 'Delay':
      return {
        direction: PAUSE,
        ms: item.props.ms
      };

    default:
      throw 'Error: Invalid item passed in `strings` props or as children.';
  }
};

const TypeMe = ({
  strings,
  children,
  className,
  hideCursor,
  typingSpeed,
  deleteSpeed,
  backspaceDelay,
  startAnimation,
  onAnimationEnd,
  cursorCharacter
}) => {
  const [animationPaused, setAnimationPaused] = useState(false);
  const [animationEnded, setAnimationEnded] = useState(false);
  const [typedString, setTypedString] = useState('');
  const typingInterval = (1000 * 60) / (typingSpeed * 5); // ms
  const deleteInterval = (1000 * 60) / (deleteSpeed * 5); // ms

  const updateTypedString = interval => {
    return time => {
      if (elapsed === 0) {
        elapsed = time;
      }
      // console.log('time:', time, elapsed + interval);
      if (time >= elapsed + interval) {
        elapsed = time;
        const split = newTypedString.split('•');
        setTypedString(
          split.map((str, index) => {
            return (
              <span key={`${INSTANCE_ID}-${index}`}>
                {str}
                {split.length - index > 1 ? <br /> : null}
              </span>
            );
          })
        );
      } else {
        window.requestAnimationFrame(updateTypedString(interval));
      }
    };
  };

  useEffect(() => {
    if (window && !window._TYPEME) {
      let styleSheet = document.styleSheets[0];
      if (!styleSheet) {
        const style = document.createElement('style');
        document.head.append(style);
        styleSheet = style.sheet;
      }
      let animName = 'tm-blink';
      let animStyle = `{0%{opacity:1;}49%{opacity:1;}50%{opacity:0;}100%{opacity:0;}}`;
      let keyframes = [
        `.tm-cursor{display:inline-block;transform:scale(1.2);font:inherit;position:relative;font-style:normal !important;}`,
        `.tm-blink{animation:${animName} ${BLINK_SPEED}ms infinite;}`,
        `@keyframes ${animName}${animStyle}`,
        `@-webkit-keyframes ${animName}${animStyle}`
      ];
      keyframes.forEach(style => {
        styleSheet.insertRule(style, styleSheet.cssRules.length);
      });
      window._TYPEME = true;
    }
  }, []);

  useEffect(() => {
    // console.log('start animation is', startAnimation);
    if (startAnimation) {
      let items = [];
      if (strings && Array.isArray(strings)) {
        items = strings;
      }
      if (strings && typeof strings === 'string') {
        items = [strings];
      }
      if (children && typeof children === 'string') {
        items = [children];
      }
      if (children && Array.isArray(children)) {
        items = children;
      }
      nextItem = getNextItem(items);
      let { direction } = nextItem;
      if (direction === END) {
        onAnimationEnd();
        setAnimationEnded(true);
      } else {
        if (direction === FORWARD) {
          // type next character
          newTypedString = `${newTypedString}${nextItem.string[charIndex]}`;
          charIndex++;
          if (charIndex >= nextItem.string.length) {
            charIndex = 0;
            itemIndex++;
          }
          window.requestAnimationFrame(updateTypedString(typingInterval));
        } else if (direction === LINEBREAK) {
          // break line
          newTypedString = `${newTypedString}•`;
          itemIndex++;
          charIndex = 0;
          window.requestAnimationFrame(updateTypedString(typingInterval));
        } else if (direction === BACKSPACE) {
          // delete previous character
          newTypedString = `${newTypedString.substring(
            0,
            newTypedString.length - 1
          )}`;
          if (nextItem.chars === 1) {
            itemIndex++;
            charIndex = 0;
            deleteChar = 0;
          }
          if (nextItem.delay) {
            window.setTimeout(() => {
              window.requestAnimationFrame(updateTypedString(deleteInterval));
            }, backspaceDelay);
          } else {
            window.requestAnimationFrame(updateTypedString(deleteInterval));
          }
        } else if (direction === PAUSE) {
          // pause animation
          itemIndex++;
          charIndex = 0;
          window.setTimeout(() => {
            setAnimationPaused(false);
            window.requestAnimationFrame(updateTypedString(typingInterval));
          }, nextItem.ms);
          setAnimationPaused(true);
        }
      }
    }
  }, [startAnimation, typedString]);

  let containerCn = 'tm';
  let cursorCn = 'tm-cursor';
  if (className) {
    containerCn = `${containerCn} ${className}`;
  }
  if (animationEnded || animationPaused) {
    cursorCn = `${cursorCn} tm-blink`;
  }
  return (
    <span className={containerCn}>
      {typedString}
      <span key={`${INSTANCE_ID}-cur`} className={cursorCn}>
        {animationEnded && hideCursor ? '' : cursorCharacter}
      </span>
    </span>
  );
};

TypeMe.defaultProps = {
  onAnimationEnd: () => {},
  startAnimation: true,
  cursorCharacter: '|',
  backspaceDelay: 500, // ms
  typingSpeed: 100, // WPM
  deleteSpeed: 800, // WPM
  hideCursor: false,
  className: '',
  strings: []
};

export default TypeMe;
