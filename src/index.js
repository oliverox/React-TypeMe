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
  keepCursor,
  startAnimation,
  cursorCharacter
}) => {
  const [curAnimIndex, setCurAnimIndex] = useState(0);

  useEffect(() => {
    if (window && !window._TYPEME) {
      console.log('Inserting stylesheet...');
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
          keepCursor={keepCursor}
          cursorCharacter={cursorCharacter}
          onAnimationEnd={() => {
            console.log('Animation ended for', curAnimIndex);
          }}
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
      j = 0;
    for (let i = 0; i < len; i++) {
      let child = strings[i];
      if (typeof child === 'string') {
        lastItem = (
          <Text
            className={className}
            keepCursor={keepCursor ? i === len - 1 : false}
            key={`${INSTANCE_ID}-${j}`}
            startAnimation={j === curAnimIndex ? true : false}
            cursorCharacter={cursorCharacter}
            onAnimationEnd={() => {
              console.log('Animation ended for', curAnimIndex);
              console.log('Setting current anim index to', curAnimIndex + 1);
              setCurAnimIndex(curAnimIndex + 1);
            }}
          >
            {child}
          </Text>
        );
        j++;
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
              child.props
                ? console.log('Setting Delay to', child.props.ms)
                : console.log('No delay set');
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
                key: `${INSTANCE_ID}-${j}`,
                startAnimation: j === curAnimIndex ? true : false,
                onAnimationEnd: () => {
                  console.log('Animation ended for', curAnimIndex);
                  setCurAnimIndex(curAnimIndex + 1);
                }
              });
              j++;
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
  startAnimation: true,
  cursorCharacter: '|',
  keepCursor: true,
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