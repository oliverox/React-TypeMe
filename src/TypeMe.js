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
  let toRender;

  if (!Array.isArray(strings) && strings.length > 0) {
    throw 'Error: "strings" prop takes an array of strings.';
  }

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
        `.ta-container{display:inline-block;}`,
        `.ta-anim{float:left;}`,
        `.ta-hide{visibility:hidden;}`,
        `.ta-text{vertical-align:baseline;}`,
        `.ta-cursor{font:inherit;position:relative;top:.1ch;font-style:normal !important;}`,
        `.ta-anim .ta-cursor{font-size:130%;}`,
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
      toRender = (
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
      toRender = children;
    }
  } else if (strings.length > 0) {
    const len = strings.length;
    let out = [],
      lastItem,
      index = 0;
    let br = false;
    let del = false;
    for (let i = 0; i < len; i++) {
      let child = strings[i];
      console.log(child);
      if (typeof child === 'string') {
        lastItem = (
          <Text
            index={index}
            className={className}
            lineBreak={br}
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
        br = false;
        index++;
      } else {
        if (lastItem) {
          switch (child.type.name) {
            case 'Delete':
              lastItem = React.cloneElement(lastItem, {
                deleteCharacters: child.props.characters
              });
              out = out.slice(0, out.length - 1);
              del = true;
              break;

            case 'LineBreak':
              // add clear:left on next element
              br = true;
              break;

            case 'Delay':
              lastItem = React.cloneElement(lastItem, {
                endDelay:
                  child.props && child.props.ms
                    ? child.props.ms
                    : child.defaultProps.ms
              });
              out = out.slice(0, out.length - 1);
              break;

            case 'Text':
              lastItem = React.cloneElement(child, {
                key: `${INSTANCE_ID}-${index}`,
                lineBreak: br,
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
      if (!br) {
        out.push(lastItem);
      }
    }
    toRender = out;
  } else {
    return null;
  }
  return <span className="ta-container">{toRender}</span>;
};

TypeMe.defaultProps = {
  onAnimationEnd: () => {},
  startAnimation: true,
  cursorCharacter: '|',
  hideCursor: false,
  className: '',
  strings: []
};

export default TypeMe;
