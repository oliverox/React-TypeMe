import React, { useState, useEffect } from 'react';

const BLINK_SPEED = 800; // ms
const INSTANCE_ID =
  Math.random()
    .toString(36)
    .substring(2, 5) +
  Math.random()
    .toString(36)
    .substring(2, 5);

let toRender;
let elapsed = 0;
let charIndex = 0;
let itemIndex = 0;
let nextItem;
let newTypedString = '';
let currentFinalString = '';
let deleteChar = 0;


const getNextItem = item => {
  if (typeof item === 'string') {
    return {
      direction: 1,
      string: item
    }
  }
  switch (item.type.name) {
    case 'LineBreak':
      // return '•';
      return {
        direction: 0,
      }
    
    case 'Delete':
      return {
        direction: -1,
        chars: item.props.characters
      }

    default:
      throw('Error: Invalid item passed in `strings` props');
  }
};


const TypeMe = ({
  strings,
  children,
  className,
  hideCursor,
  typingSpeed,
  startAnimation,
  onAnimationEnd,
  cursorCharacter
}) => {
  const [itemIndex, setItemIndex] = useState(0);
  const [typedString, setTypedString] = useState('');
  const charInterval = (1000 * 60) / (typingSpeed * 5); // ms

  const updateTypedString = time => {
    if (elapsed === 0) {
      elapsed = time;
    }
    console.log('time:', time, elapsed + charInterval);
    if (time >= elapsed + charInterval) {
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
      window.requestAnimationFrame(updateTypedString);
    }
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
        `.tm-hide{display:none}`,
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
    if (startAnimation) {
      
      window.requestAnimationFrame(updateTypedString)
    }
  }, [startAnimation]); 

  
  // if (nextItem.direction > 0) {
  //   charIndex++;
  //   newTypedString = nextItem.string.substring(0, charIndex);
  //   window.requestAnimationFrame(updateTypedString);
  // }

  toRender = (
    <span className="tm">
      {typedString}
      <span className="tm-cursor">{cursorCharacter}</span>
    </span>
  );
  // let next = getNextString(strings[itemIndex]);
  // switch (typeof(next)) {
  //   case 'number':
  //     if (next < 0) {
  //       deleteChar = next;
  //       newTypedString = newTypedString.substring(0, newTypedString.length - 1);
  //       window.requestAnimationFrame(updateTypedString);
  //     }        
  //     break;
    
  //   case 'string':
  //     newTypedString = `${newTypedString}${next[charIndex]}`;
  //     charIndex = charIndex + 1;
  //     if (charIndex < currentFinalString.length) {
  //       newTypedString = `${newTypedString}${currentFinalString[charIndex]}`;
  //       window.requestAnimationFrame(updateTypedString);
  //     } else {
  //       if (itemIndex < strings.length - 1) {
  //         charIndex = 0;
  //         itemIndex = itemIndex + 1;
  //         currentFinalString = getNextString(strings[itemIndex]);
  //         newTypedString = `${newTypedString} ${currentFinalString[charIndex]}`;
  //         window.requestAnimationFrame(updateTypedString);
  //       } else {
  //         onAnimationEnd();
  //       }
  //     }
  //     break;
          
  //   default:
  //     break;
  // }
  return toRender;
};

TypeMe.defaultProps = {
  onAnimationEnd: () => {},
  startAnimation: true,
  cursorCharacter: '|',
  typingSpeed: 100, // WPM
  hideCursor: true,
  className: '',
  strings: []
};

export default TypeMe;
