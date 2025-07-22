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
  staticFile,
} from "remotion";
import React, { useMemo, useEffect, useState } from "react";
import { loadFont as loadRubik } from "@remotion/google-fonts/Rubik";
import { rawData, validateRawDatas } from "./types/schema";
import { Carding } from "./components/Card";
import { CONFIG } from "./config";

// import rawTopPlayers from "../public/data/alter_ego.json";
// import rawTopPlayers from "../public/data/bigetron_esports.json";
// import rawTopPlayers from "../public/data/dewa_united_esports.json";
// import rawTopPlayers from "../public/data/geek_fam_id.json";
// import rawTopPlayers from "../public/data/onic.json";
// import rawTopPlayers from "../public/data/evos.json";
import rawTopPlayers from "../public/data/rrq_hoshi.json";
// import rawTopPlayers from "../public/data/test.json";

// import rawTopPlayers from "../public/data/mlbb_exp_laner.json";
// import rawTopPlayers from "../public/data/mlbb_gold_laner.json";
// import rawTopPlayers from "../public/data/mlbb_mid_laner.json";
// import rawTopPlayers from "../public/data/mlbb_jungle.json";
// import rawTopPlayers from "../public/data/mlbb_roam.json";
// import rawTopPlayers from "../public/data/mlbb_all_role.json";

import Intro from "./components/Intro";
import Ending from "./components/Ending";


const { fontFamily: rubikFont } = loadRubik();

/**
 * Fungsi untuk menghitung posisi statis kartu berdasarkan indeks dan lebar layar
 * @param index - Indeks kartu dalam array
 * @param screenWidth - Lebar layar video
 * @param cardsToShow - Jumlah kartu yang akan ditampilkan
 * @returns Posisi horizontal kartu dalam piksel
 */
const getStaticCardPosition = (index: number, screenWidth: number) => {
  const startPosition = screenWidth / 2 - 1300;
  return startPosition + index * 650;
};

type PlayerListProps = {
  cardsToShow: number;
  durasiPerCardDetik: number;
  introDelay: number;
  endingDuration: number;
};

/**
 * Komponen utama PlayerList yang menangani animasi daftar pemain
 * @param cardsToShow - Jumlah kartu yang akan ditampilkan
 * @param durasiPerCardDetik - Durasi tampilan per kartu dalam detik
 * @param introDelay - Delay sebelum intro dimulai
 * @param endingDuration - Durasi ending sequence
 */
