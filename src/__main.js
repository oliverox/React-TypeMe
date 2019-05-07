import React, { useState, useEffect } from 'react';

const TYPING_SPEED = 10; // characters per second
const DELETE_SPEED = 20; // cps
const CHAR_INTERVAL = 1000 / TYPING_SPEED; // ms
const DEL_INTERVAL = 1000 / DELETE_SPEED;
const DELETE_DELAY = 2000; // ms
const BLINK_SPEED = 800; // ms
const INSTANCE_ID =
  Math.random()
    .toString(36)
    .substring(2, 5) +
  Math.random()
    .toString(36)
    .substring(2, 5);

const isServer = () => {
  return !(typeof window != 'undefined' && window.document);
};

const Text = ({
  endDelay,
  className,
  children,
  lineBreak,
  keepCursor,
  onAnimationEnd,
  startAnimation,
  cursorCharacter,
  deleteCharacters
}) => {
  const [string, setString] = useState('');
  const [delayed, setDelayed] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [animationEnded, setAnimationEnded] = useState(false);
  const childrenLength = children.length;
  let elapsed = 0;

  useEffect(() => {
    const updateString = time => {
      if (elapsed === 0) {
        elapsed = time;
      }
      let curLength = string.length;
      if (!deleting && curLength < childrenLength) {
        if (time >= elapsed + CHAR_INTERVAL) {
          setString(children.substring(0, curLength + 1));
          elapsed = time;
        } else {
          window.requestAnimationFrame(updateString);
        }
      } else {
        if (deleteCharacters > 0) {
          if (!deleting) {
            setDelayed(true);
            window.setTimeout(() => {
              setDeleting(true);
              setDelayed(false);
              setString(children.substring(0, curLength - 1));
            }, DELETE_DELAY);
          } else {
            if (curLength === childrenLength - deleteCharacters) {
              if (endDelay > 0) {
                setDelayed(true);
                window.setTimeout(() => {
                  setDelayed(false);
                  setAnimationEnded(true);
                  onAnimationEnd();
                }, endDelay);
              } else {
                setAnimationEnded(true);
                onAnimationEnd();
              }
            } else {
              if (time >= elapsed + DEL_INTERVAL) {
                setString(children.substring(0, curLength - 1));
              } else {
                window.requestAnimationFrame(updateString);
              }
            }
          }
        } else {
          // animation end
          if (endDelay > 0) {
            setDelayed(true);
            window.setTimeout(() => {
              setDelayed(false);
              setAnimationEnded(true);
              onAnimationEnd();
            }, endDelay);
          } else {
            setAnimationEnded(true);
            onAnimationEnd();
          }
        }
      }
    };
    if (startAnimation && !isServer()) {
      window.requestAnimationFrame(updateString);
    }
  }, [string, startAnimation]);

  let cn = `${className}${className.length > 0 ? ' ta-cursor' : 'ta-cursor'}`;
  cn = `${cn}${animationEnded || delayed ? ' ta-blink' : ''}`;
  if (!startAnimation && !animationEnded) {
    cn = `${cn} ta-hide`;
  } else {
    cn = `${cn}${animationEnded && !keepCursor ? ' ta-hide' : ''}`;
  }
  return (
    <span className="ta-anim">
      <span className={`${className}`}>{isServer() ? children : string}</span>
      {!isServer() && <span className={cn}>{cursorCharacter}</span>}
      {lineBreak ? <br /> : null}
    </span>
  );
};

Text.defaultProps = {
  className: '',
  eraseLength: 0,
  lineBreak: false,
  keepCursor: true,
  endDelay: false,
  startAnimation: true,
  onAnimationEnd: () => {
    console.log('onAnimationEnd => 0');
  }
};

const TypeAnim = ({
  strings,
  children,
  className,
  keepCursor,
  startAnimation,
  cursorCharacter
}) => {
  const [curAnimIndex, setCurAnimIndex] = useState(0);

  useEffect(() => {
    console.log('Inserting stylesheet...');
    let styleSheet = document.styleSheets[0];
    let animName = 'ta-blink';
    let animStyle = `{0%{opacity:1;}49%{opacity:1;}50%{opacity:0;}100%{opacity:0;}}`;
    let keyframes = [
      `.ta-hide{display:none}`,
      `.ta-cursor{will-change:opacity;font:inherit;position:relative;top:-0.05ch;}`,
      `.ta-blink{animation:${animName} ${BLINK_SPEED}ms infinite;}`,
      `@keyframes ${animName}${animStyle}`,
      `@-webkit-keyframes ${animName}${animStyle}`
    ];
    keyframes.forEach(style => {
      styleSheet.insertRule(style, styleSheet.cssRules.length);
    });
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
  }
};

TypeAnim.defaultProps = {
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
export default TypeAnim;

/* Usage examples

  const Text = TypeAnim.Text;

  Default: 
    <TypeAnim>Hello, World</TypeAnim>

    <TypeAnim>{[
      'Hello, World',
      <Delete characters={5} />,
      'Oliver'
    ]}</TypeAnim>

*/
