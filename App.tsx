import React, { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Switch } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Picker } from '@react-native-picker/picker';
import { PinchGestureHandler, PinchGestureHandlerGestureEvent, GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer, NavigationProp } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CarView from './CarView';

const Stack = createStackNavigator();

type RootStackParamList = {
  MainScreen: undefined;
  ProfileScreen: undefined;
  MapScreen: undefined;
  CarView: undefined
};

type MainScreenProps = {
  navigation: NavigationProp<RootStackParamList, 'MainScreen'>;
};

function MainScreen({ navigation }: MainScreenProps) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isMilitary, setIsMilitary] = useState(false);
  const [scanType, setScanType] = useState("Barcode"); // Default to Barcode
  const cameraRef = useRef(null);

  const [scale, setScale] = useState(1);
  const [lastScale, setLastScale] = useState(1);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const onPinchEvent = (event: PinchGestureHandlerGestureEvent) => {
    const newScale = lastScale * event.nativeEvent.scale;
    if (newScale >= 1 && newScale <= 3) {
      setScale(newScale);
    }
  };

  const onPinchStateChange = (event: { nativeEvent: { state: number } }) => {
    if (event.nativeEvent.state === 5) {
      setLastScale(scale);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.cameraContainer}>
        <PinchGestureHandler onGestureEvent={onPinchEvent} onHandlerStateChange={onPinchStateChange}>
          <CameraView 
            style={[styles.camera, { transform: [{ scale }] }]} 
            facing={facing} 
            ref={cameraRef} 
          />
        </PinchGestureHandler>

        {/* Dynamic alignment frame based on scanType */}
        <View style={[
          styles.alignmentFrame,
          scanType === 'Barcode' && styles.barcodeFrame,
          scanType === 'QRCode' && styles.qrCodeFrame,
          scanType === 'LicensePlate' && styles.licensePlateFrame
        ]} />
      </View>

      <View style={styles.controlContainer}>
        <View style={styles.optionRow}>
          <Text style={styles.optionText}>Military</Text>
          <Switch
            value={isMilitary}
            onValueChange={() => setIsMilitary(!isMilitary)}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isMilitary ? "#f5dd4b" : "#f4f3f4"}
          />
          <Text style={styles.optionText}>Rental</Text>
        </View>

        {/* Picker to manually switch the scan type */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={scanType}
            style={styles.picker}
            onValueChange={(itemValue) => setScanType(itemValue)}
            mode="dropdown" // Ensure the dropdown mode
          >
            <Picker.Item label="Barcode" value="Barcode" />
            <Picker.Item label="QR Code" value="QRCode" />
            <Picker.Item label="License Plate" value="LicensePlate" />
          </Picker>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.goButton} 
        onPress={() => navigation.navigate('CarView')}
      >
        <Text style={styles.goButtonText}>Go</Text>
      </TouchableOpacity>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNavBar}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('ProfileScreen')}>
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.navButton, styles.activeNavButton]} onPress={() => navigation.navigate('MainScreen')}>
          <Text style={styles.navText}>Scan</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('MapScreen')}>
          <Text style={styles.navText}>Map</Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
}

// Dummy ProfileScreen
function ProfileScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenText}>Profile Screen</Text>
    </View>
  );
}

// Dummy MapScreen
function MapScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenText}>Map Screen</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="MainScreen" component={MainScreen} options={{ title: 'Scan' }} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ title: 'Profile' }} />
        <Stack.Screen name="MapScreen" component={MapScreen} options={{ title: 'Map' }} />
        <Stack.Screen name="CarView" component={CarView} options={{ title: 'Car' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  cameraContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    paddingHorizontal: 10,
  },
  camera: {
    width: '100%',
    height: '80%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  alignmentFrame: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  barcodeFrame: {
    top: '30%',
    left: '10%',
    width: '80%',
    height: '30%',
    borderRadius: 5,
  },
  qrCodeFrame: {
    top: '35%',
    left: '25%',
    width: '50%',
    height: '30%',
    borderRadius: 10,
  },
  licensePlateFrame: {
    top: '40%',
    left: '10%',
    width: '80%',
    height: '20%',
    borderRadius: 5,
  },
  controlContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: 'black',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  optionText: {
    color: 'white',
    fontSize: 16,
    marginHorizontal: 10,
  },
  pickerContainer: {
    width: '100%',
    backgroundColor: '#333',
    borderRadius: 5,
    overflow: 'hidden',
  },
  picker: {
    color: 'white',
    backgroundColor: '#444',
    height: 40,
  },
  goButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1e90ff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 180,
    alignSelf: 'center',
  },
  goButtonText: {
    color: 'white',
    fontSize: 18,
  },
  bottomNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#222',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  activeNavButton: {
    backgroundColor: '#1e90ff',
  },
  navText: {
    color: 'white',
    fontSize: 16,
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  screenText: {
    color: 'white',
    fontSize: 24,
  },
});