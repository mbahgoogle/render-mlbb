export const getStaticCardPosition = (index: number, screenWidth: number) => {
    const startPosition = screenWidth / 2 - 1300;
    return startPosition + index * 650;
  };
  
  export const getTriggerFrame = (
    cardIndex: number,
    introDelay: number
  ): number => {
    if (cardIndex === 0) return introDelay;
    if (cardIndex === 1) return introDelay + 60;
    if (cardIndex >= 2 && cardIndex <= 4) {
      return introDelay + 200 + (cardIndex - 2) * 370;
    }
    if (cardIndex >= 5 && cardIndex <= 10) {
      return introDelay + 200 + 3 * 370 + (cardIndex - 5) * 420;
    }
    if (cardIndex >= 11) {
      return introDelay + 200 + 3 * 370 + 6 * 420 + (cardIndex - 11) * 440;
    }
    return introDelay;
  };