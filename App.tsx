// App.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapView from 'react-native-maps';

// Define the tab navigator
const Tab = createBottomTabNavigator();

// Scan Screen
const ScanScreen = () => {
  return (
    <View style={styles.screen}>
      <Text style={styles.text}>Scan Screen</Text>
    </View>
  );
};

// Profile Screen
const ProfileScreen = () => {
  return (
    <View style={styles.screen}>
      <Text style={styles.text}>Profile Screen</Text>
    </View>
  );
};

// Maps Screen
const MapsScreen = () => {
  return (
    <MapView
      style={StyleSheet.absoluteFillObject}
      initialRegion={{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    />
  );
};

// App Component
const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{ //this is what contains all the info for navbar styling
          headerShown: false,
          tabBarStyle: { backgroundColor: '#000', height: 72 },
          tabBarInactiveTintColor: '#fff',
          tabBarActiveTintColor: '#fff',
          tabBarLabelStyle: {fontSize: 20, textAlign: 'center'},
          tabBarIconStyle: {display: 'none'},
          
        }}
      >
        <Tab.Screen name="Scan" component={ScanScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Maps" component={MapsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000'
  },
});

export default App;
