import React, { useMemo } from 'react';
import { interpolate, useCurrentFrame, } from 'remotion';
import { loadFont as loadRubik } from '@remotion/google-fonts/Rubik';

const { fontFamily: rubikFont } = loadRubik();

const Ending: React.FC<{ endingDuration?: number; textColor?: string }> = ({ endingDuration = 300, textColor = 'white' }) => {
  const frame = useCurrentFrame();
  const duration = endingDuration;

  // Samakan rotasi watermark dengan Player List
  const watermarkRotation = useMemo(() => {
    return interpolate(frame, [0, duration], [0, 360], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });
  }, [frame, duration]);

  const text = 'Terima Kasih...';
  const characters = text.split('').map((char, index) => {
    if (char === ' ' && index < text.length - 1) {
      return '  ';
    }
    return char;
  });

  const typingProgress = useMemo(() => {
    return interpolate(frame, [0, duration], [0, characters.length], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });
  }, [frame, duration, characters.length]);

  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* SVG Watermark - sama dengan Player List */}
      <div
        style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: 0.5,
          zIndex: 0,
          top: -90,
          left: '50%',
          transform: `translateX(-50%) rotate(${watermarkRotation}deg)`,
          transition: 'transform 0.1s linear',
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480" width="100%" height="100%">
          <path d="m240 240 160-80v-.7A79.8 79.8 0 0 0 320.7 80h-.7l-80 160ZM240 240 160 80h-.7A79.8 79.8 0 0 0 80 159.3v.7l160 80ZM240 240l80 160h.7a79.8 79.8 0 0 0 79.3-79.3v-.7l-160-80ZM240 240 80 320v.7a79.8 79.8 0 0 0 79.3 79.3h.7l80-160ZM240 240l169.7 56.6.5-.5a79.8 79.8 0 0 0 0-112.2l-.5-.5L240 240ZM240 240l56.6-169.7-.5-.5a79.8 79.8 0 0 0-112.2 0l-.5.5L240 240ZM240 240l-56.6 169.7.5.5a79.8 79.8 0 0 0 112.2 0l.5-.5L240 240ZM240 240 70.3 183.4l-.5.5a79.8 79.8 0 0 0 0 112.2l.5.5L240 240Z" fill="#333" />
        </svg>
      </div>
      <div
        style={{
          fontFamily: rubikFont,
          fontSize: '6rem',
          fontWeight: 900, // font weight remains unchanged
          color: textColor,
          textAlign: 'center',
          lineHeight: 1.5,
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          letterSpacing: '0em',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {characters.map((char, i) => (
          <span
            key={i}
            style={{
              opacity: i < typingProgress ? 1 : 0,
              display: 'inline-block',
              transform: `translateY(${i < typingProgress ? 0 : 20}px)`,
              transition: 'all 0.1s ease-out',
              whiteSpace: 'pre',
            }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Ending; 