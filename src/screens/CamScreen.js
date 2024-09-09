// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { View, Button, StyleSheet, Text } from 'react-native';
// import { Camera, useCameraDevices, CameraPermissionStatus } from 'react-native-vision-camera';
// import FaceDetection, { Face } from '@react-native-ml-kit/face-detection';

// const CamScreen : React.FC<Props> = ({ route, navigation }) => {
//   const [cameraPermission, setCameraPermission] = useState<CameraPermissionStatus>('not-determined');
//   const [isRecording, setIsRecording] = useState(false);
//   const [expressionResults, setExpressionResults] = useState<Array<{ time: number; expression: string }>>([]);
//   const [currentExpression, setCurrentExpression] = useState<string>('');
//   const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);

//   const devices = useCameraDevices();
//   const device = devices.find(d => d.position === 'front');
//   const camera = useRef<Camera>(null);
//   const intervalRef = useRef<NodeJS.Timeout | null>(null);

//   useEffect(() => {
//     (async () => {
//       const cameraPermissionStatus = await Camera.getCameraPermissionStatus();
//       setCameraPermission(cameraPermissionStatus);
//     })();
//   }, []);

//   const requestPermissions = useCallback(async () => {
//     const cameraPermissionStatus = await Camera.requestCameraPermission();
//     setCameraPermission(cameraPermissionStatus);
//   }, []);

//   const detectFacialExpression = useCallback((face: Face): string => {
//     const smilingProbability = face.smilingProbability ?? 0;
//     const leftEyeOpenProbability = face.leftEyeOpenProbability ?? 0;
//     const rightEyeOpenProbability = face.rightEyeOpenProbability ?? 0;
//     const avgEyeOpenProbability = (leftEyeOpenProbability + rightEyeOpenProbability) / 2;

//     if (smilingProbability > 0.7 && avgEyeOpenProbability > 0.4) return 'happy';
//     if (avgEyeOpenProbability > 0.8 && smilingProbability < 0.3) return 'surprised';
//     if (smilingProbability < 0.2 && avgEyeOpenProbability < 0.4) return 'sad';
//     if (avgEyeOpenProbability > 0.7 && smilingProbability < 0.1) return 'fear';
//     return 'neutral';
//   }, []);

//   const stopRecording = useCallback(() => {
//     setIsRecording(false);
//     setRecordingStartTime(null);
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//     }
//   }, []);

//   const captureAndAnalyze = useCallback(async () => {
//     if (camera.current) {
//       try {
//         const photo = await camera.current.takePhoto();
//         const faces = await FaceDetection.detect(`file://${photo.path}`, {
//           performanceMode: 'accurate',
//           landmarkMode: 'all',
//           contourMode: 'all',
//           classificationMode: 'all'
//         });

//         const currentTime = Date.now();

//         if (faces.length > 0) {
//           const expression = detectFacialExpression(faces[0]);
//           setCurrentExpression(expression);
//           setExpressionResults(prev => [...prev, { time: currentTime, expression }]);
//         } else {
//           setCurrentExpression('No face detected');
//         }

//         // Stop recording after 20 seconds
//         if (recordingStartTime && currentTime - recordingStartTime > 20000) {
//           stopRecording();
//         }
//       } catch (error) {
//         console.error('Face detection error:', error);
//       }
//     }
//   }, [detectFacialExpression, recordingStartTime, stopRecording]);

//   const startRecording = useCallback(() => {
//     setIsRecording(true);
//     setRecordingStartTime(Date.now());
//     setExpressionResults([]);
//     setCurrentExpression('');
//     intervalRef.current = setInterval(captureAndAnalyze, 5000); // Capture every 5 seconds
//   }, [captureAndAnalyze]);

//   if (cameraPermission !== 'granted') {
//     return (
//       <View style={styles.container}>
//         <Text>Camera permission: {cameraPermission}</Text>
//         <Button title="Request Permissions" onPress={requestPermissions} />
//       </View>
//     );
//   }

//   if (device == null) return <View style={styles.container}><Text>No camera device available</Text></View>;

