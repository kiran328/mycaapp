import { Svg, Path } from "react-native-svg";

const Downward = ({height, width}) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 1024 1024">
            <Path d="M903.232 768l56.768-50.432L512 256l-448 461.568 56.768 50.432L512 364.928z" fill="#000000" stroke={'black'} strokeWidth={30} />
        </Svg>
    )
};

export default Downward