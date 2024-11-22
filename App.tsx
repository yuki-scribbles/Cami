// App.tsx
import React from 'react';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Switch, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker'
import { PinchGestureHandler, PinchGestureHandlerGestureEvent, GestureHandlerRootView } from 'react-native-gesture-handler';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapView from 'react-native-maps';
import { FontAwesome } from '@expo/vector-icons';

// Define the tab navigator
const Tab = createBottomTabNavigator();

// Scan Screen
const ScanScreen = () => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isMilitary, setIsMilitary] = useState(false);
  const [scanType, setScanType] = useState("Barcode");
  const cameraRef = useRef(null);

  const [scale, setScale] = useState(1);
  const [lastScale, setLastScale] = useState(1);
  const [scanned, setScanned] = useState(true); // Initialize as true to prevent scanning until button press
  const [selectedScanType, setSelectedScanType] = useState("Barcode");

  useEffect(() => {
    if (permission === null) {
      requestPermission();
    }
  }, [permission]);

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

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const onPinchEvent = (event: PinchGestureHandlerGestureEvent) => {
    const zoomSpeedFactor = 0.1;
    const newScale = lastScale * (1 + (event.nativeEvent.scale - 1) * zoomSpeedFactor);
    if (newScale >= 1 && newScale <= 3) {
      setScale(newScale);
    }
  };

  const onPinchStateChange = (event: { nativeEvent: { state: number } }) => {
    if (event.nativeEvent.state === 5) {
      setLastScale(scale);
    }
  };

  const handleBarcodeScanned = ({ type, data }) => {
    if(scanned) {
      return;
    }
    setScanned(true); // Set scanned to true immediately after a successful scan
    Alert.alert(
      "Scanned Data",
      `Scanned data: ${data} (Type: ${type})`,
      [
        {
          text: "OK",
          onPress: () => setScanned(true), // Reset scanned state only when alert is dismissed
        },
      ]
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.cameraContainer}>
        <PinchGestureHandler onGestureEvent={onPinchEvent} onHandlerStateChange={onPinchStateChange}>
          <CameraView
            style={[styles.camera, { transform: [{ scale }] }]}
            facing={facing}
            ref={cameraRef}
            zoom={scale - 1}
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned} // Conditionally enable scanning
            barcodeScannerSettings={{
              barcodeTypes: ["qr", "pdf417", "aztec", "codabar", "code128", "code39", "datamatrix", "ean13", "ean8", "itf14", "upc_a", "upc_e"],
            }}
          />
        </PinchGestureHandler>
        <View
          style={[
            styles.overlayBorder,
            selectedScanType === "QRCode" ? styles.squareBorder : styles.rectangleBorder,
          ]}
        />
      </View>

      <View style={styles.scannerContainer}>
        <TouchableOpacity style={styles.tabButton} onPress={() => setSelectedScanType("Barcode")}>
          <Text style={styles.tabText}>Barcode</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={() => setSelectedScanType("QRCode")}>
          <Text style={styles.tabText}>QR Code</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={() => setSelectedScanType("LicensePlate")}>
          <Text style={styles.tabText}>License Plate</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.controlContainer}>
        <TouchableOpacity style={styles.scanButton} onPress={() => setScanned(false)}>
          <FontAwesome name="plus" size={24} color="black" />
          <Text style={styles.scanText}>Scan</Text>
        </TouchableOpacity>


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

        {/* <Picker
          selectedValue={scanType}
          style={styles.dropdown}
          onValueChange={(itemValue) => setScanType(itemValue)}
          itemStyle={styles.pickerItem}
        >
          <Picker.Item label="Barcode" value="Barcode" />
          <Picker.Item label="QR Code" value="QRCode" />
          <Picker.Item label="License Plate" value="LicensePlate" />
        </Picker> */}
      </View>
    </GestureHandlerRootView>
  );
}

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
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  cameraContainer: {
    flex: 0.65, // Occupy 65% of the screen
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'black', // Optional for better visualization
  },
  scannerContainer: {
    flex: 0.05, // Adjust to 20% of the screen or your desired size
    flexDirection: 'row',
    justifyContent: 'space-around',
    textAlign: 'auto',
    backgroundColor: '#222',
  },
  controlContainer: {
    flex: 0.15, // Remaining 15% of the screen
    alignItems: 'center',
    paddingVertical: 5,
    backgroundColor: 'black',
  },
  camera: {
    width: '95%', // Full width of the container
    height: '90%', // Full height of the container
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 40,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  optionText: {
    color: 'white',
    fontSize: 16,
    marginHorizontal: 10,
  },
  dropdown: {
    width: '70%',
    height: 40,
    color: 'white',
    backgroundColor: '#333',
    borderRadius: 5,
  },
  pickerItem: {
    height: 40,
  },
  tabContainer: {
    position: 'absolute', 
    bottom: 0, 
    width: '100%', 
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#222',
  },
  tabButton: {
    padding: 10,
    alignItems: 'center',
  },
  tabText: {
    color: 'white',
    fontSize: 18,
  },
  overlayBorder: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'white',
    zIndex: 1,
  },
  squareBorder: {
    width: '70%', // Adjust size as needed
    height: '50%',
    alignSelf: 'center', // Center it within the camera
  },
  rectangleBorder: {
    width: '80%',
    height: '30%',
    alignSelf: 'center', // Center it within the camera
  },
  scanButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: 80,
    height: 80,
    borderRadius: 30, // Makes it circular
    shadowColor: '#000', // Optional: Shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3, // Shadow for Android
    marginBottom: 10,
    marginTop: 10,
  },
  scanText: {
    marginTop: 2, // Space between icon and text
    color: 'black',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default App;
