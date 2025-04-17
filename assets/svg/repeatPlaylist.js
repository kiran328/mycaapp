import React from 'react';
import Svg, { Path } from 'react-native-svg';

const RepeatPlaylist = () => (
    <Svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24">
        <Path
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M11 17L13 15M11 17L13 19M11 17H18C19.1046 17 20 16.1046 20 15V7C20 5.89543 19.1046 5 18 5H6C4.89543 5 4 5.89543 4 7V15C4 16.1046 4.89543 17 6 17H8M13 11C13 11.5523 12.5523 12 12 12C11.4477 12 11 11.5523 11 11C11 10.4477 11.4477 10 12 10C12.5523 10 13 10.4477 13 11Z"
        />
    </Svg>
);

export default RepeatPlaylist;
