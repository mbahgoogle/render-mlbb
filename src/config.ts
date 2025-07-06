// Konfigurasi utama untuk video PlayerList
// Ubah nilai di sini untuk mengatur durasi dan jumlah kartu

export const CONFIG = {
  // Video Settings
  FPS: 60,
  WIDTH: 2560,
  HEIGHT: 1440,

  // Content Settings
  cardsToShow: 43,           // Jumlah kartu yang akan ditampilkan
  durasiPerCardDetik: 6,     // Durasi per kartu dalam detik

  // Timing Settings
  introDelay: 120,           // Delay intro dalam frame (2 detik)
  endingDuration: 5,         // Durasi ending dalam detik

  // Animation Settings
  initialDelay: 30,          // Delay awal animasi kartu
  cardEntryDuration: 42,     // Durasi entry per kartu
  staggerDelay: 100,         // Delay antar kartu
  opacityTransitionDuration: 40, // Durasi transisi opacity
};

// Helper functions
export const getTotalDuration = () => {
  return CONFIG.FPS * CONFIG.durasiPerCardDetik * CONFIG.cardsToShow;
};

export const getTotalVideoDuration = () => {
  const totalDuration = getTotalDuration();
  const endingDurationFrames = CONFIG.endingDuration * CONFIG.FPS;
  return CONFIG.introDelay + totalDuration + endingDurationFrames;
};

export const getDurationInSeconds = (frames: number) => {
  return frames / CONFIG.FPS;
}; 