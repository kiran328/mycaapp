import { Svg, Path } from "react-native-svg"

const Close = () => {
    return (
        <Svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <Path
                d="M5 5L19 19"
                stroke="white"
                strokeWidth={2}
                strokeLinejoin="round"
            />
            <Path
                d="M19 5L5 19"
                stroke="white"
                strokeWidth={2}
                strokeLinejoin="round"
            />
        </Svg>
    )
};

export default Close;