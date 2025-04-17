import React from 'react';
import Svg, { G, Circle, Path } from 'react-native-svg';

const User = ({height, width}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#000000"
    strokeWidth={0.12}
  >
    {/* Background and tracing groups */}
    <G id="SVGRepo_bgCarrier" strokeWidth={0} />
    <G
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="blue"
      strokeWidth={0.192}
    >
      <Circle cx={12} cy={8} r={4} fill="#ff80d7" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 13C8.33033 13 5.32016 15.4204 5.02395 18.5004C4.99752 18.7753 5.22389 19 5.50003 19H18.5C18.7762 19 19.0025 18.7753 18.9761 18.5004C18.6799 15.4204 15.6697 13 12 13Z"
        fill="white"
        fillOpacity={0.24}
      />
    </G>

    {/* Icon carrier */}
    <G id="SVGRepo_iconCarrier">
      <Circle cx={12} cy={8} r={4} fill="#ff80d7" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 13C8.33033 13 5.32016 15.4204 5.02395 18.5004C4.99752 18.7753 5.22389 19 5.50003 19H18.5C18.7762 19 19.0025 18.7753 18.9761 18.5004C18.6799 15.4204 15.6697 13 12 13Z"
        fill="blue"
        fillOpacity={0.24}
      />
    </G>
  </Svg>
);

export default User;
