import React, { useState, useEffect } from 'react';
import Text from './Text';

const BLINK_SPEED = 800; // ms
const INSTANCE_ID =
  Math.random()
    .toString(36)
    .substring(2, 5) +
  Math.random()
    .toString(36)
    .substring(2, 5);

const TypeMe = ({
  strings,
  children,
  className,
  hideCursor,
  startAnimation,
  onAnimationEnd,
  cursorCharacter
}) => {
  const [currentAnimationIndex, setCurrentAnimationIndex] = useState(0);

  useEffect(() => {
    if (window && !window._TYPEME) {
      let styleSheet = document.styleSheets[0];
      if (!styleSheet) {
        const style = document.createElement('style');
        document.head.append(style);
        styleSheet = style.sheet;
      }
      let animName = 'ta-blink';
      let animStyle = `{0%{opacity:1;}49%{opacity:1;}50%{opacity:0;}100%{opacity:0;}}`;
      let keyframes = [
        `.ta-hide{display:none}`,
        `.ta-cursor{font:inherit;position:relative;top:-0.05ch;font-style: normal !important;}`,
        `.ta-blink{animation:${animName} ${BLINK_SPEED}ms infinite;}`,
        `@keyframes ${animName}${animStyle}`,
        `@-webkit-keyframes ${animName}${animStyle}`
      ];
      keyframes.forEach(style => {
        styleSheet.insertRule(style, styleSheet.cssRules.length);
      });
      window._TYPEME = true;
    }
  }, []);

  if (children) {
    if (typeof children === 'string') {
      return (
        <Text
          startAnimation={startAnimation}
          className={className}
          hideCursor={hideCursor}
          cursorCharacter={cursorCharacter}
          onAnimationEnd={onAnimationEnd}
        >
          {children}
        </Text>
      );
    } else {
      return children;
    }
  } else if (strings.length > 0) {
    const len = strings.length;
    let out = [],
      lastItem,
      index = 0;
    for (let i = 0; i < len; i++) {
      let child = strings[i];
      if (typeof child === 'string') {
        lastItem = (
          <Text
            className={className}
            hideCursor={!hideCursor && i >= len - 1 ? false : true}
            key={`${INSTANCE_ID}-${index}`}
            startAnimation={index === currentAnimationIndex ? true : false}
            cursorCharacter={cursorCharacter}
            onAnimationEnd={() => {
              if (i >= len - 1) {
                onAnimationEnd();
              } else {
                setCurrentAnimationIndex(currentAnimationIndex + 1);
              }
            }}
          >
            {child}
          </Text>
        );
        index++;
      } else {
        if (lastItem) {
          switch (child.type) {
            case Delete:
              lastItem = React.cloneElement(lastItem, {
                deleteCharacters: child.props.characters
              });
              out = out.slice(0, out.length - 1);
              break;

            case LineBreak:
              lastItem = React.cloneElement(lastItem, {
                lineBreak: true
              });
              out = out.slice(0, out.length - 1);
              break;

            case Delay:
              lastItem = React.cloneElement(lastItem, {
                endDelay:
                  child.props && child.props.ms
                    ? child.props.ms
                    : child.defaultProps.ms
              });
              out = out.slice(0, out.length - 1);
              break;

            case Text:
              lastItem = React.cloneElement(child, {
                key: `${INSTANCE_ID}-${index}`,
                hideCursor: !hideCursor && i >= len - 1 ? false : true,
                startAnimation: index === currentAnimationIndex ? true : false,
                onAnimationEnd: () => {
                  if (i >= len - 1) {
                    onAnimationEnd();
                  } else {
                    setCurrentAnimationIndex(currentAnimationIndex + 1);
                  }
                }
              });
              index++;
              break;

            default:
              break;
          }
        }
      }
      out.push(lastItem);
    }
    return out;
  } else {
    return null;
  }
};

TypeMe.defaultProps = {
  onAnimationEnd: () => {},
  startAnimation: true,
  cursorCharacter: '|',
  hideCursor: true,
  className: '',
  strings: []
};

const Delete = () => null;
Delete.defaultProps = {
  characters: 0
};

const LineBreak = () => null;

const Delay = () => null;
Delay.defaultProps = {
  ms: 0
};

export { Delete, Delay, LineBreak, Text };
export default TypeMe;