export const PlayerList: React.FC<PlayerListProps> = ({ 
  cardsToShow = 10, 
  durasiPerCardDetik = 6, 
  introDelay = 120, 
  endingDuration = 300 
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height, } = useVideoConfig();
  // Delay render dengan timeout 60 detik untuk memastikan data ter-load
  const [handle] = useState(() => delayRender("timeout-60000"));
  const [validatedData, setValidatedData] = useState<rawData[]>([]);

  /**
   * Effect untuk memproses dan memvalidasi data pemain
   * Mengurutkan berdasarkan tanggal bergabung (terlama di atas)
   */
  useEffect(() => {
    const processData = async () => {
      try {
        const data = validateRawDatas(rawTopPlayers)
          .sort((a: rawData, b: rawData) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .reverse(); // Reverse untuk mendapatkan yang terlama di atas
        setValidatedData(data);
        continueRender(handle);
      } catch (error) {
        console.error("Data validation error:", error);
        continueRender(handle);
      }
    };
    processData();
  }, [handle]);

  // Perhitungan durasi dan timing untuk animasi
  const durationPerCard = durasiPerCardDetik * fps; // Durasi per kartu dalam frame
  const totalDuration = cardsToShow * durationPerCard;
  const initialDelay = CONFIG.initialDelay;
  const cardEntryDuration = CONFIG.cardEntryDuration;
  const staggerDelay = CONFIG.staggerDelay;
  const mainCardsAnimationDuration = initialDelay + 4 * cardEntryDuration;
  const scrollDuration = totalDuration - mainCardsAnimationDuration;
  const opacityTransitionDuration = CONFIG.opacityTransitionDuration;

  // Hitung frame mulai ending sequence
  // Ending mulai setelah Player List selesai
  const endingStartFrame = introDelay + totalDuration;

  // Memoize data untuk performa, hanya ambil jumlah kartu yang diperlukan
  const memoizedData = useMemo(() => validatedData.slice(0, cardsToShow), [validatedData, cardsToShow]);

  /**
   * Perhitungan posisi scroll horizontal untuk efek sliding kartu
   * Menggunakan interpolate untuk animasi yang smooth
   */
  const scrollX = useMemo(
    () =>
      interpolate(frame - mainCardsAnimationDuration, [0, scrollDuration], [0, -650 * (cardsToShow - 1)], {
        extrapolateRight: "clamp",
        extrapolateLeft: "clamp",
      }),
    [frame, mainCardsAnimationDuration, scrollDuration, cardsToShow]
  );

  // Sesuaikan tinggi kartu berdasarkan resolusi video
  const cardHeight = height * 0.5; // Setengah dari tinggi video

  /**
   * Perhitungan rotasi watermark untuk efek berputar
   * Watermark akan berputar 360 derajat selama durasi video
   */
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
      {/* Sequence Intro - Menampilkan komponen Intro */}
      <Sequence from={0} durationInFrames={introDelay}>
        <div style={{ position: "relative", width: "100%", height: "100%", backgroundColor: "black" }}>
          <div className="grid-mask" style={{ position: "absolute", inset: 0, zIndex: 0 }} />
          <div
            className="w-full flex justify-center"
            style={{
              // height: '100%',
              // backgroundColor: "#434343",
              // backgroundImage: "linear-gradient(#434343, #282828)",
            }}
          >

          <Intro person={memoizedData[0]} colorText="#FFF" />
        </div>
        </div>
      </Sequence>

      {/* Sequence Player List Animation - Animasi daftar pemain */}
      <Sequence from={introDelay} durationInFrames={totalDuration}>
        <div style={{ position: "relative", width: "100%", height: "100%", backgroundColor: "#212121" }}>
          <div className="grid-mask" style={{ position: "absolute", inset: 0, zIndex: 1 }} />
          <div
            className="w-full flex items-center justify-center"
            style={{
              // height: '100%',
              // backgroundColor: "#434343",
              // backgroundImage: "linear-gradient(#434343, #282828)",
            }}
          >
            {/* SVG Watermark - Logo berputar di background */}
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
                // Percepat putaran watermark: kalikan sudut rotasi dengan 2
                transform: `translateX(-50%) rotate(${watermarkRotation * 10}deg)`,
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
                  fill="yellow"
                />
              </svg>
            </div>

            {/* Watermark Overlay - Muncul setiap 30 detik selama 3 detik */}
            {(() => {
              const watermarkInterval = 30 * fps;
              const watermarkDuration = 3 * fps;
              const watermarkStart = introDelay + 16 * fps; // mulai di detik ke-16 setelah intro
              const watermarkFrame = frame - watermarkStart >= 0 ? (frame - watermarkStart) % watermarkInterval : -1;
              const showWatermark = (frame >= watermarkStart) && (watermarkFrame >= 0) && (watermarkFrame < watermarkDuration);
              if (!showWatermark) return null;
              return (
                <div
                  style={{
                    position: "absolute",
                    top: 90,
                    left: "50%",
                    transform: `translate(-50%, ${
                      interpolate(
                        watermarkFrame,
                        [0, 10, watermarkDuration - 10, watermarkDuration],
                        [-60, 0, 0, -60], // Animasi slide dari atas ke posisi normal, lalu keluar ke atas lagi
                        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                      )
                    }px)`,
                    zIndex: 10,
                    background: "rgba(71, 71, 71, 0.29)",
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: "3rem",
                    padding: "0.7em 2em",
                    borderRadius: "2em",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
                    fontFamily: rubikFont,
                    opacity: interpolate(
                      watermarkFrame,
                      [0, 10, watermarkDuration - 10, watermarkDuration],
                      [0, 1, 1, 0],
                      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                    ),
                    pointerEvents: "none",
                    transition: "opacity 0.2s, transform 0.2s"
                  }}
                >
                  yt@sinauvideo
                </div>
              );
            })()}

            {/* Watermark Text - Statis di kiri tengah, di belakang card */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: 20,
                transform: "translateY(-50%)",
                fontSize: "4rem",
                fontWeight: 900,
                color: "rgba(221, 221, 221, 0.23)",
                fontFamily: rubikFont,
                textShadow: "4px 4px 8px rgba(0,0,0,0.2)",
                zIndex: 1,
                pointerEvents: "none",
                userSelect: "none",
                whiteSpace: "nowrap",
              }}
            >
              yt@sinauvideo
            </div>

            {/* Container Kartu dengan Efek Scroll - Container utama untuk semua kartu */}
            <div
              className="flex gap-4"
              style={{
                transform: `translateX(${scrollX}px)`,
                position: "relative",
                zIndex: 2,
              }}
            >
              {memoizedData.map((person, index) => {
                const initialPosition = getStaticCardPosition(index, width);
                
                // Frame trigger untuk animasi bounce per card
                const getTriggerFrame = (cardIndex: number): number => {
                  if (cardIndex >= 11) {
                    return introDelay + 200 + 3 * 370 + 6 * 420 + (cardIndex - 11) * staggerDelay;
                  }
                  if (cardIndex >= 5) {
                    return introDelay + 200 + 3 * 370 + (cardIndex - 5) * 420;
                  }
                  if (cardIndex >= 2) {
                    return introDelay + 200 + (cardIndex - 2) * 370;
                  }
                  if (cardIndex === 1) return introDelay + 60;
                  return introDelay;
                };
                
                const triggerFrame = getTriggerFrame(index);
                
                // Bounce Effect: animasi masuk dengan spring sesuai triggerFrame
                const isFast = index < 2;
                const bounce = spring({
                  frame: Math.max(0, frame - triggerFrame),
                  fps,
                  config: {
                    damping: 18,
                    mass: 1.5,
                    stiffness: 80,
                  },
                });
                
                // Kartu muncul dari bawah (translateY), lalu mantul ke posisi
                const progress = Math.min(1, Math.max(0, (frame - triggerFrame) / 20));
                const translateY = interpolate(progress, [0, 1], [120, 0]);
                const opacity = interpolate(progress, [0, 1], [0, 1]);
                
                return (
                  <div
                    key={person.date}
                    className="absolute pt-10"
                    style={{
                      left: initialPosition,
                      transform: `translateY(${translateY}px)`,
                      opacity,
                      transition: "transform 0.5s, opacity 0.5s",
                      willChange: "transform, opacity",
                    }}
                  >
                    <Carding person={person} style={{ height: cardHeight }} index={index} triggerFrame={triggerFrame} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {/* Audio Background - Musik dengan fade in/out */}
        <Audio
          volume={(f) =>
            interpolate(
              f,
              [0, 30, totalDuration - 10 * fps, totalDuration],
              [0.3, 0.5, 0.5, 0.1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            )
          }
          src={staticFile("_audio/parzival_william_rosati.mp3")}
          // src={staticFile("_audio/pooka_kevin_macleod.mp3")}          
          startFrom={120}
        />
      </Sequence>

      {/* Sequence Ending - Muncul setelah Player List Animation selesai */}
      <Sequence from={endingStartFrame} durationInFrames={endingDuration}>
        <div style={{ position: "relative", width: "100%", height: "100%", backgroundColor: "black" }}>
            <div className="grid-mask" style={{ position: "absolute", inset: 0, zIndex: 1 }} />
            <div
              className="w-full flex justify-center"
              style={{
                // height: '100%',
                // backgroundColor: "#434343",
                // backgroundImage: "linear-gradient(#434343, #282828)",
              }}
            >
            <Ending textColor="white" />
            </div>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
