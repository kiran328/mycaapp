import React from 'react';
import Svg, { Path } from 'react-native-svg';

const AddNote = ({height, width}) => (
    <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={height} height={width}>
        <Path
            d="M12,1A11,11,0,1,0,23,12,11.013,11.013,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9.01,9.01,0,0,1,12,21Z"
            fill="#F39FEE"
        />
        <Path
            d="M16,11H13V8a1,1,0,0,0-2,0v3H8a1,1,0,0,0,0,2h3v3a1,1,0,0,0,2,0V13h3a1,1,0,0,0,0-2Z"
            fill="#F39FEE"
        />
    </Svg>
);

export default AddNote;
