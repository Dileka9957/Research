import React from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';

const AverageTimeScreen = ({ route, navigation }) => {
  const { results } = route.params;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Expression Results:</Text>
        {results.map((result, index) => (
          <Text key={index} style={styles.resultText}>
            Time: {new Date(result.time).toLocaleTimeString()}, Expression: {result.expression}
          </Text>
        ))}
      </ScrollView>
      <Button title="Back to Camera" onPress={() => navigation.navigate('Home')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5FCFF',
  },
  scrollView: {
    flex: 1,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default AverageTimeScreen;