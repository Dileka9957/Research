import React, { useEffect, useState, useRef, useCallback } from "react";

import Background from "../basic_components/Background";
import Logo from "../basic_components/Logo";
import Header from "../basic_components/Header";
import TextInput from "../basic_components/TextInput";
import Button from "../basic_components/Button";
import Paragraph from "../basic_components/Paragraph";
import { theme } from "../core/theme";

import {
  StyleSheet,
  Platform,
  PermissionsAndroid,
  BackHandler,
  ToastAndroid,
  Linking,
} from "react-native";

import { ipAddressValidator } from "../helpers/ipAddressValidator";

import Spinner from "react-native-loading-spinner-overlay";

import AsyncStorage from "@react-native-async-storage/async-storage";

import NetInfo from "@react-native-community/netinfo";

// import IntentLauncher, {IntentConstant} from 'react-native-intent-launcher';

export default function StartScreen({ navigation }) {
  const [connectionType, setConnectionType] = useState("");

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      console.log("Connection type", state.type);
      setConnectionType(state.type);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const [ipAddress, setIPAddress] = useState({
    value: "",
    error: "",
  });

  const [loading, setLoading] = useState(false);
  const [spinnerTxt, setSpinnerTxt] = useState(" Loading ... ");

  // Retrieve an integer value
  const getValueAsyncStorage = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        console.log("Value retrieved successfully:", value);
        return value;
      } else {
        console.log("No value  found.");
        return null;
      }
    } catch (error) {
      console.log("Error retrieving value :", error);
      return null;
    }
  };

  useEffect(() => {
    //get user email

    const getipSaved = async () => {
      const hostIpRead = await getValueAsyncStorage("hostip");

      console.log(" value host ip read -> ", hostIpRead, typeof hostIpRead);

      if (hostIpRead) {
        setIPAddress({
          value: hostIpRead,
          error: "",
        });
      }
    };

    getipSaved();
  }, []);

  //!===

  const checkInternetConnectivity = () => {
    return new Promise((resolve, reject) => {
      NetInfo.fetch()
        .then((state) => {
          if (state.isConnected) {
            console.log("Internet is connected");
            resolve(true);
          } else {
            console.log("Internet is not connected");
            resolve(false);
          }
        })
        .catch((error) => {
          console.log("Error checking internet connectivity:", error);
          reject(error);
        });
    });
  };

  const timeoutPromise = (timeout) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error(`Request timed out after ${timeout} ms`));
      }, timeout);
    });
  };

  const fetchWithTimeout = (url, options, timeout = 3000) => {
    return Promise.race([fetch(url, options), timeoutPromise(timeout)]);
  };

  const callConnectServer = async () => {
    // console.log({connectionType}, connectionType !== 'cellular');
    if (connectionType !== "wifi" && connectionType !== "cellular") {
      ToastAndroid.show("Please connect to a network ", ToastAndroid.LONG);
      return;
    }

    checkInternetConnectivity()
      .then((isConnected) => {
        console.log("Internet connectivity status:", isConnected);
      })
      .catch((error) => {
        console.log("Error:", error);
        ToastAndroid.show("Network failure ", ToastAndroid.LONG);

        return;
      });

    const ipAddressError = ipAddressValidator(ipAddress.value);

    if (ipAddressError) {
      setIPAddress({
        ...ipAddress,
        error: ipAddressError,
      });
      return;
    }

    setSpinnerTxt(" Pleas wait connection Cheking ...");
    setLoading(true);

    try {
      const ip = ipAddress.value;

      //console.log('test 0');

      const response = await fetchWithTimeout(
        `http://${ip}:5000/check_connection`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ip: ip,
          }),
        }
      );

      //console.log('test 1');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const results = await response.json();

      setLoading(false);

      if (results.status === 200) {
        console.log({ results });

        try {
          await AsyncStorage.setItem("hostip", ip);
          console.log("Host ip saved successfully.");

          //! All savings done

          ToastAndroid.show("Connection Established :)", ToastAndroid.SHORT);
          // setTimeout(() => {
          //   navigation.navigate('HomeScreen', {
          //     ip: ip,
          //   });
          // }, 500);
        } catch (error) {
          console.log("Error saving host ip :", error);

          ToastAndroid.show(error.toString(), ToastAndroid.LONG);
        }
      } else {
        ToastAndroid.show(results.message.toString(), ToastAndroid.LONG);
      }
    } catch (error) {
      setLoading(false);
      console.error(" error connection ", error.toString());
      ToastAndroid.show(error.toString(), ToastAndroid.LONG);
    }
  };

  //  <VideoRecorder />
  return (
    <Background>
      <Logo />
      <Header> Pakinson Analyzer Server</Header>
      <Spinner
        visible={loading}
        textContent={spinnerTxt}
        textStyle={styles.spinnerTextStyle}
        color={styles.spinnerColor}
        overlayColor={styles.spinnerOverlay.color}
      />

      <Paragraph>Pakinson Analyzer needs to connected to server</Paragraph>

      <TextInput
        label="IpAddress"
        returnKeyType="done"
        value={ipAddress.value}
        onChangeText={(text) =>
          setIPAddress({
            value: text,
            error: "",
          })
        }
        error={!!ipAddress.error}
        errorText={ipAddress.error}
        autoCapitalize="none"
        keyboardType="numeric"
        maxLength={15}
      />

      <Button mode="elevated" onPress={callConnectServer}>
        Connect
      </Button>
    </Background>
  );
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  spinnerTextStyle: {
    color: "#FFF",
  },

  spinnerColor: {
    color: "#3333cc",
  },

  spinnerOverlay: {
    color: "rgba(0, 0, 0, 0.75)",
  },
});
