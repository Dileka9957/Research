import React, { useState } from 'react';
import { View, Text, Button, TextInput, ToastAndroid, ImageBackground } from 'react-native';
import axios from 'axios';

export default function App() {
  const [nameInputs, setNameInputs] = useState(Array(6).fill(''));
  const [resultView, setResultView] = useState('');

  const sendDataToServerAsync = async () => {
    // Check if any input field is empty
    if (nameInputs.some(input => input.trim() === '')) {
      ToastAndroid.show('All fields are required', ToastAndroid.SHORT);
      return;
    }
  
    try {
      const response = await axios.post('http://192.168.48.94:5000/predict', {
        data: nameInputs
      });
      
      // Assuming the response data contains the Parkinson's stage
      const predictedClass = response.data.predicted_class;
      // Update UI with the result
      setResultView(`Parkinson's Stage is: ${predictedClass}`);
    } catch (error) {
      console.error('Error:', error.message);
      ToastAndroid.show('Error occurred. Please try again.', ToastAndroid.SHORT);
    }
  };
  

  const handleChangeText = (text, index) => {
    const newInputs = [...nameInputs];
    newInputs[index] = text;
    setNameInputs(newInputs);
  };

  const renderTextInputs = () => {
    return nameInputs.map((input, index) => (
      <TextInput
        key={index}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10, backgroundColor: 'white' }}
        onChangeText={text => handleChangeText(text, index)}
        value={input}
        placeholder={`Name ${index + 1}`}
      />
    ));
  };

  return (
    <ImageBackground
      source={require('../assets/clean-medical-patterned-background-vector_53876-175204.jpg')}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        {renderTextInputs()}
        <Button title="Send Data" onPress={sendDataToServerAsync} />
        <Text style={{ marginTop: 20, color: 'white' }}>{resultView}</Text>
      </View>
    </ImageBackground>
  );
}
