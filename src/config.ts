// Konfigurasi utama untuk video PlayerList
// Ubah nilai di sini untuk mengatur durasi dan jumlah kartu

export const CONFIG = {
  // Video Settings
  FPS: 60,
  
  
  // Resolusi video (belum digunakan, pilih sesuai kebutuhan)
  // SD:     640x480
  // HD:     1280x720
  // Full HD:1920x1080
  // 2K:     2048x1152
  // QHD:    2560x1440 (default)
  // 4K:     3840x2160

  // SD
  // WIDTH: 640,   
  // HEIGHT: 480,

  // SD
  // WIDTH: 1280,   
  // HEIGHT: 720,

  // 2K
  WIDTH: 2560,   
  HEIGHT: 1440,

  // Content Settings
  cardTitle: "MPL Indonesia",
  cardsToShow: 32,           // Jumlah kartu yang akan ditampilkan
  durasiPerCardDetik: 6,     // Durasi per kartu dalam detik
  showDebugInfo: true,       // Tampilkan info debug saat dev
  
  // Data Source Configuration - Pilih salah satu untuk mengubah data
  DATA_SOURCE: {
    // Gaming Data - Uncomment salah satu untuk menggunakan
    // gaming: "gaming/rrq_hoshi.json",      // Default RRQ Hoshi
    // gaming: "gaming/evos.json",           // EVOS data
    gaming: "gaming/onic.json",              // ONIC data
    // gaming: "gaming/alter_ego.json",      // Alter Ego data
    
    // YouTube Data - Uncomment salah satu untuk menggunakan
    // youtube: "youtube/global.json",       // Global YouTube
    // youtube: "youtube/india.json",        // India YouTube
    // youtube: "youtube/usa.json",          // USA YouTube
    // youtube: "youtube/indonesia.json",    // Indonesia YouTube
    // youtube: "youtube/bangladesh.json",   // Bangladesh YouTube
    // youtube: "youtube/brazil.json",       // Brazil YouTube
    // youtube: "youtube/egypt.json",        // Egypt YouTube
    // youtube: "youtube/japan.json",        // Japan YouTube
    // youtube: "youtube/nigeria.json",      // Nigeria YouTube
    // youtube: "youtube/mexico.json",       // Mexico YouTube
    // youtube: "youtube/pakistan.json",     // Pakistan YouTube
    // youtube: "youtube/philipins.json",    // Philippines YouTube
    // youtube: "youtube/russia.json",       // Russia YouTube
    // youtube: "youtube/vietnam.json",      // Vietnam YouTube
    
    // Instagram Data - Uncomment salah satu untuk menggunakan
    // instagram: "instagram/ig-global_updated.json",  // Global Instagram
    // instagram: "instagram/ig-bd_updated.json",      // Bangladesh Instagram
    // instagram: "instagram/ig-br_updated.json",      // Brazil Instagram
    // instagram: "instagram/ig-eg_updated.json",      // Egypt Instagram
    // instagram: "instagram/ig-in_updated.json",      // India Instagram
    // instagram: "instagram/ig-jp_updated.json",      // Japan Instagram
    // instagram: "instagram/ig-id_updated.json",      // Indonesia Instagram
    // instagram: "instagram/ig-mx_updated.json",      // Mexico Instagram
    // instagram: "instagram/ig-ng_updated.json",      // Nigeria Instagram
    // instagram: "instagram/ig-ph_updated.json",      // Philippines Instagram
    // instagram: "instagram/ig-pk_updated.json",      // Pakistan Instagram
    // instagram: "instagram/ig-ru_updated.json",      // Russia Instagram
    // instagram: "instagram/ig-usa_updated.json",     // USA Instagram
  } as { gaming?: string; youtube?: string; instagram?: string },

  // Timing Settings
  introDelay: 120,           // Delay intro dalam frame (2 detik)
  endingDuration: 5,         // Durasi ending dalam detik

  // Animation Settings
  initialDelay: 30,          // Delay awal animasi kartu
  cardEntryDuration: 42,     // Durasi entry per kartu
  staggerDelay: 200,         // Delay antar kartu
  opacityTransitionDuration: 40, // Durasi transisi opacity
  
  // Theme Settings
  theme: {
    // mode: 'dark' | 'light'
    mode: 'dark' as 'dark' | 'light',
    background: {
      dark: '#212121',
      light: '#FFFFFF',
    },
  },
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

// Theme helpers
export const getBackgroundColor = (): string => {
  return CONFIG.theme.mode === 'dark'
    ? CONFIG.theme.background.dark
    : CONFIG.theme.background.light;
};

// Data Source Helper - Mengambil data source yang aktif
export const getActiveDataSource = (): string => {
  // Cari data source yang tidak di-comment
  const sources = CONFIG.DATA_SOURCE;
  
  // Prioritas: gaming > youtube > instagram
  if (sources.gaming) return sources.gaming;
  if (sources.youtube) return sources.youtube;
  if (sources.instagram) return sources.instagram;
  
  // Fallback ke RRQ Hoshi jika tidak ada yang aktif
  return "gaming/rrq_hoshi.json";
};