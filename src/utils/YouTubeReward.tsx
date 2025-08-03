import React from 'react';

interface YouTubeRewardProps {
  subscribers: number;
}

const YouTubeReward: React.FC<YouTubeRewardProps> = ({ subscribers }) => {
  let logo = '';

  if (subscribers >= 100_000_000) {
    logo =
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/YouTube_Red_Diamond_Play_Button.svg/512px-YouTube_Red_Diamond_Play_Button.svg.png';
  } else if (subscribers >= 10_000_000) {
    logo =
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/YouTube_Diamond_Play_Button.svg/512px-YouTube_Diamond_Play_Button.svg.png';
  } else if (subscribers >= 1_000_000) {
    logo =
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/YouTube_Gold_Play_Button.svg/512px-YouTube_Gold_Play_Button.svg.png';
  } else if (subscribers >= 100_000) {
    logo =
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/YouTube_Silver_Play_Button.svg/512px-YouTube_Silver_Play_Button.svg.png';
  } else {
    logo = 'https://via.placeholder.com/100?text=None';
  }

  return (
    <div className="flex items-center justify-end gap-4 p-2 rounded-md">
      <img
        src={logo}
        alt="Reward Logo"
        style={{
          width: 'auto',
          height: '70px',
        }}
      />
    </div>
  );
};

export default YouTubeReward;
