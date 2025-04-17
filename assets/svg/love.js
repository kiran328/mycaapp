import React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const Love = ({ width, height }) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        fillRule="evenodd"
        strokeLinejoin="round"
        strokeMiterlimit={2}
        clipRule="evenodd"
        viewBox="0 0 32 32"
        width={width}
        height={height}
    >
        <Path
            fill="url(#_Linear1)"
            d="M15.982,7.746l1.023,-1.024c3.13,-3.13 8.204,-3.129 11.334,0c0,0 0,0.001 0.001,0.001c1.503,1.503 2.347,3.541 2.347,5.667c-0,2.125 -0.844,4.164 -2.347,5.666c-4.895,4.895 -11.651,11.651 -11.651,11.651c-0.39,0.391 -1.024,0.391 -1.414,0c-0,0 -6.779,-6.779 -11.684,-11.684c-1.503,-1.503 -2.348,-3.541 -2.348,-5.667c0,-2.125 0.845,-4.164 2.348,-5.667c-0,0 0,-0 0,-0c1.503,-1.503 3.542,-2.348 5.667,-2.348c2.126,0 4.164,0.845 5.667,2.348l1.057,1.057Z"
        />
        <Defs>
            <LinearGradient
                id="_Linear1"
                x2="1"
                gradientTransform="rotate(90 6.376 5.07) scale(63.5061)"
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset="0" stopColor="#ef4438" />
                <Stop offset="1" stopColor="#f8a189" />
            </LinearGradient>
        </Defs>
    </Svg>
);

export default Love;
