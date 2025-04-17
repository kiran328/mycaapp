import React from 'react';
import Svg, { G, Path } from 'react-native-svg';

const ZoomIn = () => (
  <Svg fill="#000000" width={35} height={35} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <G id="SVGRepo_bgCarrier" stroke-width="0"></G>
    <G id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></G>
    <G id="SVGRepo_iconCarrier">
      <Path d="M11 6H9v3H6v2h3v3h2v-3h3V9h-3z"></Path>
      <Path d="M10 2c-4.411 0-8 3.589-8 8s3.589 8 8 8a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8zm0 14c-3.309 0-6-2.691-6-6s2.691-6 6-6 6 2.691 6 6-2.691 6-6 6z"></Path>
    </G>
  </Svg>
);

export default ZoomIn;
