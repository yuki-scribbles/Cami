import MapView,{ Marker }from "react-native-maps";
import { StyleSheet } from "react-native";

// Maps Screen
export const MapsScreen = () => {
    const initialRegion = {
      latitude: 37.78825,         // Center latitude
      longitude: -122.4324,       // Center longitude
      latitudeDelta: 0.0922,      // Vertical span in degrees (~10 km)
      longitudeDelta: 0.0421,     // Horizontal span in degrees (~5 km)
    };
  
    return (
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={initialRegion}
      >
        {/* Add Marker */}
        <Marker
          coordinate={{
            latitude: initialRegion.latitude,
            longitude: initialRegion.longitude,
          }}
          title="Starting Point" // Optional: Title shown on tap
          description="This is the starting center point." // Optional: Description shown on tap
        />
      </MapView>
    );
  };
  