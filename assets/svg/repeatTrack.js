import React from 'react';
import Svg, { Path } from 'react-native-svg';

const RepeatTrack = () => (
    <Svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24">
        <Path
            stroke="black"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M11 18L13 16M11 18L13 20M11 18H18C19.1046 18 20 17.1046 20 16V8C20 6.89543 19.1046 6 18 6H16M8 18H6C4.89543 18 4 17.1046 4 16V8C4 6.89543 4.89543 6 6 6H8M10.5 4L12 3V8"
        />
    </Svg>
);

export default RepeatTrack;
