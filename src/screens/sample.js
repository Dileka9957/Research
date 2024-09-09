import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Sample = ({ route }) => {
  const { responseData = null, error = null } = route.params || {};
  const [showTryAgain, setShowTryAgain] = useState(false);

  const clearScreen = () => {
    setShowTryAgain(true);
  };

  const renderContent = () => {
    if (showTryAgain) {
      return <Text style={styles.tryAgainText}>Please Start From Begining</Text>;
    } else if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
    } else if (responseData !== null) {
      return (
        <View style={styles.responseContainer}>
          <Text style={[styles.responseText, styles.responseTextSize]}>Response from server:</Text>
          {typeof responseData === 'string' ? (
            <Text style={styles.responseText}>{responseData}</Text>
          ) : (
            <Text style={styles.responseText}>{JSON.stringify(responseData)}</Text>
          )}
        </View>
      );
    } else {
      return <Text style={styles.responseText}>No response from server</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {renderContent()}
      </View>
      <TouchableOpacity style={styles.button} onPress={clearScreen}>
        <Text style={styles.buttonText}>Clear Response</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  responseContainer: {
    alignItems: 'center',
  },
  responseText: {
    fontSize: 24,
    marginBottom: 10,
  },
  responseTextSize: {
    fontSize: 24, // Adjusted to match response text size
  },
  tryAgainText: {
    fontSize: 22,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'green',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Sample;
