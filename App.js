import React from "react";
import LottieView from "lottie-react-native";

export default function Animation() {
  return (
    <LottieView
      source={require("./loading.json")}
      style={{width: "100%", height: "100%"}}
      autoPlay
      loop={true}
    />
  );
}
