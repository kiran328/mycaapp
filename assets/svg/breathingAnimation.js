import React, { useRef, useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions, Animated } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/rootReducer';
import { setIsAnimationRunning } from "../../src/redux/actions";

const { width, height } = Dimensions.get("window");
const circleWidth = width / 2;

export default function BreathingAnimation({ patternInhale, patternHold, patternExhale, totalTime }) {
    const move = useRef(new Animated.Value(0)).current;
    const inhaleOpacity = useRef(new Animated.Value(1)).current;
    const holdOpacity = useRef(new Animated.Value(0)).current;
    const exhaleOpacity = useRef(new Animated.Value(0)).current;
    const [timer, setTimer] = useState(0);
    const dispatch = useDispatch();

    const animationRunning = useSelector((state) => state.app.isAnimationRunning);

    const totalCycleDuration = patternInhale + patternHold + patternExhale; // in seconds
    const totalDuration = totalTime.minute * 60; // convert totalTime to milliseconds
    const numCycles = Math.floor(totalDuration / (totalCycleDuration)); // total number of cycles

    const loopAnimation = Animated.loop(
        Animated.sequence([
            // Inhale
            Animated.parallel([
                Animated.timing(move, {
                    toValue: 1,
                    duration: patternInhale * 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(inhaleOpacity, {
                    toValue: 1,
                    duration: patternInhale * 1000,
                    useNativeDriver: true,
                }),
            ]),

            // Transition to Hold
            Animated.parallel([
                Animated.timing(inhaleOpacity, {
                    toValue: 0,
                    duration: 0, // Immediate fade-out of "Inhale" text
                    useNativeDriver: true,
                }),
                Animated.timing(holdOpacity, {
                    toValue: 1,
                    duration: 0, // Immediate fade-in of "Hold" text
                    useNativeDriver: true,
                }),
            ]),

            // Hold
            Animated.timing(holdOpacity, {
                toValue: 1,
                duration: patternHold === 0 ? 0 : patternHold * 1000, // Display "Hold" text for patternHold duration
                useNativeDriver: true,
            }),

            // Transition to Exhale
            Animated.parallel([
                Animated.timing(holdOpacity, {
                    toValue: 0,
                    duration: 0, // Immediate fade-out of "Hold" text
                    useNativeDriver: true,
                }),
                Animated.timing(exhaleOpacity, {
                    toValue: 1,
                    duration: 0, // Immediate fade-in of "Exhale" text
                    useNativeDriver: true,
                }),
                Animated.timing(move, {
                    toValue: 0,
                    duration: patternExhale * 1000,
                    useNativeDriver: true,
                }),
            ]),
        ]),
        numCycles
    );

    useEffect(() => {
        if (animationRunning) {
            loopAnimation.start();
        }
    }, [patternInhale, patternHold, patternExhale, numCycles]);

    useEffect(() => {
        if (timer >= totalDuration) {
            dispatch(setIsAnimationRunning(false));
            loopAnimation.stop();
        }
    }, [timer])

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(prevTimer => prevTimer + 1);
        }, 1000);

        return () => {
            clearInterval(interval); // Stop timer on component unmount
        };
    }, []);

    const translate = move.interpolate({
        inputRange: [0, 1],
        outputRange: [0, circleWidth / 6],
    });

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.animatedCircle,
                    { opacity: inhaleOpacity },
                ]}
            >
                <Text style={styles.text}>Inhale</Text>
            </Animated.View>
            <Animated.View
                style={[
                    styles.animatedCircle,
                    { opacity: holdOpacity },
                ]}
            >
                <Text style={styles.text}>Hold</Text>
            </Animated.View>
            <Animated.View
                style={[
                    styles.animatedCircle,
                    { opacity: exhaleOpacity },
                ]}
            >
                <Text style={styles.text}>Exhale</Text>
            </Animated.View>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((item) => {
                const rotation = move.interpolate({
                    inputRange: [0, 1],
                    outputRange: [`${item * 45}deg`, `${item * 45 + 180}deg`],
                });
                return (
                    <Animated.View
                        key={item}
                        style={[
                            styles.animatedDot,
                            {
                                transform: [
                                    { rotateZ: rotation },
                                    { translateX: translate },
                                    { translateY: translate },
                                ],
                            },
                        ]}
                    />
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        // left: width / 4,
        top: height / 4,
    },
    animatedCircle: {
        width: circleWidth,
        height: circleWidth,
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: 20,
        fontWeight: "600",
    },
    animatedDot: {
        opacity: 0.1,
        backgroundColor: "purple",
        width: circleWidth,
        height: circleWidth,
        borderRadius: circleWidth / 2,
        position: "absolute",
    },
});
