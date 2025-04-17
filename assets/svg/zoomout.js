import React from 'react';
import Svg, { G, Path } from 'react-native-svg';

const ZoomOut = () => (
  <Svg fill="#000000" width={35} height={35} viewBox="0 0 24 24">
    <G id="SVGRepo_bgCarrier" strokeWidth="0"></G>
    <G id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></G>
    <G id="SVGRepo_iconCarrier">
      <Path d="M6 9h8v2H6z"></Path>
      <Path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"></Path>
    </G>
  </Svg>
);

export default ZoomOut;
