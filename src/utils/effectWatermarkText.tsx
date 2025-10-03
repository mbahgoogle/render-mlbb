import React from "react";
import { CONFIG } from "../config";

type EffectWatermarkTextProps = { rubikFont: string; usedCount?: number };
export const EffectWatermarkText: React.FC<EffectWatermarkTextProps> = ({ rubikFont, usedCount }) => (
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
      color: "rgba(251, 255, 194, 1)",
      pointerEvents: "none",
      zIndex: 0,
      fontFamily: rubikFont,
      textShadow: "4px 4px 8px rgba(255, 255, 255, 0.22)",
      whiteSpace: "nowrap",
      userSelect: "none",
      left: 0,
      top: -50,
      paddingLeft: "1rem",
      transform: "none",
      opacity: 0.18,
    }}
    >
    {`yt@sinauvideo / ${usedCount ?? CONFIG.cardsToShow}`}
  </div>
);