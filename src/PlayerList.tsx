import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  spring,
  delayRender,
  continueRender,
  Audio,
  OffthreadVideo,
  staticFile,
} from "remotion";
import React, { useMemo, useEffect, useState } from "react";
import { loadFont as loadRubik } from "@remotion/google-fonts/Rubik";
import { TopPlayer, validateTopPlayers, } from "./types/schema";
import { PlayerCard } from "./components/PlayerCardv1";
import { getLogoCode } from "./utils/getLogoClub";



import rawTopPlayers from "../public/data/rrq_hoshi.json";


const { fontFamily: rubikFont } = loadRubik();

const getStaticCardPosition = (index: number, screenWidth: number) => {
  const startPosition = screenWidth / 2 - 1300;
  return startPosition + index * 650;
};

const IntroTitle: React.FC<{ person?: TopPlayer }> = ({ person }) => {
  const frame = useCurrentFrame();

  if (!person) {
    return null; // Jika person tidak ada, jangan render apapun
  }

  const logoSlideDown = useMemo(
    () =>
      interpolate(frame, [0, 15], [0, 5], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    [frame]
  );

  const titleSlideUp = useMemo(
    () =>
      interpolate(frame, [0, 25], [100, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    [frame]
  );

  const subtitleSlideUp = useMemo(
    () =>
      interpolate(frame, [15, 40], [100, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    [frame]
  );

  const presenetBySlideUp = useMemo(
    () =>
      interpolate(frame, [15, 40], [100, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    [frame]
  );

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: rubikFont,
        overflow: "hidden",
      }}
    >
      {/* Logo Klub */}
      <div
        className="flex justify-center items-center pb-5"
        style={{ transform: `translateY(${logoSlideDown}%)` }}
      >
        <div className="w-150 h-150 flex items-center justify-center overflow-hidden rounded-full bg-black">
          <img
            src={getLogoCode(person.team)}
            alt="Club Logo"
            className="w-full h-full object-contain p-20"
          />
        </div>
      </div>

      {/* Judul */}
      <h1
        style={{
          fontSize: "7rem",
          fontWeight: "900",
          transform: `translateY(${titleSlideUp}%)`,
        }}
      >
        {person.team}
      </h1>

      <h2
        style={{
          fontSize: "5rem",
          fontWeight: "700",
          transform: `translateY(${subtitleSlideUp}%)`,
        }}
      >
        Data Riwayat Pemain
      </h2>

      <h2
        style={{
          fontSize: "4rem",
          fontWeight: "700",
          transform: `translateY(${subtitleSlideUp}%)`,
          maxWidth: "60%",
          textAlign: "center",
          margin: "0 auto",
          lineHeight: "1.4"
        }}
      >
        A History of Greatness
      </h2>

      <h3
        style={{
          fontSize: "3rem",
          fontWeight: "600",
          transform: `translateY(${presenetBySlideUp}%)`,
        }}
      >
        ⚡Present by: SINAU VIDEO
      </h3>
    </div>
  );
};

const EndingSequence: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const duration = 4 * fps; // 4 seconds

  const text = "Terima Kasih...";
  const characters = text.split('').map((char, index) => {
    // Add extra space after each word
    if (char === ' ' && index < text.length - 1) {
      return '  '; // Double space after each word
    }
    return char;
  });
  
  const typingProgress = useMemo(() => {
    return interpolate(
      frame,
      [0, duration],
      [0, characters.length],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }
    );
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
      {/* SVG Watermark */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.1,
        zIndex: 0
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480" width="100%" height="100%">
          <path d="m240 240 160-80v-.7A79.8 79.8 0 0 0 320.7 80h-.7l-80 160ZM240 240 160 80h-.7A79.8 79.8 0 0 0 80 159.3v.7l160 80ZM240 240l80 160h.7a79.8 79.8 0 0 0 79.3-79.3v-.7l-160-80ZM240 240 80 320v.7a79.8 79.8 0 0 0 79.3 79.3h.7l80-160ZM240 240l169.7 56.6.5-.5a79.8 79.8 0 0 0 0-112.2l-.5-.5L240 240ZM240 240l56.6-169.7-.5-.5a79.8 79.8 0 0 0-112.2 0l-.5.5L240 240ZM240 240l-56.6 169.7.5.5a79.8 79.8 0 0 0 112.2 0l.5-.5L240 240ZM240 240 70.3 183.4l-.5.5a79.8 79.8 0 0 0 0 112.2l.5.5L240 240Z" fill="#808" />
        </svg>
      </div>

      <div
        style={{
          fontFamily: rubikFont,
          fontSize: '4rem',
          color: 'white',
          textAlign: 'center',
          lineHeight: 1.5,
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          letterSpacing: '0em',
          position: 'relative',
          zIndex: 1
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
              whiteSpace: 'pre'
            }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
};

export const PlayerList: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height, } = useVideoConfig();
  const [handle] = useState(() => delayRender("timeout-60000")); // Tambahkan timeout 60 detik
  const [validatedData, setValidatedData] = useState<TopPlayer[]>([]);

  useEffect(() => {
    const processData = async () => {
      try {
        const data = validateTopPlayers(rawTopPlayers)
          .sort((a, b) => new Date(a.date_of_birth).getTime() - new Date(b.date_of_birth).getTime())
          .reverse(); // Reverse to get oldest first
        setValidatedData(data);
        continueRender(handle);
      } catch (error) {
        console.error("Data validation error:", error);
        continueRender(handle);
      }
    };
    processData();
  }, [handle]);

  const introDelay = 120;
  const totalDuration = fps * 15; // 210 detik
  const cardsToShow = 4; // 42
  const initialDelay = 30;
  const cardEntryDuration = 42; //42
  const staggerDelay = 100;
  const mainCardsAnimationDuration = initialDelay + 4 * cardEntryDuration;
  const scrollDuration = totalDuration - mainCardsAnimationDuration;
  const opacityTransitionDuration = 40; // Increased from 20 to 40 for smoother transition
  const endingDelay = 0; // 1 second delay before ending
  const endingDuration = 5 * fps; // 4 seconds for ending

  // Hitung frame mulai ending sequence
  // Ganti endingStartFrame agar mulai setelah Player List selesai
  const endingStartFrame = introDelay + totalDuration; // setelah Player List selesai

  const memoizedData = useMemo(() => validatedData.slice(0, cardsToShow), [validatedData, cardsToShow]);

  const scrollX = useMemo(
    () =>
      interpolate(frame - mainCardsAnimationDuration, [0, scrollDuration], [0, -650 * (cardsToShow - 1)], {
        extrapolateRight: "clamp",
        extrapolateLeft: "clamp",
      }),
    [frame, mainCardsAnimationDuration, scrollDuration, cardsToShow]
  );

  // Sesuaikan tinggi kartu berdasarkan resolusi video
  const cardHeight = height * 0.5; // Misalnya, setengah dari tinggi video

  // Calculate rotation for watermark
  const watermarkRotation = useMemo(() => {
    return interpolate(
      frame,
      [0, totalDuration],
      [0, 360],
      {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp',
      }
    );
  }, [frame, totalDuration]);

  return (
    <AbsoluteFill>
      {/* Intro Sequence */}
      <Sequence from={0} durationInFrames={introDelay}>
        <div className="grass">
          {memoizedData.length > 0 && <IntroTitle person={memoizedData[0]} />}
        </div>
      </Sequence>

      {/* Player List Animation */}
      <Sequence from={introDelay} durationInFrames={totalDuration}>
        <div className="grass">
          <div className="w-full flex items-center justify-center">
            {/* SVG Watermark */}
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: 0.1,
              zIndex: 0,
              top: -20,
              transform: `rotate(${watermarkRotation}deg)`,
              transition: 'transform 0.1s linear'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480" width="100%" height="100%">
                <path d="m240 240 160-80v-.7A79.8 79.8 0 0 0 320.7 80h-.7l-80 160ZM240 240 160 80h-.7A79.8 79.8 0 0 0 80 159.3v.7l160 80ZM240 240l80 160h.7a79.8 79.8 0 0 0 79.3-79.3v-.7l-160-80ZM240 240 80 320v.7a79.8 79.8 0 0 0 79.3 79.3h.7l80-160ZM240 240l169.7 56.6.5-.5a79.8 79.8 0 0 0 0-112.2l-.5-.5L240 240ZM240 240l56.6-169.7-.5-.5a79.8 79.8 0 0 0-112.2 0l-.5.5L240 240ZM240 240l-56.6 169.7.5.5a79.8 79.8 0 0 0 112.2 0l.5-.5L240 240ZM240 240 70.3 183.4l-.5.5a79.8 79.8 0 0 0 0 112.2l.5.5L240 240Z" fill="#808" />
              </svg>
            </div>

            {/* Watermark Text */}
            <div style={{
              position: 'absolute',
              width: '30%',
              height: '100%',
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              fontSize: '3rem',
              fontWeight: '900',
              color: 'rgba(128, 0, 128, 0.2)',
              pointerEvents: 'none',
              zIndex: 0,
              fontFamily: rubikFont,
              textShadow: '4px 4px 8px rgba(0,0,0,0.2)',
              whiteSpace: 'nowrap',
              userSelect: 'none',
              left: 0,
              top: -20,
              paddingLeft: '1rem'
            }}>
              yt@sinauvideo
            </div>

            {/* Container Kartu dengan Efek Scroll */}
            <div className="flex gap-4" style={{ transform: `translateX(${scrollX}px)`, position: 'relative', zIndex: 1 }}>
              {memoizedData.map((person, index) => {
                const isMainCard = index < 4;
                const delay = isMainCard
                  ? initialDelay + index * cardEntryDuration
                  : mainCardsAnimationDuration + (index - 4) * staggerDelay;

                const initialPosition = getStaticCardPosition(index, width);

                const slideUpOffset = isMainCard
                  ? interpolate(frame - delay - introDelay, [0, 30], [200, 0], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    })
                  : 0;

                const bounceEffect = spring({
                  frame: frame - delay - introDelay,
                  from: 1,
                  to: 0,
                  fps,
                  config: {
                    damping: 10, // Lebih smooth
                    stiffness: 90,
                    mass: 0.5,
                  },
                });

                return (
                  <div
                    key={person.date_of_birth}
                    className="absolute pt-10"
                    style={{
                      left: initialPosition,
                      opacity: interpolate(frame - delay - introDelay, [0, opacityTransitionDuration], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      }),
                      transform: `translateY(${slideUpOffset + bounceEffect * 20}px)`,
                    }}
                  >
                    <PlayerCard person={person} style={{ height: cardHeight }} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <Audio
          volume={(f) =>
            interpolate(
              f,
              [0, 30, totalDuration - 10 * fps, totalDuration],
              [0, 0.5, 0.5, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            )
          }
          src={staticFile("_audio/parzival_william_rosati.mp3")}
          startFrom={120}
        />
      </Sequence>

      {/* Ending Sequence - Muncul setelah Player List Animation selesai */}
      <Sequence from={endingStartFrame} durationInFrames={endingDuration}>
        <div className="grass" style={{ opacity: interpolate(
          frame - endingStartFrame,
          [0, 30],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        ) }}>
          <EndingSequence />
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
