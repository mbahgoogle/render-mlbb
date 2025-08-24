import React from "react";
import { rawData } from "../types/schema";
import { CircleFlag } from "react-circle-flags";

import { getCountryCode, getCountryName } from "../utils/getCountryCode";

import { loadFont as loadRoboto } from "@remotion/google-fonts/Roboto";
// import { loadFont as loadRobotoMono } from "@remotion/google-fonts/RobotoMono";
import { loadFont as loadRubik } from "@remotion/google-fonts/Rubik";
// import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import { loadFont as loadNotoSans } from "@remotion/google-fonts/NotoSans";

import { useVideoConfig, staticFile } from "remotion";
import { FadeInOnFrame } from "../plugin/FadeInOnFrame";
import { TypingOnFrame } from "../plugin/TypingOnFrame";
import { AnimatedProfileImage } from "../plugin/AnimatedProfileImage";
import { AnimatedNumberCounterAdvanced } from "../plugin/AnimatedNumberCounterAdvanced";
import { CONFIG } from "../config";
import YouTubeReward from "../utils/YouTubeReward";
import { ScrollText } from "../plugin/ScrollText";

// Add helper function to check if URL is local or remote
const getImageSource = (url: string | undefined) => {
  if (!url) return staticFile('default.svg'); // Add a default image
  // Check if the URL is remote (starts with http:// or https://)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // If it's a local file, use staticFile
  return staticFile(url);
};

// Load fonts
const { fontFamily: robotoFont } = loadRoboto();
// const { fontFamily: robotoMonoFont } = loadRobotoMono();
const { fontFamily: RubikFont } = loadRubik();
// const { fontFamily: poppinsFont } = loadPoppins();
const { fontFamily: notoSansFont } = loadNotoSans();


interface CardingProps {
  person: rawData & { club_logo?: string };
  style?: React.CSSProperties;
  index?: number;
  triggerFrame: number; // <-- wajib
}

