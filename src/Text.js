import React, { useState, useEffect } from 'react';

const TYPING_SPEED = 10; // characters per second
const DELETE_SPEED = 20; // cps
const CHAR_INTERVAL = 1000 / TYPING_SPEED; // ms
const DEL_INTERVAL = 1000 / DELETE_SPEED;
const DELETE_DELAY = 2000; // ms

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

export default Text;