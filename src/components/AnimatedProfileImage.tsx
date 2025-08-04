import React from "react";
import { useCurrentFrame, interpolate, staticFile } from "remotion";

interface AnimatedProfileImageProps {
  src: string;
  alt: string;
  triggerFrame: number;
  duration?: number;
  size?: number;
  className?: string;
}

export const AnimatedProfileImage: React.FC<AnimatedProfileImageProps> = ({
  src,
  alt,
  triggerFrame,
  duration = 90,
  size = 200,
  className = "",
}) => {
  // Debug: log image source
  console.log('AnimatedProfileImage src:', src);
  const frame = useCurrentFrame();
  const localFrame = Math.max(0, frame - triggerFrame);
  
  // Animasi gradient yang mengalir dari kiri ke kanan
  const gradientPosition = interpolate(
    localFrame,
    [0, duration],
    [-100, 100],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Animasi border yang mengisi lingkaran
  const borderFill = interpolate(
    localFrame,
    [0, duration],
    [0, 100],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Animasi opacity untuk fade in
  const opacity = interpolate(
    localFrame,
    [0, 20],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Animasi scale untuk zoom in effect
  const scale = interpolate(
    localFrame,
    [0, 30],
    [0.8, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <div
      className={`relative rounded-full overflow-hidden ${className}`}
      style={{
        width: size,
        height: size,
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      {/* Image container */}
      <div
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{
          zIndex: 1,
        }}
      >
        {/* Image */}
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover rounded-full"
          style={{
            zIndex: 1,
            border: '1em solid #dc2626',
          }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = staticFile('default.svg');
          }}
        />
        
        {/* Animasi sapuan gradient */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `linear-gradient(90deg, 
              transparent 0%, 
              rgba(255,255,255,0.3) ${gradientPosition}%, 
              rgba(255,255,255,0.5) ${gradientPosition + 5}%, 
              transparent 100%)`,
            zIndex: 2,
          }}
        />
      </div>
    </div>
  );
}; 