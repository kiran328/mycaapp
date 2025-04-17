import { Svg, Path } from "react-native-svg"

const Forward = () => {
    return (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path
                d="M2 12.0002L21 12.0002"
                stroke="black"
                strokeWidth={2}
                strokeLinejoin="round"
            />
            <Path
                d="M14.3294 20.6935C16.2431 20.1807 17.9341 19.0508 19.1402 17.479C20.3463 15.9072 21 13.9814 21 12.0002C21 10.019 20.3463 8.09313 19.1402 6.52133C17.9341 4.94953 16.2431 3.81963 14.3294 3.30685"
                stroke="black"
                strokeWidth={2}
                strokeLinejoin="round"
            />
        </Svg>
    )
};

export default Forward;