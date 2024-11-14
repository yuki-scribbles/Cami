import { CameraView, CameraType, useCameraPermissions } from 'expo-camera'; // npx expo install expo-camera
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // npm install @react-native-picker/picker
import { PinchGestureHandler, PinchGestureHandlerGestureEvent, GestureHandlerRootView } from 'react-native-gesture-handler'; // npx expo install react-native-gesture-handler

export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isMilitary, setIsMilitary] = useState(false);
  const [scanType, setScanType] = useState("Barcode");
  const cameraRef = useRef(null); // Ref for the camera

  const [scale, setScale] = useState(1); // State to hold the current scale
  const [lastScale, setLastScale] = useState(1); // State to hold the last scale

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

  // Handle pinch gesture
  const onPinchEvent = (event: PinchGestureHandlerGestureEvent) => {
    // Apply a factor to slow down the zoom speed (e.g., 0.5 for half speed)
    const zoomSpeedFactor = 0.1;
    const newScale = lastScale * (1 + (event.nativeEvent.scale - 1) * zoomSpeedFactor);
  
    // Set a limit for scaling (e.g., minimum 1, maximum 3)
    if (newScale >= 1 && newScale <= 3) {
      setScale(newScale);
    }
  };

  const onPinchStateChange = (event: { nativeEvent: { state: number; }; }) => {
    if (event.nativeEvent.state === 5) { // 5 indicates the end of the gesture
      setLastScale(scale); // Update last scale when pinch ends
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
            zoom={scale - 1} // Adjust zoom based on scale (values between 0 and 1 for CameraView)
          />
        </PinchGestureHandler>
      </View>
      <View style={styles.controlContainer}>
        <View style={styles.optionRow}>
          {/* Military/Rental toggle */}
          <Text style={styles.optionText}>Military</Text>
          <Switch
            value={isMilitary}
            onValueChange={() => setIsMilitary(!isMilitary)}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isMilitary ? "#f5dd4b" : "#f4f3f4"}
          />
          <Text style={styles.optionText}>Rental</Text>
        </View>
        {/* Scan type dropdown */}
        <Picker
          selectedValue={scanType}
          style={styles.dropdown}
          onValueChange={(itemValue) => setScanType(itemValue)}
          itemStyle={styles.pickerItem} // Add itemStyle for better item height control
        >
          <Picker.Item label="Barcode" value="Barcode" />
          <Picker.Item label="QR Code" value="QRCode" />
          <Picker.Item label="License Plate" value="LicensePlate" />
        </Picker>
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity style={styles.tabButton}>
          <Text style={styles.tabText}>Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton}>
          <Text style={styles.tabText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton}>
          <Text style={styles.tabText}>Maps</Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginTop: 40, // Push down the camera
  },
  camera: {
    width: '90%',
    height: '90%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  controlContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'black',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10, // Space above the toggle
  },
  optionText: {
    color: 'white',
    fontSize: 16,
    marginHorizontal: 10,
  },
  dropdown: {
    width: '70%', // Make the picker smaller
    height: 40, // Adjust height of the picker
    color: 'white',
    backgroundColor: '#333',
    borderRadius: 5,
  },
  pickerItem: {
    height: 40, // Set item height for better control
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
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
});