//   return (
//     <View style={styles.container}>
//       <Camera
//         style={StyleSheet.absoluteFill}
//         device={device}
//         isActive={true}
//         photo={true}
//         ref={camera}
//       />
//       <View style={styles.overlay}>
//         <Text style={styles.expressionText}>Current Expression: {currentExpression}</Text>
//         <Button
//           title={isRecording ? "Stop Recording" : "Start Recording"}
//           onPress={isRecording ? stopRecording : startRecording}
//         />
//         {!isRecording && expressionResults.length > 0 && (
//           <Button
//             title="View Results"
//             onPress={() => navigation.navigate('Results', { results: expressionResults })}
//           />
//         )}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   overlay: {
//     position: 'absolute',
//     bottom: 50,
//     width: '100%',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     padding: 10,
//   },
//   expressionText: {
//     fontSize: 18,
//     color: 'white',
//     marginBottom: 20,
//   },
// });

// export default CamScreen;

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import FaceDetection from '@react-native-ml-kit/face-detection';

const CamScreen = ({ route, navigation }) => {
  const [cameraPermission, setCameraPermission] = useState('not-determined');
  const [isRecording, setIsRecording] = useState(false);
  const [expressionResults, setExpressionResults] = useState([]);
  const [currentExpression, setCurrentExpression] = useState('');
  const [recordingStartTime, setRecordingStartTime] = useState(null);

  const devices = useCameraDevices();
  const device = devices.find(d => d.position === 'front');
  const camera = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    (async () => {
      const cameraPermissionStatus = await Camera.getCameraPermissionStatus();
      setCameraPermission(cameraPermissionStatus);
    })();
  }, []);

  const requestPermissions = useCallback(async () => {
    const cameraPermissionStatus = await Camera.requestCameraPermission();
    setCameraPermission(cameraPermissionStatus);
  }, []);

  const detectFacialExpression = useCallback((face) => {
    const smilingProbability = face.smilingProbability ?? 0;
    const leftEyeOpenProbability = face.leftEyeOpenProbability ?? 0;
    const rightEyeOpenProbability = face.rightEyeOpenProbability ?? 0;
    const avgEyeOpenProbability = (leftEyeOpenProbability + rightEyeOpenProbability) / 2;

    if (smilingProbability > 0.7 && avgEyeOpenProbability > 0.4) return 'happy';
    if (avgEyeOpenProbability > 0.8 && smilingProbability < 0.3) return 'surprised';
    if (smilingProbability < 0.2 && avgEyeOpenProbability < 0.4) return 'sad';
    if (avgEyeOpenProbability > 0.7 && smilingProbability < 0.1) return 'fear';
    return 'neutral';
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    setRecordingStartTime(null);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const captureAndAnalyze = useCallback(async () => {
    if (camera.current) {
      try {
        const photo = await camera.current.takePhoto();
        const faces = await FaceDetection.detect(`file://${photo.path}`, {
          performanceMode: 'accurate',
          landmarkMode: 'all',
          contourMode: 'all',
          classificationMode: 'all'
        });

        const currentTime = Date.now();

        if (faces.length > 0) {
          const expression = detectFacialExpression(faces[0]);
          setCurrentExpression(expression);
          setExpressionResults(prev => [...prev, { time: currentTime, expression }]);
        } else {
          setCurrentExpression('No face detected');
        }

        // Stop recording after 20 seconds
        if (recordingStartTime && currentTime - recordingStartTime > 20000) {
          stopRecording();
        }
      } catch (error) {
        console.error('Face detection error:', error);
      }
    }
  }, [detectFacialExpression, recordingStartTime, stopRecording]);

  const startRecording = useCallback(() => {
    setIsRecording(true);
    setRecordingStartTime(Date.now());
    setExpressionResults([]);
    setCurrentExpression('');
    intervalRef.current = setInterval(captureAndAnalyze, 5000); // Capture every 5 seconds
  }, [captureAndAnalyze]);

  if (cameraPermission !== 'granted') {
    return (
      <View style={styles.container}>
        <Text>Camera permission: {cameraPermission}</Text>
        <Button title="Request Permissions" onPress={requestPermissions} />
      </View>
    );
  }

  if (device == null) return <View style={styles.container}><Text>No camera device available</Text></View>;

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
        ref={camera}
      />
      <View style={styles.overlay}>
        <Text style={styles.expressionText}>Current Expression: {currentExpression}</Text>
        <Button
          title={isRecording ? "Stop Recording" : "Start Recording"}
          onPress={isRecording ? stopRecording : startRecording}
        />
        {!isRecording && expressionResults.length > 0 && (
          <Button
            title="View Results"
            onPress={() => navigation.navigate('Results', { results: expressionResults })}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  overlay: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
  },
  expressionText: {
    fontSize: 18,
    color: 'white',
    marginBottom: 20,
  },
});

export default CamScreen;
