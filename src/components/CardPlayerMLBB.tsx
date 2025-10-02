import React from "react";
import { rawData } from "../types/schema";
import { CircleFlag } from "react-circle-flags";
import { getCountryCode } from "../utils/getCountryCode";
import { getLogoCode } from "../utils/getLogoClub";
import { herosIcon } from "../utils/getHeros";
import { loadFont as loadRoboto } from "@remotion/google-fonts/Roboto";
import { loadFont as loadRobotoMono } from "@remotion/google-fonts/RobotoMono";
import { loadFont as loadRubik } from "@remotion/google-fonts/Rubik";
// import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
// import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import { useVideoConfig, staticFile, Img, useCurrentFrame, interpolate } from "remotion";
import { FadeInOnFrame } from "../plugin/FadeInOnFrame";
import { ScrollText } from "../plugin/ScrollText";
import { TypingOnFrame } from "../plugin/TypingOnFrame";

// Load fonts - using default loading to avoid TypeScript errors
const { fontFamily: robotoFont } = loadRoboto();
const { fontFamily: robotoMonoFont } = loadRobotoMono();
const { fontFamily: RubikFont } = loadRubik();
// const { fontFamily: interFont } = loadInter();
// const { fontFamily: PoppinsFont } = loadPoppins();

interface CardingProps {
  person: rawData & { club_logo?: string };
  style?: React.CSSProperties;
  triggerFrame: number; // <-- wajib
}

