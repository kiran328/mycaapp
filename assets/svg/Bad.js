import React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';

const CustomIcon = ({ width, height }) => (
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
            d="M20.3795 29.4V36.6C20.3795 39.5823 22.7972 42 25.7795 42L32.9795 25.8V6H12.0635C10.2684 5.97971 8.73268 7.28507 8.46351 9.06L5.97951 25.26C5.82101 26.3043 6.1291 27.3654 6.82217 28.1625C7.51524 28.9595 8.52336 29.412 9.57951 29.4H20.3795Z"
            stroke="#000000"
            strokeWidth={4}
            strokeLinejoin="round"
        />
        <Path
            d="M32.9795 6H37.7855C39.8942 5.96271 41.6968 7.51003 41.9795 9.6V22.2C41.6968 24.29 39.8942 26.0373 37.7855 26H32.9795V6Z"
            fill="#2F88FF"
            stroke="#000000"
            strokeWidth={4}
            strokeLinejoin="round"
        />
    </Svg>
);

export default CustomIcon;
