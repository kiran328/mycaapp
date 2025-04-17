import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import Animated, {
    useSharedValue,
    useAnimatedProps,
} from 'react-native-reanimated';
import Complete from './complete';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CompletedTimer = () => {
    const radius = 20;
    const strokeWidth = 5;
    const circumference = 2 * Math.PI * radius;
    const halfCircle = radius + strokeWidth;

    const progress = useSharedValue(1);

    useEffect(() => {
        // Set the initial progress value
        progress.value = 1;
    }, []);

    const animatedProps = useAnimatedProps(() => {
        return {
            strokeDashoffset: circumference * (1 - progress.value),
        };
    });

    return (
        <View style={styles.container}>
            <Svg
                height={halfCircle * 2}
                width={halfCircle * 2}
                viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}
            >
                <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
                    <Circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        stroke="#e6e6e6"
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    <AnimatedCircle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        stroke="hotpink"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference}
                        fill="none"
                        animatedProps={animatedProps}
                    />
                </G>
            </Svg>
            <View style={styles.completeMark}>
                <Complete />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    completeMark: {
        position: 'absolute',
    },
    text: {
        position: 'absolute',
        fontSize: 18,
        color: 'black',
        fontWeight: 'bold',
    },
});

export default CompletedTimer;
