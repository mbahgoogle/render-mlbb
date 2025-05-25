import React from "react";
import { TopPlayer } from "../types/schema";
import { CircleFlag } from "react-circle-flags";
import {
  FaFutbol as Football,
  FaBirthdayCake as Birthday,
  FaCalendar as Calendar,
} from "react-icons/fa";

import { BsPSquareFill as Position
} from "react-icons/bs";
import { MdStadium as Stadium
 } from "react-icons/md";

import { getLogoCode } from "../utils/getLogoClub";
import { getCountryCode } from "../utils/getCountryCode";
import { getHeros } from "../utils/getHeros";
import { loadFont as loadRoboto } from "@remotion/google-fonts/Roboto";
import { loadFont as loadRobotoMono } from "@remotion/google-fonts/RobotoMono";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadRubik } from "@remotion/google-fonts/Rubik";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import { useVideoConfig, staticFile } from "remotion";

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

// Load fonts
const { fontFamily: robotoFont } = loadRoboto();
const { fontFamily: robotoMonoFont } = loadRobotoMono();
const { fontFamily: interFont } = loadInter();
const { fontFamily: RubikFont } = loadRubik();
const { fontFamily: PoppinsFont } = loadPoppins();


export const PlayerCard: React.FC<{
  person: TopPlayer & { club_logo?: string };
  style?: React.CSSProperties;
} > = ({ person, style }) => {
  console.log("Player data:", person);
  console.log("Heroes:", person.heros);
  const HeightConfig = useVideoConfig().height * 0.94;
  return (
    <div
      className="flex justify-center items-center p-0"
      style={{
        ...style,
        height: "100%",
        fontFamily: `${robotoFont}, Arial, sans-serif`,
      }}
    >
      {/* Card dengan desain modern dan profesional */}
      <div className="w-[600px] rounded-xl shadow-5xl backdrop-blur-md bg-white/60 border border-white/20" style={{height: HeightConfig}}>
        {/* Header dengan gradien biru */}
        <div className="relative h-140 rounded-t-xl overflow-hidden backdrop-blur-sm bg-gradient-to-b from-white/10 to-transparent">
          {/* Club Logo */}
          <div className="absolute top-6 right-6 w-100 h-100 opacity-80">
            <img
              src={getLogoCode(person.team)}
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
          </div>

          {/* Player Image */}
          <div className="absolute top-10 left-25 w-100 h-150 flex items-center justify-center overflow-hidden">
            <img
              src={getImageSource(person.image)}
              alt={person.name}
              className="w-full h-full object-cover"
              style={{
                willChange: 'transform',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
                opacity: 1,
                transition: 'opacity 0.3s ease-in-out'
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = staticFile('default-player.png');
              }}
            />
          </div>
        </div>

        {/* Player info dengan spacing yang lebih baik */}
        <div className="pt-8 px-6 pb-4">
          <div className="flex flex-col items-center text-center">
            {/* Player name dan info */}
            <div className="flex-grow">
                <div className="flex justify-center mt-4">
                <span className="bg-gray-900 text-white px-6 py-3 font-bold rounded-full flex items-center gap-3 text-4xl" style={{ willChange: "transform, opacity", fontFamily: RubikFont }}>
                  {person.name}
                  {getCountryCode(person.nation_code) ? (
                  <CircleFlag
                    countryCode={getCountryCode(person.nation_code)}
                    height="50"
                    width="50"
                  />
                   ) : (
                  "🌍"
                  )}
                </span>
                </div>
            </div>
          </div>
        </div>

       

        {/* Assists and goals counter dengan desain clean */}
        <div className="bg-gray-900 border-t text-4xl border-b border-gray-700 gap-8 rounded-md p-5 px-5 mx-5">
          <div className="flex items-center justify-center">
            <p className="text-gray-200 font-bold text-center" style={{ fontFamily: robotoMonoFont }}>
              {person.full_name}
            </p>
          </div>
        </div>

        {/* Player details dengan grid layout yang lebih elegan */}
        <div className="grid grid-cols-2 gap-8 p-5">

          
          {/* year */}
          <div className="flex items-center text-left gap-4 p-3 bg-gray-900 rounded-md">
            <Calendar className="h-9 w-9 text-gray-200" />
            <div>
                <p className="text-1xl text-gray-200 uppercase font-extrabold tracking-widest" style={{ fontFamily: PoppinsFont}}>Join</p>
                {person.date_of_join && (
                <p className="text-[26px] font-extrabold text-gray-200" style={{ fontFamily: interFont}}> {person.date_of_join}</p>
                )}
            </div>
          </div>

          {/* Birth Date */}
          <div className="flex items-center text-left gap-4 p-3 bg-gray-900 rounded-md">
            <Birthday className="h-9 w-9 text-gray-200" />
            <div>
              <p className="text-1xl text-gray-200 uppercase font-extrabold tracking-widest" style={{ fontFamily: PoppinsFont}}>Birthday</p>
              <p className="text-[26px] font-extrabold text-gray-200" style={{ fontFamily: interFont}}>{person.date_of_birth || "N/A"}</p>
            </div>
          </div>

          {/* Team - Full width */}
          <div className="col-span-2 flex items-center text-left gap-4 p-3 bg-gray-900 rounded-md">
            <div>
              <p className="text-2xl text-gray-200 uppercase font-extrabold tracking-widest" style={{ fontFamily: RubikFont}}>Team</p>
                <p className="text-3xl text-gray-50 font-bold">{person.team || "N/A"}</p>
            </div>
          </div>


          {/* Roles - Full width */}
          <div className="col-span-2 flex items-center text-left gap-4 p-3 bg-gray-900 rounded-md">
           
            <div className="flex-grow">
              <p className="text-2xl text-gray-200 uppercase font-extrabold tracking-widest" style={{ fontFamily: RubikFont}}>Roles</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {person.roles.map((role, index) => (
                  <span 
                    key={index}
                    className="bg-gray-200 text-gray-900 px-4 py-2 rounded-full text-2xl font-bold"
                    style={{ fontFamily: RubikFont }}
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="col-span-2 flex items-center text-left gap-4 p-3 bg-gray-900 rounded-md">
            <div className="flex-grow">
              <p className="text-2xl text-gray-200 uppercase font-extrabold tracking-widest" style={{ fontFamily: RubikFont}}>Signature Heroes</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {person.heros.map((hero, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 border-10 border-[#243c5a]">
                      <img
                        src={getImageSource(getHeros(hero))}
                        alt={hero}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
        
      </div>
    </div>
  );
};
