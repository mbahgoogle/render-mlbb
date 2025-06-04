import { Composition } from "remotion";
import { PlayerList } from "./PlayerList";
import './index.css'; 

// Konfigurasi durasi
const FPS = 60;
const TOTAL_DURATION = FPS * 297; // 200 detik sesuai dengan PlayerList.tsx

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PlayerListCard"
        component={PlayerList}
        durationInFrames={TOTAL_DURATION}
        fps={FPS}
        width={2560}
        height={1440}
      />
    </>
  );
};