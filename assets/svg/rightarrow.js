import React from 'react';
import Svg, { Path } from 'react-native-svg';

const RightArrow = () => (
  <Svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={24} height={24}>
    <Path
      d="M10 7L15 12L10 17"
      stroke="#808080"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default RightArrow;
