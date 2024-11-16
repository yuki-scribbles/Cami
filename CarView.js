import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function CarView() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Car</Text>
      <Image
        source={{ uri: 'https://example.com/car-image.jpg' }}
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  title: {
    color: 'white',
    fontSize: 24,
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});
