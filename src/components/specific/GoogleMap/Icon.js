import React, { useState } from 'react';

const HoverOrTouchIcon = () => {
  const [showText, setShowText] = useState(false);

  const handleMouseEnter = () => {
    setShowText(true);
  };

  const handleMouseLeave = () => {
    setShowText(false);
  };

  const handleTouch = () => {
    setShowText(!showText);
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'inline-block',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouch} // For touch devices
    >
      <svg
        width="50"
        height="50"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ cursor: 'pointer' }}
      >
        <path
          d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 17H13V19H11V17ZM11 7H13V15H11V7Z"
          fill="currentColor"
        />
      </svg>
      {showText && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '5px 10px',
            borderRadius: '4px',
            backgroundColor: 'black',
            color: 'white',
            whiteSpace: 'nowrap',
            zIndex: 1,
            fontSize: '14px',
            marginBottom: '10px',
          }}
        >
          Hover text
        </div>
      )}
    </div>
  );
};

export default HoverOrTouchIcon;
