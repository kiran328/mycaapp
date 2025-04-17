import React from 'react';
import Svg, { Path, Polyline } from 'react-native-svg';

const ShuffleIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3,8H5.28a6,6,0,0,1,4.51,2.05L13.21,14A6,6,0,0,0,17.72,16H21"
      stroke="#000000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    />
    <Polyline
      points="19 14 21 16 19 18"
      stroke="#000000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    />
    <Path
      d="M21,8H17.72a6,6,0,0,0-4.51,2.05L9.79,14A6,6,0,0,1,5.28,16H3"
      stroke="#000000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    />
    <Polyline
      points="19 6 21 8 19 10"
      stroke="#000000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    />
  </Svg>
);

export default ShuffleIcon;
