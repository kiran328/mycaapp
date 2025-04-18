import React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';

const Good = ({ width, height }) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Transparent background */}
    <Rect width={48} height={48} fill="white" fillOpacity="0.01" />
    <Rect width={48} height={48} fill="white" fillOpacity="0.01" />

    {/* Main paths */}
    <Path
      d="M27.6 18.6V11.4C27.6 8.41766 25.1823 6 22.2 6L15 22.2V42H35.916C37.7111 42.0203 39.2468 40.7149 39.516 38.94L42 22.74C42.1585 21.6957 41.8504 20.6346 41.1573 19.8375C40.4643 19.0405 39.4561 18.588 38.4 18.6H27.6Z"
      stroke="#000000"
      strokeWidth={4}
      strokeLinejoin="round"
    />
    <Path
      d="M15 22.0002H10.194C8.08532 21.9629 6.2827 23.7096 6 25.7996V38.3996C6.2827 40.4896 8.08532 42.0369 10.194 41.9996H15V22.0002Z"
      fill="#2F88FF"
      stroke="#000000"
      strokeWidth={4}
      strokeLinejoin="round"
    />
  </Svg>
);

export default Good;
