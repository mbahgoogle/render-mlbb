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
import { Carding } from "./components/CardPlayerMLBB";
import { CONFIG, getBackgroundColor, getActiveDataSource } from "./config";
import { getTriggerFrame } from "./utils/triggerFrame";

// import rawTopPlayers from "../public/data/alter_ego.json";
// import rawTopPlayers from "../public/data/bigetron_esports.json";
// import rawTopPlayers from "../public/data/dewa_united_esports.json";
// import rawTopPlayers from "../public/data/geek_fam_id.json";
// import rawTopPlayers from "../public/data/onic.json";
// import rawTopPlayers from "../public/data/evos.json";
// We'll load data at runtime from the public folder
// import rawTopPlayers from "../public/data/test.json";

// import rawTopPlayers from "../public/data/mlbb_exp_laner.json";
// import rawTopPlayers from "../public/data/mlbb_gold_laner.json";
// import rawTopPlayers from "../public/data/mlbb_mid_laner.json";
// import rawTopPlayers from "../public/data/mlbb_jungle.json";
// import rawTopPlayers from "../public/data/mlbb_roam.json";
// import rawTopPlayers from "../public/data/mlbb_all_role.json";

// import rawTopData from "../public/gaming/mpl_id.json";
// import rawTopData from "../public/gaming/mpl_ph.json";
// import rawTopData from "../public/gaming/mpl_my.json";

// import rawTopData from "../public/youtube/youtube-example.json";
// import rawTopData from "../public/youtube/global.json";
// import rawTopData from "../public/youtube/india.json";
// import rawTopData from "../public/youtube/usa.json";
// import rawTopData from "../public/youtube/indonesia.json";

// import rawTopData from "../public/youtube/bangladesh.json";
// import rawTopData from "../public/youtube/brazil.json";
// import rawTopData from "../public/youtube/egypt.json";
// import rawTopData from "../public/youtube/japan.json";
// import rawTopData from "../public/youtube/nigeria.json";
// import rawTopData from "../public/youtube/mexico.json";
// import rawTopData from "../public/youtube/pakistan.json";
// import rawTopData from "../public/youtube/philipins.json";
// import rawTopData from "../public/youtube/russia.json";
// import rawTopData from "../public/youtube/vietnam.json";

// import rawTopData from "../public/twitch/twitch-100.json";

// import rawTopData from "../public/tiktok/tiktok-tester.json";


// import rawTopData from "../public/instagram/ig-global_updated.json";
// import rawTopData from "../public/instagram/ig-bd_updated.json";
// import rawTopData from "../public/instagram/ig-br_updated.json"; // ready
// import rawTopData from "../public/instagram/ig-eg_updated.json";
// import rawTopData from "../public/instagram/ig-in_updated.json";
// import rawTopData from "../public/instagram/ig-jp_updated.json";
// import rawTopData from "../public/instagram/ig-id_updated.json";
// import rawTopData from "../public/instagram/ig-mx_updated.json";
// import rawTopData from "../public/instagram/ig-ng_updated.json";
// import rawTopData from "../public/instagram/ig-ph_updated.json";
// import rawTopData from "../public/instagram/ig-pk_updated.json";
// import rawTopData from "../public/instagram/ig-ru_updated.json";
// import rawTopData from "../public/instagram/ig-usa_updated.json";
// import rawTopData from "../public/instagram/instagram-tester.json";

import Intro from "./plugin/Intro";
import Ending from "./plugin/Ending";
import { EffectWatermarkOverlay } from "./utils/effectWatermarkOverlay";
import { EffectWatermarkText } from "./utils/effectWatermarkText";
import { EffectWatermarkSVG } from "./utils/effectWatermarkSVG";


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
  backgroundColor?: string;
};

/**
 * Komponen utama CardList yang menangani animasi daftar pemain
 * @param cardsToShow - Jumlah kartu yang akan ditampilkan
 * @param durasiPerCardDetik - Durasi tampilan per kartu dalam detik
 * @param introDelay - Delay sebelum intro dimulai
 * @param endingDuration - Durasi ending sequence
 */
