import { spring } from "remotion";

/**
 * Fungsi untuk mendapatkan frame trigger animasi masuk per card.
 * Tidak digunakan langsung di PlayerList, hanya sebagai helper.
 */
export const getTriggerFrame = (
  cardIndex: number,
  introDelay: number
): number => {
  if (cardIndex === 0) return introDelay;
  if (cardIndex === 1) return introDelay + 60;
  // Card 2–4: gap 350
  if (cardIndex >= 2 && cardIndex < 5) {
    return introDelay + 200 + (cardIndex - 2) * 370;
  }
  // Card 5–10: gap 420
  if (cardIndex >= 5 && cardIndex < 11) {
    return introDelay + 200 + 3 * 370 + (cardIndex - 5) * 420;
  }
  // Card 11 dst: gap 440
  if (cardIndex >= 11) {
    return introDelay + 200 + 3 * 370 + 6 * 420 + (cardIndex - 11) * 440;
  }
  return introDelay;
};

/**
 * Fungsi animasi bounce spring untuk kartu.
 * Tidak digunakan langsung di PlayerList, hanya sebagai helper.
 */
export const bounceSpring = (
  frame: number,
  triggerFrame: number,
  fps: number,
  isFast: boolean
) => {
  return spring({
    frame: Math.max(0, frame - triggerFrame),
    fps,
    config: {
      damping: isFast ? 13 : 15,