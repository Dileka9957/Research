import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from "react-native";
import { database } from "../components/firebase";
import { useNavigation } from "@react-navigation/native";

const GyroscopeResult = () => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [sensorData, setSensorData] = useState([]);
  const [dayOptions, setDayOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const [errorMessage, setErrorMessage] = useState(null); // State for error message
  const navigation = useNavigation();

  useEffect(() => {
    const fetchDayOptions = async () => {
      const snapshot = await database.ref("sensorData").once("value");
      if (snapshot.exists()) {
        const days = Object.keys(snapshot.val());
        setDayOptions(days);
        console.log("Day options fetched:", days);
      }
    };
    fetchDayOptions();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedDay) {
        const snapshot = await database
          .ref(`sensorData/${selectedDay}`)
          .once("value");
        if (snapshot.exists()) {
          const data = snapshot.val();
          const dataArray = Object.values(data);
          setSensorData(dataArray);
          console.log("Sensor data fetched for", selectedDay, ":", dataArray);
        }
      }
    };
    fetchData();
  }, [selectedDay]);

  const handleSendData = async () => {
    try {
      console.log("Sending data to server...");
      if (dayOptions.length === 7) {
        setIsLoading(true); // Set loading to true when sending data
        const last7Days = dayOptions.slice(-7);
        const dataToSend = [];
        for (const day of last7Days) {
          const snapshot = await database
            .ref(`sensorData/${day}`)
            .once("value");
          if (snapshot.exists()) {
            const data = snapshot.val();
            const dataArray = Object.values(data);

            // Modify the data to include day information
            const dayData = {
              day,
              sensorData: dataArray,
            };
            dataToSend.push(dayData);

            console.log(`Data to send for ${day}:`, dayData);
          }
        }

        console.log("All data to send:", dataToSend);

        const response = await fetch("http://192.168.207.233:5000/predict", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        });

        const jsonResponse = await response.json();

        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }

        console.log("Server response:", jsonResponse);

        // Once all data is sent, navigate to 'Sample' screen
        navigation.navigate("Sample", {
          responseData: jsonResponse,
          error: null,
        });
      } else {
        throw new Error(
          "There must be exactly seven days of data available in the database."
        );
      }
    } catch (error) {
      console.error("Error sending data to server:", error);
      // Show error message in a modal
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false); // Set loading to false when response received
    }
  };

  const handleCloseError = () => {
    setErrorMessage(null); // Close error message modal
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Day selection */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginVertical: 10,
          }}
        >
          {dayOptions.map((day) => (
            <TouchableOpacity
              key={day}
              onPress={() => setSelectedDay(day)}
              style={{
                padding: 10,
                backgroundColor: selectedDay === day ? "blue" : "lightblue",
                borderRadius: 5,
              }}
            >
              <Text style={{ color: selectedDay === day ? "white" : "black" }}>
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sensor data display */}
        {sensorData.length > 0 ? (
          <View>
            <Text>Sensor Data for {selectedDay}</Text>
            {sensorData.map((data, index) => (
              <View key={index}>
                <Text>
                  Gyroscope Data: {data.gyroData.x}, {data.gyroData.y},{" "}
                  {data.gyroData.z}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text>No sensor data available for {selectedDay}</Text>
        )}
      </ScrollView>

      {/* Send Data button */}
      <View style={styles.bottomButtonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.sendButton]}
          onPress={handleSendData}
        >
          <Text style={{ color: "white" }}>Send Data</Text>
        </TouchableOpacity>
      </View>

      {/* Loading indicator */}
      {isLoading && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={true}
          onRequestClose={() => {
            // Do nothing or handle close action
          }}
        >
          <View style={styles.modalContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        </Modal>
      )}

      {/* Error Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={errorMessage !== null}
        onRequestClose={() => {
          // Do nothing or handle close action
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{errorMessage}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseError}
            >
              <Text style={{ color: "blue" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
  scrollView: {
    flex: 1,
  },
  bottomButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    borderTopColor: "#ccc",
  },
  button: {
    flex: 1,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  sendButton: {
    backgroundColor: "green",
    marginLeft: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 10,
  },
});

export default GyroscopeResult;
