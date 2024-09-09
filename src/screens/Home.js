import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function Home() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8b008b" />
      <View style={styles.menuBar}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => {
            /* Handle menu button press */
          }}
        >
          <Text style={styles.menuButtonText}>Menu</Text>
        </TouchableOpacity>
      </View>

      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Parkinson's Face Scanner") {
              iconName = focused ? "ios-camera" : "ios-camera-outline";
            } else if (route.name === "Parkinson's Stage Tracker") {
              iconName = focused ? "ios-analytics" : "ios-analytics-outline";
            } else if (route.name === "Parkinson's Voice Tracker") {
              iconName = focused ? "ios-mic" : "ios-mic-outline";
            } else if (route.name === "Parkinson's Gyroscope Tracker") {
              iconName = focused ? "ios-compass" : "ios-compass-outline";
            }

            // Return an Icon component from react-native-vector-icons
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarStyle: {
            backgroundColor: "#8b008b",
            display: "flex",
            borderWidth: 1,
            borderColor: "black",
          },
          tabBarActiveTintColor: "#fff",
          tabBarInactiveTintColor: "#aaa",
          tabBarShowLabel: false,
        })}
      >
        <Tab.Screen
          name="Parkinson's Face Scanner"
          component={StartScanningScreen}
        />
        <Tab.Screen
          name="Parkinson's Stage Tracker"
          component={ParkinsonScreen}
        />
        <Tab.Screen name="Parkinson's Voice Tracker" component={VoiceScreen} />
        <Tab.Screen
          name="Parkinson's Gyroscope Tracker"
          component={GyroscopeScreen}
        />
      </Tab.Navigator>
    </View>
  );
}

function StartScanningScreen({ navigation }) {
  return (
    <ImageBackground
      source={require("../assets/clean-medical-patterned-background-vector_53876-175204.jpg")}
      style={[styles.backgroundImage, { backgroundColor: "#f0f0f0" }]}
    >
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Cam")}
        >
          <Text style={styles.buttonText}>Start Scanning</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

function ParkinsonScreen({ navigation }) {
  return (
    <ImageBackground
      source={require("../assets/clean-medical-patterned-background-vector_53876-175204.jpg")}
      style={[styles.backgroundImage, { backgroundColor: "#f0f0f0" }]}
    >
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("parkinsonStage")}
        >
          <Text style={styles.buttonText}>Start Tracking</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

function VoiceScreen({ navigation }) {
  return (
    <ImageBackground
      source={require("../assets/clean-medical-patterned-background-vector_53876-175204.jpg")}
      style={[styles.backgroundImage, { backgroundColor: "#f0f0f0" }]}
    >
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("permisionScreen")}
        >
          <Text style={styles.buttonText}>Start Recording</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

function GyroscopeScreen({ navigation }) {
  return (
    <ImageBackground
      source={require("../assets/clean-medical-patterned-background-vector_53876-175204.jpg")}
      style={[styles.backgroundImage, { backgroundColor: "#f0f0f0" }]}
    >
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("gyroscope")}
        >
          <Text style={styles.buttonText}>Start gyroscope</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  menuBar: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    position: "absolute",
    top: 0,
    width: "100%",
    height: 50,
    backgroundColor: "#8b008b",
  },
  menuButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  menuButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 150,
    backgroundColor: "#8b008b",
    padding: 10,
    marginVertical: 10,
    borderRadius: 16,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
  },
});
