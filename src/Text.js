import React, { useState, useEffect } from 'react';

const isServer = () => {
  return !(typeof window != 'undefined' && window.document);
};

const Text = ({
  children,
  endDelay,
  className,
  lineBreak,
  hideCursor,
  typingSpeed,
  deleteSpeed,
  deleteDelay,
  onAnimationEnd,
  startAnimation,
  cursorCharacter,
  deleteCharacters
}) => {
  const charInterval = 1000 * 60 / (typingSpeed * 5); // ms
  const deleteInterval = 1000 * 60 / (deleteSpeed * 5); // ms
  const [string, setString] = useState('');
  const [delayed, setDelayed] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [animationEnded, setAnimationEnded] = useState(false);
  const childrenLength = children && children.length ? children.length : 0;
  let elapsed = 0;

  useEffect(() => {
    const updateString = time => {
      if (elapsed === 0) {
        elapsed = time;
      }
      let curLength = string.length;
      if (!deleting && curLength < childrenLength) {
        if (time >= elapsed + charInterval) {
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
            }, deleteDelay);
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
              if (time >= elapsed + deleteInterval) {
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
    cn = `${cn}${animationEnded && hideCursor ? ' ta-hide' : ''}`;
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
  lineBreak: false,
  hideCursor: false,
  endDelay: false,
  cursorCharacter: '|',
  startAnimation: true,
  typingSpeed: 200, // WPM
  deleteSpeed: 400, // WPM
  deleteDelay: 1000, // ms
  onAnimationEnd: () => {}
};

export default Text;
