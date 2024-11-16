import React, { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Switch } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Picker } from '@react-native-picker/picker';
import { PinchGestureHandler, PinchGestureHandlerGestureEvent, GestureHandlerRootView } from 'react-native-gesture-handler';

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
    const newScale = lastScale * event.nativeEvent.scale;
    if (newScale >= 1 && newScale <= 3) {
      setScale(newScale);
    }
  };

  const onPinchStateChange = (event: { nativeEvent: { state: number; }; }) => {
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

        <View style={styles.alignmentFrame} />
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
        
        <Picker
          selectedValue={scanType}
          style={styles.dropdown}
          onValueChange={(itemValue) => setScanType(itemValue)}
          itemStyle={styles.pickerItem}
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
    marginTop: 40,
  },
  camera: {
    width: '90%',
    height: '90%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  alignmentFrame: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    width: '80%',
    height: '30%',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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