import { Svg, Path } from "react-native-svg";

const Upward = ({height, width}) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 1024 1024" >
            <Path d="M903.232 256l56.768 50.432L512 768 64 306.432 120.768 256 512 659.072z" fill="#000000" stroke={'black'} strokeWidth={30} />
        </Svg>
    )
};

export default Upward