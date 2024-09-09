import React, { useEffect, useState, useRef, useCallback } from "react";

import Background from "../basic_components/Background";
import Logo from "../basic_components/Logo";
import Header from "../basic_components/Header";
import Button from "../basic_components/Button";
import Paragraph from "../basic_components/Paragraph";
import {
  StyleSheet,
  Platform,
  PermissionsAndroid,
  BackHandler,
  ToastAndroid,
  Linking,
} from "react-native";

const PermisionScreen = ({ navigation }) => {
  const backButtonPressed = useRef(0);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    return () => backHandler.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBackPress = () => {
    if (backButtonPressed.current === 1) {
      // If pressed again within a short interval, exit the app
      console.log(" exit app  1");
      BackHandler.exitApp();
    } else {
      console.log(" exit app 0 ");
      // Show a toast to inform the user
      ToastAndroid.show("Press back again to exit", ToastAndroid.SHORT);
      backButtonPressed.current = 1;
      // Reset the state after a certain interval
      setTimeout(() => {
        backButtonPressed.current = 0;
      }, 2000); // Adjust the time interval as needed
    }
    return true; // Prevent default back button action
  };
  const [storageReadPermissionStatus, setstorageReadPermissionStatus] =
    useState(PermissionsAndroid.RESULTS.DENIED);

  const [storageWritePermissionStatus, setstorageWritePermissionStatus] =
    useState(PermissionsAndroid.RESULTS.DENIED);

  const [microphonePermissionStatus, setmicrophonePermissionStatus] = useState(
    PermissionsAndroid.RESULTS.DENIED
  );

  const requestStorageWritePermission = useCallback(async () => {
    try {
      if (Platform.Version < 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Storage Permission",
            message: "App needs access to your storage to save files.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Storage permission granted save files");
        } else {
          console.log("Storage permission denied save files");
          await Linking.openSettings();
        }

        setstorageWritePermissionStatus(granted);
      } else {
        setstorageWritePermissionStatus(PermissionsAndroid.RESULTS.GRANTED);
      }
    } catch (err) {
      console.warn(err);
    }
  }, []);

  const requestStorageReadPermission = useCallback(async () => {
    try {
      if (Platform.Version < 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: "Storage Permission",
            message: "App needs access to your storage to read files.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Storage permission granted read files");
        } else {
          console.log("Storage permission denied read files");
          await Linking.openSettings();
        }
        setstorageReadPermissionStatus(granted);
      } else {
        setstorageReadPermissionStatus(PermissionsAndroid.RESULTS.GRANTED);
      }
    } catch (err) {
      console.warn(err);
    }
  }, []);

  const requestMicrophonePermission = useCallback(async () => {
    try {
      if (Platform.Version > 23) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: "Microphone Permission",
            message: "App needs access to your microphone for audio recording.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Microphone permission granted");
        } else {
          console.log("Microphone permission denied");
          await Linking.openSettings();
        }

        setmicrophonePermissionStatus(granted);
      } else {
        setmicrophonePermissionStatus(PermissionsAndroid.RESULTS.GRANTED);
      }
    } catch (err) {
      console.warn(err);
    }
  }, []);

  const checkPermission = async (permission) => {
    try {
      const granted = await PermissionsAndroid.check(permission);

      console.log({ granted });

      if (granted) {
        return PermissionsAndroid.RESULTS.GRANTED;
      } else {
        return PermissionsAndroid.RESULTS.DENIED;
      }
    } catch (err) {
      console.warn(err);
      return PermissionsAndroid.RESULTS.DENIED;
    }
  };

  useEffect(() => {
    const check_permisions_async = async () => {
      if (Platform.Version < 33) {
        const readGranted = await checkPermission(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );

        if (readGranted === "granted") {
          console.log("Storage read permission granted");
          setstorageReadPermissionStatus(readGranted);
        } else {
          console.log("Storage read permission denied");
          setstorageReadPermissionStatus(readGranted);
          return;
        }

        const writeGranted = await checkPermission(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );

        if (writeGranted === "granted") {
          console.log("Storage write permission granted");
          setstorageWritePermissionStatus(writeGranted);
        } else {
          console.log("Storage write permission denied");
          setstorageWritePermissionStatus(writeGranted);
          return;
        }
      } else {
        setstorageReadPermissionStatus(PermissionsAndroid.RESULTS.GRANTED);
        setstorageWritePermissionStatus(PermissionsAndroid.RESULTS.GRANTED);
      }

      if (Platform.Version > 23) {
        const micGranted = await checkPermission(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
        );

        if (micGranted === "granted") {
          console.log("Storage write permission granted");
          setmicrophonePermissionStatus(micGranted);
        } else {
          console.log("Storage write permission denied");
          setmicrophonePermissionStatus(micGranted);
          return;
        }
      } else {
        setmicrophonePermissionStatus(PermissionsAndroid.RESULTS.GRANTED);
      }
    };

    check_permisions_async();

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    storageReadPermissionStatus,
    storageWritePermissionStatus,
    microphonePermissionStatus,
  ]);

  //!============

  const nextGo = async () => {
    ToastAndroid.show("Permissions Done", ToastAndroid.SHORT);
    // setTimeout(() => {
    //   navigation.navigate('StartScreen');
    // }, 250);
  };

  return (
    <Background>
      <Logo />
      <Header> Pakinson Analyzer Permissions </Header>

      {storageReadPermissionStatus !== "granted" && (
        <>
          <Paragraph>Pakinson Analyzer needs Storage Read Permission</Paragraph>
          <Button mode="elevated" onPress={requestStorageReadPermission}>
            Grant
          </Button>
        </>
      )}

      {storageWritePermissionStatus !== "granted" && (
        <>
          <Paragraph>
            Pakinson Analyzer needs Storage Write Permission
          </Paragraph>
          <Button mode="elevated" onPress={requestStorageWritePermission}>
            Grant
          </Button>
        </>
      )}

      {microphonePermissionStatus !== "granted" && (
        <>
          <Paragraph>Pakinson Analyzer needs Microphone Permission</Paragraph>
          <Button mode="elevated" onPress={requestMicrophonePermission}>
            Grant
          </Button>
        </>
      )}

      {storageReadPermissionStatus === "granted" &&
        storageWritePermissionStatus === "granted" &&
        microphonePermissionStatus === "granted" && (
          <Paragraph>All Permissions Granted Let's continue</Paragraph>
        )}

      <Button mode="elevated" onPress={nextGo}>
        Next
      </Button>
    </Background>
  );
};

export default PermisionScreen;
