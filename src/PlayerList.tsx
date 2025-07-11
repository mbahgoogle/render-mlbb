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
import { TopPlayer, validateTopPlayers } from "./types/schema";
import { PlayerCard } from "./components/PlayerCardv1";

import { getLogoCode } from "./utils/getLogoClub";
import { CONFIG } from "./config";

// import rawTopPlayers from "../public/data/alter_ego.json";
// import rawTopPlayers from "../public/data/bigetron_esports.json";
// import rawTopPlayers from "../public/data/dewa_united_esports.json";
import rawTopPlayers from "../public/data/geek_fam_id.json";
// import rawTopPlayers from "../public/data/onic.json";
// import rawTopPlayers from "../public/data/evos.json";
// import rawTopPlayers from "../public/data/rrq_hoshi.json";

// Add helper function to check if URL is local or remote
const getImageSource = (url: string | undefined) => {
  if (!url) return staticFile('default-player.png'); // Add a default image
  // Check if the URL is remote (starts with http:// or https://)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // If it's a local file, use staticFile
  return staticFile(url);
};

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
            src={getImageSource(getLogoCode(person.team))}
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
        Jangan Lupa Like & Share :)
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

const EndingSequence: React.FC<{ endingDuration: number }> = ({ endingDuration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const duration = endingDuration; // Use the prop instead of hardcoded 5 * fps

  // Samakan rotasi watermark dengan Player List
  const watermarkRotation = useMemo(() => {
    return interpolate(
      frame,
      [0, duration],
      [0, 360],
      {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp',
      }
    );
  }, [frame, duration]);

  const text = "Terima Kasih...";
  const characters = text.split('').map((char, index) => {
    if (char === ' ' && index < text.length - 1) {
      return '  ';
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
      {/* SVG Watermark - sama dengan Player List */}
      <div
        style={{
          position: "absolute",
          width: "300px",
          height: "300px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: 0.5,
          zIndex: 0,
          top: -90,
          left: "50%",
          transform: `translateX(-50%) rotate(${watermarkRotation}deg)`,
          transition: "transform 0.1s linear",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 480 480"
          width="100%"
          height="100%"
        >
          <path
            d="m240 240 160-80v-.7A79.8 79.8 0 0 0 320.7 80h-.7l-80 160ZM240 240 160 80h-.7A79.8 79.8 0 0 0 80 159.3v.7l160 80ZM240 240l80 160h.7a79.8 79.8 0 0 0 79.3-79.3v-.7l-160-80ZM240 240 80 320v.7a79.8 79.8 0 0 0 79.3 79.3h.7l80-160ZM240 240l169.7 56.6.5-.5a79.8 79.8 0 0 0 0-112.2l-.5-.5L240 240ZM240 240l56.6-169.7-.5-.5a79.8 79.8 0 0 0-112.2 0l-.5.5L240 240ZM240 240l-56.6 169.7.5.5a79.8 79.8 0 0 0 112.2 0l.5-.5L240 240ZM240 240 70.3 183.4l-.5.5a79.8 79.8 0 0 0 0 112.2l.5.5L240 240Z"
            fill="#000"
          />
        </svg>
      </div>

      <div
        style={{
          fontFamily: rubikFont,
          fontSize: '4rem',
          color: 'black',
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

type PlayerListProps = {
  cardsToShow: number;
  durasiPerCardDetik: number;
  introDelay: number;
  endingDuration: number;
};

export const PlayerList: React.FC<PlayerListProps> = ({ 
  cardsToShow = 10, 
  durasiPerCardDetik = 6, 
  introDelay = 120, 
  endingDuration = 300 
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height, } = useVideoConfig();
  const [handle] = useState(() => delayRender("timeout-60000")); // Tambahkan timeout 60 detik
  const [validatedData, setValidatedData] = useState<TopPlayer[]>([]);

  useEffect(() => {
    const processData = async () => {
      try {
        const data = validateTopPlayers(rawTopPlayers)
          .sort((a, b) => new Date(a.date_of_join).getTime() - new Date(b.date_of_join).getTime())
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

  const durationPerCard = durasiPerCardDetik * fps; // Durasi per kartu dalam frame
  const totalDuration = cardsToShow * durationPerCard;
  const initialDelay = CONFIG.initialDelay;
  const cardEntryDuration = CONFIG.cardEntryDuration;
  const staggerDelay = CONFIG.staggerDelay;
  const mainCardsAnimationDuration = initialDelay + 4 * cardEntryDuration;
  const scrollDuration = totalDuration - mainCardsAnimationDuration;
  const opacityTransitionDuration = CONFIG.opacityTransitionDuration;

  // Hitung frame mulai ending sequence
  // Ganti endingStartFrame agar mulai setelah Player List selesai
  const endingStartFrame = introDelay + totalDuration; // Ending mulai setelah Player List selesai

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
        <div
          className="grass"
          style={{
            // height: '100%',
            // backgroundColor: "#434343",
            // backgroundImage: "linear-gradient(#434343, #282828)",
          }}
        >
          <div className="w-full flex items-center justify-center">
            {/* SVG Watermark */}
            <div
              style={{
                position: "absolute",
                width: "300px",
                height: "300px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                opacity: 0.5,
                zIndex: 0,
                top: -90,
                left: "50%",
                transform: `translateX(-50%) rotate(${watermarkRotation}deg)`,
                transition: "transform 0.1s linear",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 480 480"
                width="100%"
                height="100%"
              >
                <path
                  d="m240 240 160-80v-.7A79.8 79.8 0 0 0 320.7 80h-.7l-80 160ZM240 240 160 80h-.7A79.8 79.8 0 0 0 80 159.3v.7l160 80ZM240 240l80 160h.7a79.8 79.8 0 0 0 79.3-79.3v-.7l-160-80ZM240 240 80 320v.7a79.8 79.8 0 0 0 79.3 79.3h.7l80-160ZM240 240l169.7 56.6.5-.5a79.8 79.8 0 0 0 0-112.2l-.5-.5L240 240ZM240 240l56.6-169.7-.5-.5a79.8 79.8 0 0 0-112.2 0l-.5.5L240 240ZM240 240l-56.6 169.7.5.5a79.8 79.8 0 0 0 112.2 0l.5-.5L240 240ZM240 240 70.3 183.4l-.5.5a79.8 79.8 0 0 0 0 112.2l.5.5L240 240Z"
                  fill="gray"
                />
              </svg>
            </div>

            {/* Watermark Text */}
            <div
              style={{
                position: "absolute",
                width: "30%",
                height: "100%",
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                fontSize: "5rem",
                fontWeight: 900,
                color: "rgba(0, 0, 0, 0.7)",
                pointerEvents: "none",
                zIndex: 0,
                fontFamily: rubikFont,
                textShadow: "4px 4px 8px rgba(0,0,0,0.2)",
                whiteSpace: "nowrap",
                userSelect: "none",
                left: 0,
                top: -20,
                paddingLeft: "1rem",
                // Efek getar (shake)
                transform: `translate(
                  ${Math.sin(frame * 0.8) * 2 + (Math.random() - 0.5) * 1.5}px,
                  ${Math.cos(frame * 1.1) * 2 + (Math.random() - 0.5) * 1.5}px
                ) rotate(${Math.sin(frame * 0.3) * 1.5}deg)`,
                // Efek noise pada opacity
                opacity: 0.18 + Math.abs(Math.sin(frame * 0.7 + Math.random() * 10)) * 0.07,
              }}
            >
              yt@sinauvideo
            </div>

            {/* Watermark Overlay Atas Card, hanya 2 detik di detik ke-10 */}
            {frame >= introDelay + fps * 10 && frame < introDelay + fps * 12 && (
              <div
                style={{
                  position: "absolute",
                  top: 40,
                  left: "50%",
                  transform: `translate(-50%, ${
                    interpolate(
                      frame,
                      [
                        introDelay + fps * 10, 
                        introDelay + fps * 10 + 10, 
                        introDelay + fps * 12 - 10, 
                        introDelay + fps * 12
                      ],
                      [-60, 0, 0, -60], // dari atas ke posisi normal, lalu keluar ke atas lagi
                      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                    )
                  }px)`,
                  zIndex: 10,
                  background: "rgba(0,0,0,0.85)",
                  color: "#fff",
                  fontWeight: 900,
                  fontSize: "3rem",
                  padding: "0.7em 2em",
                  borderRadius: "2em",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
                  fontFamily: rubikFont,
                  opacity: interpolate(
                    frame,
                    [
                      introDelay + fps * 10, 
                      introDelay + fps * 10 + 10, 
                      introDelay + fps * 12 - 10, 
                      introDelay + fps * 12
                    ],
                    [0, 1, 1, 0],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                  ),
                  pointerEvents: "none",
                  transition: "opacity 0.2s, transform 0.2s"
                }}
              >
                yt@sinauvideo
              </div>
            )}

            {/* Container Kartu dengan Efek Scroll */}
            <div
              className="flex gap-4"
              style={{
                transform: `translateX(${scrollX}px)`,
                position: "relative",
                zIndex: 1,
              }}
            >
              {memoizedData.map((person, index) => {
                const isMainCard = index < 4;
                const delay = isMainCard
                  ? initialDelay + index * cardEntryDuration
                  : mainCardsAnimationDuration + (index - 4) * staggerDelay;

                const initialPosition = getStaticCardPosition(index, width);

                const slideUpOffset = isMainCard
                  ? interpolate(
                      frame - delay - introDelay,
                      [0, 30],
                      [200, 0],
                      {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      }
                    )
                  : 0;

                const bounceEffect = spring({
                  frame: frame - delay - introDelay,
                  from: 1,
                  to: 0,
                  fps,
                  config: {
                    damping: 10,
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
                      opacity: interpolate(
                        frame - delay - introDelay,
                        [0, opacityTransitionDuration],
                        [0, 1],
                        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                      ),
                      transform: `translateY(${
                        slideUpOffset + bounceEffect * 20
                      }px)`,
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

          
          <EndingSequence endingDuration={endingDuration} />
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
