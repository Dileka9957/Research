import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";

export default function Result({ route }) {
  const { result } = route.params;

  let resultColor = "#8b008b";
  let borderColor = "#8b008b";
  let shadowColor = "rgba(0, 0, 0, 0.25)";

  if (result === "normal") {
    resultColor = "green";
    borderColor = "green";
    shadowColor = "rgba(0, 128, 0, 0.25)";
  } else if (result === "neutral") {
    resultColor = "red";
    borderColor = "red";
    shadowColor = "rgba(255, 0, 0, 0.25)";
  }

  return (
    <ImageBackground
      source={require("../assets/clean-medical-patterned-background-vector_53876-175204.jpg")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={[styles.resultBox, { borderColor, shadowColor }]}>
          <Text style={styles.resultText}>
            Result is{" "}
            <Text style={[styles.resultText, { color: resultColor }]}>
              {result === "neutral"
                ? "Lack of expressions"
                : result === "normal"
                ? "Normal"
                : "Can't Predict"}
            </Text>
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  resultBox: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    borderWidth: 2,
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5,
  },
  resultText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#8b008b",
  },
});
