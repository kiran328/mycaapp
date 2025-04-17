import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedProps,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';
import Complete from './complete';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const Timer = ({ seconds, timerKey, timeAllotted, isPlaying }) => {
  const radius = 20;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;
  const halfCircle = radius + strokeWidth;

  const progress = useSharedValue(0);
  const [countDown, setCountDown] = useState(timeAllotted - seconds);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      // Calculate the remaining time
      const remainingTime = timeAllotted - seconds;

      // Calculate the initial progress
      let initialProgress = seconds >= timeAllotted ? 1 : seconds / timeAllotted;

      // Set initial progress value
      progress.value = initialProgress;

      // Start the animation
      const timer = setTimeout(() => {
        progress.value = withTiming(1, {
          duration: remainingTime * 1000, // duration in milliseconds
          easing: Easing.linear,
        });
      }, 200); // 200ms delay

      // Update the countdown every second
      const interval = setInterval(() => {
        setCountDown((prev) => Math.max(prev - 1, 0));
      }, 1000);

      // Cleanup timers on component unmount or pause
      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    } else {
      // Pause the animation and clear timers
      cancelAnimation(progress);
      clearTimeout(timerRef.current);
      clearInterval(timerRef.current);
    }
  }, [seconds, timerKey, timeAllotted, isPlaying]);

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
        {countDown === 0 ? <Complete /> : <Text style={styles.text}>{countDown}</Text>}
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
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
});

export default Timer;