export const Carding: React.FC<CardingProps> = ({ person, style, index, triggerFrame }) => {
  const HeightConfig = useVideoConfig().height * 0.94;
  const totalCards = CONFIG.cardsToShow; // Use cardsToShow from config.ts
  const nationName = getCountryName(person.nation_code || "");
  const Name = person.name || "";
  const Subscribes = person.followers_count?.toString() || "N/A";

  const fadeInDuration = 20;

  return (
    <>
      <style>
        {`
          @keyframes twitchBlink {
            45%, 55% {
              clip-path: polygon(7.5% 0%, 40% 0%, 40% 35%, 50% 35%, 50% 35%, 40% 35%, 40% 0%, 65% 0%, 65% 35%, 75% 35%, 75% 35%, 65% 35%, 65% 0%, 92.5% 0%, 92.5% 62.5%, 70% 82.5%, 50% 82.5%, 30% 100%, 30% 82.5%, 7.5% 82.5%);
            }
            40%, 50%, 60% {
              clip-path: polygon(7.5% 0%, 40% 0%, 40% 50%, 50% 50%, 50% 20%, 40% 20%, 40% 0%, 65% 0%, 65% 50%, 75% 50%, 75% 20%, 65% 20%, 65% 0%, 92.5% 0%, 92.5% 62.5%, 70% 82.5%, 50% 82.5%, 30% 100%, 30% 82.5%, 7.5% 82.5%);
            }
          }
        `}
      </style>
      <div
        className="flex justify-center items-center p-0 card-container"
        style={{
          ...style,
          height: "100%",
          fontFamily: `${robotoFont}, Arial, sans-serif`,
          boxShadow: `0 24px 48px rgba(80,0,80,0.18)`,
        }}
      >
      <div
        className="w-[620px] rounded-lx shadow-2xl"
        style={{
          height: HeightConfig,
          boxShadow: "0 0.5em 2em 0 rgba(31, 38, 135, 0.18)",
          backdropFilter: "blur(5em)",
          WebkitBackdropFilter: "blur(5em)",
          backgroundColor: "rgb(255, 255, 255)",
          // clipPath: "inset(0 round 10px)", // Replace overflow-hidden with clip-path
        }}
      >
        {/* Header */}
        <div
          className="relative h-140 rounded-t-xl"
          style={{ borderBottom: '1em solid rgba(131, 110, 110, 0)' }}
        >
            {/* Image */}
            <div
            className="absolute left-0 flex items-center justify-center"
            style={{
              top: '1em', // Geser lebih ke atas
              position: 'absolute',
              padding: '1.5em',
              height: '550px',
              width: '100%',
            }}
            >
            <AnimatedProfileImage
              src={getImageSource(person.image || "")}
              alt={person.name || ""}
              triggerFrame={triggerFrame}
              duration={90}
              size={500}
            />
            </div>

          {/* Animated Sequence Number Counter - Pojok Kanan Atas */}
          <div className="absolute top-0 left-10 p-4">
            <AnimatedNumberCounterAdvanced
              number={index !== undefined ? totalCards - index : totalCards}
              triggerFrame={triggerFrame}
              duration={900}
            />
          </div>
        </div>

        {/* Username Above Player Info */}
        <FadeInOnFrame triggerFrame={triggerFrame + 2} duration={fadeInDuration}>
            <div
            className="text-center text-gray-900 flex items-center justify-center font-bold p-10"
            style={{
              margin: '0 auto',
              overflow: 'hidden',
              width: '100%',
              height: '8rem',
              position: 'relative',
            }}
            >
            <ScrollText
              text={Name}
              triggerFrame={triggerFrame + 39}
              duration={300}
              style={{
                fontFamily: notoSansFont,
                fontWeight: 700, // Bold weight
                fontSize: '3rem', // Slightly larger size
              }}
            />
            </div>
        </FadeInOnFrame>

        {/* Brand Section */}
        <div className="pt-0 px-6 pb-4">
          <div className="flex flex-col items-center text-center">
            <div className="flex-grow">
             <FadeInOnFrame triggerFrame={(triggerFrame ?? 0) + 100} duration={fadeInDuration}>
                <div className="flex justify-center mt-4">
                  <span
                    className="bg-gray-900 text-white px-6 py-6 font-bold rounded-full flex items-center gap-3 text-4xl"
                    style={{
                      fontFamily: RubikFont,
                      border: '6px solid #9147ff',
                      boxSizing: 'border-box',
                      // Optionally add a shadow for more pop:
                      // boxShadow: '0 0 0 4px #9147ff',
                    }}
                  >
                    TWITCH.TV
                  </span>
                </div>
              </FadeInOnFrame>
            </div>
          </div>
        </div>

        {/* Full Name */}
        <FadeInOnFrame triggerFrame={triggerFrame + 2} 
          duration={fadeInDuration}
        >
            <div className="bg-gray-900 border-t text-4xl border-b border-gray-700 gap-8 rounded-md p-7 px-5 mx-5">
            <div>
              <p className="text-gray-200 font-bold" style={{
                minWidth: '300px',
                whiteSpace: 'nowrap', 
                }}>
                <div
                style={{
                  maxWidth: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  minWidth: '300px',
                }}
                title={person.full_name || "Unknown"}
                >
                <TypingOnFrame
                  text={person.full_name || "Unknown"}
                  triggerFrame={triggerFrame + 39}
                  duration={30}
                  style={{ 
                  fontFamily: `${notoSansFont}, 'Noto Sans', 'Noto Sans CJK', 'Noto Sans Thai', 'Noto Sans Hebrew', 'Noto Sans Devanagari', 'Noto Sans Khmer', sans-serif` 
                  }}
                />
                </div>
              </p>
            </div>
            </div>
        </FadeInOnFrame>

        <div className="grid grid-cols-2 gap-8 p-5">
          
          {/* Category */}
          <FadeInOnFrame triggerFrame={triggerFrame + 4} 
            duration={fadeInDuration}
            style={{ gridColumn: "1 / -1", width: "100%" }}
          >
            <div className="flex items-center text-left gap-4 p-3 bg-gray-900 rounded-md w-full">
              <div>
                <p className="text-2xl text-gray-200 uppercase font-extrabold tracking-widest" style={{ fontFamily: RubikFont }}>Category</p>
                <p className="text-4xl text-gray-50 font-black mt-2">
                    {person.category}
                </p>
              </div>
            </div>
          </FadeInOnFrame>

          {/* subscribes */}
          <FadeInOnFrame triggerFrame={triggerFrame + 4} 
            duration={fadeInDuration}
            style={{ gridColumn: "1 / -1", width: "100%" }}
          >
            <div className="flex w-full rounded-md overflow-hidden" style={{ minHeight: 110 }}>
              {/* Left: Subscribes info */}
              <div
                className="flex flex-col justify-center flex-1 p-3"
                style={{
                  background: "linear-gradient(90deg, #111827 80%, #18181b 100%)",
                  borderTopLeftRadius: 8,
                  borderBottomLeftRadius: 8,
                }}
              >
                <p className="text-2xl text-gray-200 uppercase font-extrabold tracking-widest" style={{ fontFamily: RubikFont }}>
                  Followers
                </p>
                <p className="text-4xl text-gray-50 font-black mt-2">
                  {(() => {
                    const num = Number(Subscribes.replace(/,/g, ""));
                    if (isNaN(num)) return Subscribes;
                    if (num >= 1_000_000_000) {
                      const billions = num / 1_000_000_000;
                      if (billions % 1 === 0) {
                        return `${billions} Billion`;
                      }
                      // Gunakan Math.round untuk menghindari pembulatan yang tidak diinginkan
                      const roundedBillions = Math.round(billions * 10) / 10;
                      return `${roundedBillions} Billion`;
                    }
                    if (num >= 1_000_000) {
                      const millions = num / 1_000_000;
                      if (millions % 1 === 0) {
                        return `${millions} Million`;
                      }
                      // Gunakan Math.floor untuk memastikan tidak membulatkan ke atas
                      const flooredMillions = Math.floor(millions * 10) / 10;
                      return `${flooredMillions} Million`;
                    }
                    if (num >= 1_000) {
                      const thousands = num / 1_000;
                      if (thousands % 1 === 0) {
                        return `${thousands}K`;
                      }
                      // Gunakan Math.round untuk menghindari pembulatan yang tidak diinginkan
                      const roundedThousands = Math.round(thousands * 10) / 10;
                      return `${roundedThousands}K`;
                    }
                    return num.toString();
                  })()}
                </p>
              </div>
            </div>
          </FadeInOnFrame>

          {/* Twitch Animation */}
          <FadeInOnFrame triggerFrame={triggerFrame + 4} 
            duration={fadeInDuration}
            style={{ gridColumn: "1 / -1", width: "100%" }}
          >
            <div className="flex justify-center items-center p-4">
              <div 
                className="twitch-logo"
                style={{
                  width: '80px',
                  height: '80px',
                  position: 'relative',
                  filter: 'drop-shadow(-1px 1px #9147ff) drop-shadow(-1px 1px #9147ff) drop-shadow(-1px 1px #9147ff) drop-shadow(-1px 1px #9147ff) drop-shadow(-1px 1px #9147ff) drop-shadow(-1px 1px #9147ff) drop-shadow(-1px 1px #9147ff) drop-shadow(-1px 1px #9147ff) drop-shadow(-1px 1px #9147ff) drop-shadow(-1px 1px #9147ff) drop-shadow(-1px 1px #9147ff)',
                }}
              >
                <div
                  style={{
                    content: '""',
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: '0%',
                    left: '0%',
                    clipPath: 'polygon(7.5% 0%, 92.5% 0%, 92.5% 62.5%, 70% 82.5%, 50% 82.5%, 30% 100%, 30% 82.5%, 7.5% 82.5%)',
                    background: '#9147ff',
                    transform: 'scale(1.25)',
                  }}
                />
                <div
                  style={{
                    content: '""',
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: '0%',
                    left: '0%',
                    background: '#ffffff',
                    clipPath: 'polygon(7.5% 0%, 40% 0%, 40% 50%, 50% 50%, 50% 20%, 40% 20%, 40% 0%, 65% 0%, 65% 50%, 75% 50%, 75% 20%, 65% 20%, 65% 0%, 92.5% 0%, 92.5% 62.5%, 70% 82.5%, 50% 82.5%, 30% 100%, 30% 82.5%, 7.5% 82.5%)',
                    animation: 'twitchBlink 4s ease-in-out infinite',
                  }}
                />
              </div>
            </div>
          </FadeInOnFrame>
          
         
        </div>
      </div>
    </div>
    </>
  );
};

export default Carding;