export const Carding: React.FC<CardingProps> = ({ person, style, triggerFrame }) => {
  const HeightConfig = useVideoConfig().height * 0.94;
  const frame = useCurrentFrame();

  const getSrc = (url: string | undefined) => {
    if (!url) return staticFile('default.svg');
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return staticFile(url);
  };

  return (
    <div
      className="flex justify-center items-center p-0"
      style={{
        ...style,
        height: "100%",
        fontFamily: `${robotoFont}, Arial, sans-serif`,
      }}
    >
      <div
        className="w-[600px] rounded-xl shadow-2xl overflow-hidden"
        style={{
          height: HeightConfig,
          background: "linear-gradient(180deg, #ffffff 0%,rgb(217, 255, 0) 100%)",
          border: "1px solid rgba(0,0,0,0.05)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
        }}
      >
        {/* Header */}
        <div className="relative h-140 rounded-t-xl overflow-hidden p-0" style={{ background: '#f7f8fb' }}>
          {/* Background image overlay (subtle) */}
          {person.logo_league && (
            <Img
              src={getSrc(person.logo_league)}
              alt="Header Background"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                opacity: 0.06,
                pointerEvents: 'none',
              }}
            />
          )}
          {/* Club Logo */}
          <div className="absolute top-6 right-6 w-100 h-100 opacity-80">
            <FadeInOnFrame
              triggerFrame={(triggerFrame ?? 0) + 5}
              duration={500}
              fromY={500}
              toY={0}
              style={{ width: '100%', height: '100%', display: 'block' }}
            >
            <Img
              src={getSrc(getLogoCode(person.team || ""))}
              alt="Club Logo"
              className="w-full h-full object-contain"
              style={{
                willChange: 'transform',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
                opacity: 1,
                transition: 'opacity 0.3s ease-in-out'
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = staticFile('default-club.png');
              }}
            />
            </FadeInOnFrame>
          </div>

          {/* Player Image */}
          <div className="absolute top-2 left-5 w-150 h-150 flex items-center justify-center overflow-hidden" style={{ position: 'relative' }}>
            {(() => {
              const playerImageStartFrame = (triggerFrame ?? 0) + 6;
              const playerImageDuration = 100;
              const localFrame = Math.max(0, frame - playerImageStartFrame);
              
              const opacity = interpolate(localFrame, [0, playerImageDuration], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              
              const translateY = interpolate(localFrame, [0, playerImageDuration], [400, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              
              const scale = interpolate(localFrame, [0, playerImageDuration], [0.5, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              
              return (
                <Img
                  src={getSrc(person.image)}
                  alt={person.name}
                  className="w-full h-full object-contain"
                  style={{
                    willChange: 'transform',
                    transform: `translateY(${translateY}px) scale(${scale})`,
                    backfaceVisibility: 'hidden',
                    opacity,
                    zIndex: 1
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = staticFile('default.svg');
                  }}
                />
              );
            })()}
          </div>
        </div>

        {/* Player info */}
        <div className="pt-3 px-6 pb-4">
          <div className="flex flex-col items-center text-center">
            <div className="flex-grow">
              <FadeInOnFrame triggerFrame={(triggerFrame ?? 0) + 2} duration={20}>
                <div
                  className="text-center text-dark flex items-center justify-center font-bold p-6"
                  style={{ margin: '0 auto', overflow: 'hidden', width: '100%', height: '6rem', position: 'relative' }}
                >
                  <ScrollText
                    text={person.name || ''}
                    triggerFrame={(triggerFrame ?? 0) + 39}
                    duration={300}
                    style={{ fontFamily: RubikFont, fontWeight: 800, fontSize: '3rem' }}
                  />
                </div>
                <div className="flex justify-center mt-2">
                  <span className="bg-gray-900 text-white px-6 py-3 font-bold rounded-full flex items-center gap-3 text-4xl" style={{ willChange: "transform, opacity", fontFamily: RubikFont }}>
                    {person.nation}
                    {getCountryCode(person.nation_code ?? "") ? (
                      <CircleFlag countryCode={getCountryCode(person.nation_code ?? "")!} height="60" width="60" />
                    ) : (
                      "🌍"
                    )}
                  </span>
                </div>
              </FadeInOnFrame>
            </div>
          </div>
        </div>

        {/* Full Name */}
        <FadeInOnFrame triggerFrame={(triggerFrame ?? 0) + 4} duration={20}>
          <div className="bg-gray-900 border-t text-4xl border-b border-gray-700 gap-8 rounded-md p-5 px-5 mx-5">
            <div className="flex">
              <p className="text-gray-200 font-bold text-center" style={{ fontFamily: robotoMonoFont }}>
                <TypingOnFrame
                  text={person.full_name || ""}
                  triggerFrame={(triggerFrame ?? 0) + 39}
                  duration={30}
                  style={{ fontFamily: robotoMonoFont }}
                />
              </p>
            </div>
          </div>
        </FadeInOnFrame>
        

        {/* Player details dengan grid layout yang lebih elegan */}
        <div className="grid grid-cols-1 p-5 w-full items-stretch">

        

          {/* Team */}
          <FadeInOnFrame triggerFrame={(triggerFrame ?? 0) + 8} duration={20}>
          <div className="col-span-2 flex items-center text-left gap-4 p-3 mb-5 bg-gray-900 rounded-md">
            <div>
              <p className="text-2xl text-gray-200 uppercase font-extrabold tracking-widest" style={{ fontFamily: RubikFont}}>Team</p>
                <p className="text-3xl text-gray-50 font-bold">{person.team || "N/A"}</p>
            </div>
          </div>
          </FadeInOnFrame>


          {/* Roles */}
          <FadeInOnFrame triggerFrame={(triggerFrame ?? 0) + 8} duration={20}>
          <div className="col-span-2 flex items-center text-left gap-4 p-3 mb-5 bg-gray-900 rounded-md">
           
            <div className="flex-grow">
              <p className="text-2xl text-gray-200 uppercase font-extrabold tracking-widest" style={{ fontFamily: RubikFont}}>Roles</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {(person.roles ?? []).map((role, index) => (
                  <span 
                    key={index}
                    className="bg-gray-200 text-gray-900 px-4 py-2 rounded-full text-3xl font-bold"
                    style={{ fontFamily: RubikFont }}
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
          </FadeInOnFrame>
          
          {/* Signatures Heroes */}
          <FadeInOnFrame triggerFrame={(triggerFrame ?? 0) + 10} duration={20}>
          <div className="col-span-2 flex items-center text-left gap-4 p-3 bg-gray-900 rounded-md">
            <div className="flex-grow">
              <p className="text-2xl text-gray-200 uppercase font-extrabold tracking-widest" style={{ fontFamily: RubikFont}}>Signature Heroes</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {person.heros?.map((hero, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 border-10 border-[#009688]">
                      <Img
                        src={getSrc(herosIcon(hero))}
                        alt={hero}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </FadeInOnFrame>
        
        </div>

        {/* Join Date Footer */}
        {(() => {
          const personWithOptionalJoin = person as rawData & { date_of_join?: string };
          const joinDate = personWithOptionalJoin.date_of_join ?? person.date ?? null;
          return joinDate ? (
            <FadeInOnFrame triggerFrame={(triggerFrame ?? 0) + 12} duration={20}>
              <div className="flex justify-center mt-2 mb-5">
                <code style={{ fontFamily: robotoMonoFont, fontWeight: 900, fontSize: '2.125rem' }}>
                  <TypingOnFrame
                    text={`Join: ${joinDate}`}
                    triggerFrame={(triggerFrame ?? 0) + 60}
                    duration={40}
                    style={{ fontFamily: robotoMonoFont }}
                  />
                </code>
              </div>
            </FadeInOnFrame>
          ) : null;
        })()}

      </div>
    </div>

    
  );
};

export default Carding;

