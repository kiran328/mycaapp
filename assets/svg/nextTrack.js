import React from 'react';
import Svg, { Rect, Line, Path } from 'react-native-svg';

const NextTrack = () => (
  <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
    <Rect x="0" y="0" width="24" height="24" fill="none" />
    <Path
      d="M15.3371,12.4218 L5.76844,18.511 C5.43558,18.7228 5,18.4837 5,18.0892 L5,5.91084 C5,5.51629 5.43558,5.27718 5.76844,5.48901 L15.3371,11.5782 C15.6459,11.7746 15.6459,12.2254 15.3371,12.4218 Z"
      stroke="black"
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Line x1="19" y1="5" x2="19" y2="19" stroke="black" strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

export default NextTrack;