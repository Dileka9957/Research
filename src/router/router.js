import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from '../screens/Home';
import Result from "../screens/Result";
import ParkinsonStage from '../screens/parkinsonStage';
import Gyroscope from "../screens/Gyroscope";
import GyroscopeResult from "../screens/GyroscopeResults";
import Sample from "../screens/sample";
import PermisionScreen from "../screens/PermisionScreen";
import StartScreen from "../screens/StartScreen";
import CamScreen from "../screens/CamScreen";

const Stack = createNativeStackNavigator();

const AppRouter = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          options={{ headerShown: false }}
          name="Home"
          component={Home}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Cam"
          component={CamScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Result"
          component={Result}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="parkinsonStage"
          component={ParkinsonStage}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="gyroscope"
          component={Gyroscope}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="gyroscoperesult"
          component={GyroscopeResult}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="permisionScreen"
          component={PermisionScreen}
        />
        <Stack.Screen name="StartScreen" component={StartScreen} />
        <Stack.Screen
          options={{ headerShown: false }}
          name="sample"
          component={Sample}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppRouter;