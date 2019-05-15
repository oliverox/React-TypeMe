import React, { useState, useEffect } from 'react';

const FORWARD = 1;
const BACKSPACE = -1;
const LINEBREAK = 2;
const PAUSE = 3;
const END = 0;

const TypeMe = ({
  loop,
  strings,
  children,
  className,
  hideCursor,
  typingSpeed,
  deleteSpeed,
  backspaceDelay,
  startAnimation,
  onAnimationEnd,
  cursorCharacter,
  cursorBlinkSpeed
}) => {
  const [instanceId] = useState(
    () =>
      Math.random()
        .toString(36)
        .substring(2, 5) +
      Math.random()
        .toString(36)
        .substring(2, 5)
  );
  const [deleteChar, setDeleteChar] = useState(0);
  const [itemIndex, setItemIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [animationPaused, setAnimationPaused] = useState(false);
  const [animationEnded, setAnimationEnded] = useState(false);
  const [typedString, setTypedString] = useState('');
  const [newTypedString, setNewTypedString] = useState('');
  const typingInterval = (1000 * 60) / (typingSpeed * 5); // ms
  const deleteInterval = (1000 * 60) / (deleteSpeed * 5); // ms

  let nextItem;
  let elapsed = 0;

  const getNextItem = items => {
    // console.log('getNextItem()', items);
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
    switch (item.type.displayName) {
      case 'LineBreak':
        return {
          direction: LINEBREAK
        };

      case 'Delete':
        let delay = false;
        let newDeleteChar = 0;
        if (deleteChar === 0) {
          if (item.props.characters === 0) {
            newDeleteChar = newTypedString.length - 1;
          } else {
            newDeleteChar = item.props.characters;
          }
          setDeleteChar(newDeleteChar);
          delay = true;
        } else {
          newDeleteChar = deleteChar - 1;
          setDeleteChar(newDeleteChar);
        }
        return {
          delay,
          direction: BACKSPACE,
          chars: newDeleteChar
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

  const updateTypedString = (interval, nts) => {
    return time => {
      if (elapsed === 0) {
        elapsed = time;
      }
      // console.log('time:', time, elapsed + interval);
      if (time >= elapsed + interval) {
        elapsed = time;
        const split = nts.split('•');
        setTypedString(
          split.map((str, index) => {
            return (
              <span key={`${instanceId}-${index}`}>
                {str}
                {split.length - index > 1 ? <br /> : null}
              </span>
            );
          })
        );
      } else {
        window.requestAnimationFrame(updateTypedString(interval, nts));
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
        `.tm-blink{animation:${animName} ${cursorBlinkSpeed}ms infinite;}`,
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
        if (loop) {
          setCharIndex(0);
          setItemIndex(0);
          setTypedString('');
          setNewTypedString('');
        } else {
          setAnimationEnded(true);
        }
      } else {
        if (direction === FORWARD) {
          // type next character
          let nts = `${newTypedString}${nextItem.string[charIndex]}`;
          setNewTypedString(nts);
          window.requestAnimationFrame(updateTypedString(typingInterval, nts));
          if (charIndex >= nextItem.string.length - 1) {
            setCharIndex(0);
            setItemIndex(prevIndex => prevIndex + 1);
          } else {
            setCharIndex(prevIndex => prevIndex + 1);
          }
        } else if (direction === LINEBREAK) {
          // break line
          let nts = `${newTypedString}•`;
          setNewTypedString(nts);
          window.requestAnimationFrame(updateTypedString(typingInterval, nts));
          setItemIndex(prevIndex => prevIndex + 1);
          setCharIndex(0);
        } else if (direction === BACKSPACE) {
          // delete previous character
          let nts = `${newTypedString.substring(0, newTypedString.length - 1)}`;
          setNewTypedString(nts);
          if (nextItem.chars === 1) {
            setItemIndex(prevIndex => prevIndex + 1);
            setCharIndex(0);
            setDeleteChar(0);
          }
          if (nextItem.delay) {
            window.setTimeout(() => {
              window.requestAnimationFrame(
                updateTypedString(deleteInterval, nts)
              );
            }, backspaceDelay);
          } else {
            window.requestAnimationFrame(
              updateTypedString(deleteInterval, nts)
            );
          }
        } else if (direction === PAUSE) {
          // pause animation
          setItemIndex(prevIndex => prevIndex + 1);
          setCharIndex(0);
          window.setTimeout(() => {
            setAnimationPaused(false);
            window.requestAnimationFrame(updateTypedString(typingInterval, newTypedString));
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
      <span key={`${instanceId}-cur`} className={cursorCn}>
        {animationEnded && hideCursor ? '' : cursorCharacter}
      </span>
    </span>
  );
};

TypeMe.defaultProps = {
  onAnimationEnd: () => {},
  startAnimation: true,
  cursorCharacter: '|',
  cursorBlinkSpeed: 800, // ms
  backspaceDelay: 500, // ms
  typingSpeed: 100, // WPM
  deleteSpeed: 800, // WPM
  hideCursor: false,
  className: '',
  loop: false,
  strings: []
};

export default TypeMe;
