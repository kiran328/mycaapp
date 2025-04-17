import React from 'react';
import Svg, { Path } from 'react-native-svg';

const Menu = () => (
  <Svg viewBox="0 0 24 24" fill="none" width={24} height={24}>
    <Path
      d="M4 17H8M12 17H20M4 12H20M4 7H12M16 7H20"
      stroke="#000000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default Menu;
