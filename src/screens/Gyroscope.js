import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Gyroscope } from "expo-sensors";
import { database } from "../components/firebase";
import Result from "./GyroscopeResults";
import Sample from "./sample";

const Stack = createStackNavigator();

export default function GyroscopeScreen() {
  const [dayCount, setDayCount] = useState(0);
  const [gyroEnabled, setGyroEnabled] = useState(false);

  const resetDayCount = () => {
    setDayCount(0);
  };

  const handleSendData = async () => {
    try {
      await database.ref("sensorData").remove();
      resetDayCount();
      console.log("Database cleared and day count reset.");
    } catch (error) {
      console.error("Error clearing database:", error.message);
    }
  };

  const handleStartGyro = () => {
    setGyroEnabled(true);
    setDayCount(dayCount + 1);
  };

  const handleStopGyro = () => {
    setGyroEnabled(false);
    setDayCount(dayCount - 1); // Reset day count
  };

  useEffect(() => {
    let gyroSubscription;

    if (gyroEnabled) {
      let gyroDataArray = [];

      gyroSubscription = Gyroscope.addListener((gyroscopeData) => {
        gyroDataArray.push(gyroscopeData);
      });

      const timeout = setTimeout(() => {
        gyroSubscription.remove();
        saveDataToFirebase(gyroDataArray, dayCount);
        setGyroEnabled(false);
      }, 10000); // 10000 milliseconds = 10 seconds

      return () => clearTimeout(timeout);
    }
  }, [gyroEnabled]);

  const saveDataToFirebase = (gyroDataArray, dayCount) => {
    const dataToSave = gyroDataArray.map((gyroData, index) => ({
      gyroData: gyroData
        ? {
            x: gyroData.x?.toFixed(8) || null,
            y: gyroData.y?.toFixed(8) || null,
            z: gyroData.z?.toFixed(8) || null,
          }
        : null,
      timestamp: Date.now(),
    }));

    database.ref(`sensorData/Day ${dayCount}`).set(dataToSave);
  };

  const handleReset = () => {
    handleSendData(); // Clear all database data
  };

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        <Stack.Screen name="Gyroscope test">
          {(props) => (
            <HomeScreen
              {...props}
              resetDayCount={resetDayCount}
              dayCount={dayCount}
              setDayCount={setDayCount}
              handleSendData={handleSendData}
              handleStartGyro={handleStartGyro}
              handleStopGyro={handleStopGyro}
              gyroEnabled={gyroEnabled}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="GyroscopeResult">
          {(props) => <Result {...props} resetDayCount={resetDayCount} />}
        </Stack.Screen>
        <Stack.Screen name="Sample">
          {(props) => <Sample {...props} resetDayCount={resetDayCount} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeScreen({
  navigation,
  resetDayCount,
  dayCount,
  setDayCount,
  handleSendData,
  handleStartGyro,
  handleStopGyro,
  gyroEnabled,
}) {
  const [gyroData, setGyroData] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    let gyroSubscription;

    if (gyroEnabled) {
      gyroSubscription = Gyroscope.addListener((gyroscopeData) => {
        if (gyroscopeData) {
          setGyroData((prevData) => ({ ...prevData, ...gyroscopeData }));
          console.log("Gyroscope Data:", gyroscopeData); // Log gyroscope data
        }
      });
    } else {
      gyroSubscription?.remove();
    }

    return () => {
      gyroSubscription?.remove();
    };
  }, [gyroEnabled]);

  const handleReset = () => {
    handleSendData(); // Clear all database data
  };

  return (
    <View style={styles.container}>
      <View style={styles.dataContainer}>
        <Text style={styles.dataText}>
          Gyroscope Data (X, Y, Z): {gyroData.x?.toFixed(2) || "N/A"},{" "}
          {gyroData.y?.toFixed(2) || "N/A"}, {gyroData.z?.toFixed(2) || "N/A"}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={[styles.button, styles.startButton]}
            onPress={handleStartGyro}
          >
            <Text>Start Gyroscope</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              styles.stopButton,
              gyroEnabled
                ? { backgroundColor: "red" }
                : { backgroundColor: "lightblue" },
            ]}
            onPress={handleStopGyro}
          >
            <Text>Stop Gyroscope</Text>
          </TouchableOpacity>
        </View>
      </View>

      <StatusBar style="auto" />

      <View style={styles.bottomButtonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.dayCountButton]}
          onPress={() =>
            navigation.navigate("GyroscopeResult", { day: dayCount })
          }
        >
          <Text style={styles.buttonText}>Day Count</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.tryAgainButton]}
          onPress={handleReset}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  startButton: {
    backgroundColor: "lightblue",
    alignItems: "center",
    justifyContent: "center", // Light blue color for Start Gyroscope button
  },

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dataContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  dataText: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    marginBottom: "auto", // Push Start Gyroscope button to the center
  },
  bottomButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  button: {
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    minWidth: 150, // Set a minimum width for buttons
    margin: 5,
  },
  dayCountButton: {
    backgroundColor: "lightblue",
  },
  tryAgainButton: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});
