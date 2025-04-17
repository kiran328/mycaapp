import { Svg, Path } from "react-native-svg"

const CloseReel = () => {
    return (
        <Svg width="25" height="25" viewBox="0 0 24 24" fill="none">
            <Path
                d="M5 5L19 19"
                stroke="#4F3422"
                strokeWidth={2}
                strokeLinejoin="round"
            />
            <Path
                d="M19 5L5 19"
                stroke="#4F3422"
                strokeWidth={2}
                strokeLinejoin="round"
            />
        </Svg>
    )
};

export default CloseReel;