export const CardList: React.FC<PlayerListProps> = ({ 
  cardsToShow = CONFIG.cardsToShow, 
  durasiPerCardDetik = CONFIG.durasiPerCardDetik, 
  introDelay = CONFIG.introDelay, 
  endingDuration = CONFIG.endingDuration * CONFIG.FPS, // Convert seconds to frames
  backgroundColor = getBackgroundColor(),
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height, } = useVideoConfig();
  // Delay render dengan timeout 60 detik untuk memastikan data ter-load
  const [handle] = useState(() => delayRender("timeout-60000"));
  const [validatedData, setValidatedData] = useState<rawData[]>([]);

  /**
   * Effect untuk memproses dan memvalidasi data pemain
   * Mengurutkan berdasarkan: followers_count (terbanyak di akhir), date (terlama di atas), name (opsi lain jika keduanya sama)
   */
  useEffect(() => {
    const processData = async () => {
      try {
        // Load JSON from public using configurable data source
        const dataSourcePath = getActiveDataSource();
        const jsonPath = staticFile(dataSourcePath);
        console.log(`Loading data from: ${dataSourcePath}`);
        const response = await fetch(jsonPath);
        const json = await response.json();
        const data = validateRawDatas(json)
        .sort((a: rawData, b: rawData) => {
          // 1) Utamakan followers_count (semakin besar semakin di akhir agar "terbanyak di akhir" seperti semula)
          const aFollowers = typeof a.followers_count === 'number' ? a.followers_count : null;
          const bFollowers = typeof b.followers_count === 'number' ? b.followers_count : null;
          if (aFollowers !== null && bFollowers !== null && aFollowers !== bFollowers) {
            return aFollowers - bFollowers; // ascending → terbanyak di akhir
          }

          // 2) Jika followers_count tidak membedakan (sama atau salah satu/both tidak ada), pakai date ascending (terlama di atas)
          const aHasDate = Boolean(a.date);
          const bHasDate = Boolean(b.date);
          if (aHasDate && bHasDate) {
            const aTime = new Date(a.date as string).getTime();
            const bTime = new Date(b.date as string).getTime();
            if (aTime !== bTime) return bTime - aTime;
          } else if (aHasDate !== bHasDate) {
            // Yang punya date didahulukan
            return aHasDate ? -1 : 1;
          }

          // 3) Fallback: urutkan berdasarkan name
          const aName = a.name || '';
          const bName = b.name || '';
          return aName.localeCompare(bName);
        });
        setValidatedData(data);
        if (CONFIG.showDebugInfo) {
          console.log("Active data source:", dataSourcePath);
          console.log("Items loaded:", data.length);
        }
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
  const mainCardsAnimationDuration = initialDelay + 4 * cardEntryDuration;
  const scrollDuration = totalDuration - mainCardsAnimationDuration;

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

 

  return (
    <AbsoluteFill>
      {/* Sequence Intro - Menampilkan komponen Intro */}
      <Sequence  durationInFrames={introDelay}>
        <div style={{ position: "relative", width: "100%", height: "100%", backgroundColor, overflow: "hidden" }}>
          <div className="grid-mask" style={{ position: "absolute", inset: 0, zIndex: 0 }} />
          <div
            className="w-full flex justify-center"
            style={{
              // height: '100%',
              // backgroundColor: "#434343",
              // backgroundImage: "linear-gradient(#434343, #282828)",
            }}
          >

          {memoizedData[0] && (
            <Intro person={memoizedData[0]} colorText="#FFF" />
          )}
        </div>
        </div>
      </Sequence>

      {/* Sequence Player List Animation - Animasi daftar pemain */}
      <Sequence from={introDelay} durationInFrames={totalDuration}>
        {/* <div style={{ position: "relative", width: "100%", height: "100%", backgroundColor: "#212121" }}>
          <div className="grid-mask" style={{ position: "absolute", inset: 0, zIndex: 1 }} /> */}
        <div style={{ position: "relative", width: "100%", height: "100%", backgroundColor, overflow: "hidden" }}>
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
            <EffectWatermarkSVG />

            {/* Watermark Text - Teks watermark statis */}
            <EffectWatermarkText rubikFont={rubikFont} usedCount={memoizedData.length} />

            {/* Watermark Overlay - Muncul setiap 30 detik selama 3 detik */}
            <EffectWatermarkOverlay frame={frame} fps={fps} introDelay={introDelay} rubikFont={rubikFont} usedCount={memoizedData.length} />

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

                // Animasi bounce dan trigger frame
                const triggerFrame = getTriggerFrame(index);
                const bounce = spring({
                  frame: Math.max(0, frame - triggerFrame),
                  fps,
                  config: {
                    damping: index < 2 ? 13 : 15,
                    mass: index < 2 ? 1.1 : 1.4,
                    stiffness: index < 2 ? 110 : 90,
                  },
                });

                const translateY = interpolate(bounce, [0, 1], [120, 0]);
                const opacity = interpolate(bounce, [0, 0.1, 1], [0, 0.7, 1]);

                return (
                  <div
                    key={`${person.date ?? 'nodate'}-${person.name ?? 'noname'}-${index}`}
                    className="absolute pt-10"
                    style={{
                      left: initialPosition,
                      transform: `translateY(${translateY}px)`,
                      opacity,
                      willChange: "transform, opacity",
                    }}
                  >
                    <Carding
                      person={person}
                      style={{ height: cardHeight }}
                      triggerFrame={triggerFrame}
                    />
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
              [0, 40, 80, 120, 160, 200, 240, totalDuration - 15 * fps, totalDuration - 5 * fps, totalDuration],
              [0, 0.03, 0.08, 0.15, 0.25, 0.4, 0.6, 0.6, 0.3, 0],
              { 
                extrapolateLeft: "clamp", 
                extrapolateRight: "clamp",
                easing: (t) => {
                  // Easing yang lebih gentle untuk fade in
                  if (t < 0.5) {
                    // Fade in: menggunakan cubic ease-in yang lebih halus
                    return t * t * t;
                  } else {
                    // Fade out: tetap smooth
                    return 1 - Math.pow(-2 * t + 2, 2) / 2;
                  }
                }
              }
            )
          }
          src={staticFile("_audio/10menit.m4a")}
          // src={staticFile("_audio/parzival_william_rosati.mp3")}
          // src={staticFile("_audio/pooka_kevin_macleod.mp3")}          
          startFrom={120}
        />
      </Sequence>

      {/* Sequence Ending - Muncul setelah Player List Animation selesai */}
      <Sequence from={endingStartFrame} durationInFrames={endingDuration}>
        <div style={{ position: "relative", width: "100%", height: "100%", backgroundColor, overflow: "hidden" }}>
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