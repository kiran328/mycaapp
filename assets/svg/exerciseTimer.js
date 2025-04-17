import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Line } from 'react-native-svg';


const CountdownTimer = ({ initialTime, onComplete }) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [lineLength, setLineLength] = useState(100);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1000);
                setLineLength((prev) => (prev * (timeLeft - 1000)) / initialTime);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            onComplete();
        }
    }, [timeLeft, initialTime, onComplete]);

    return (
        <View style={styles.timerContainer}>
            <Svg height="10" width="100%">
                <Line
                    x1="0"
                    y1="5"
                    x2={`${lineLength}%`}
                    y2="5"
                    stroke="red"
                    strokeWidth="4"
                />
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    timerContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        left: 10,
    },
});

export default CountdownTimer;
