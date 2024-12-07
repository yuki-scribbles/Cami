// App.tsx
import React from 'react';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View, Switch, Alert, Modal, Image, ScrollView, Dimensions} from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker'
import { PinchGestureHandler, PinchGestureHandlerGestureEvent, GestureHandlerRootView } from 'react-native-gesture-handler';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapView, {Marker} from 'react-native-maps';
import { FontAwesome } from '@expo/vector-icons';
import Carousel from 'react-native-reanimated-carousel';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

// These are for Firebase Authentication
import { initializeApp,} from 'firebase/app';
import { getDatabase, ref, child, get} from 'firebase/database';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { red } from 'react-native-reanimated/lib/typescript/Colors';


const firebaseConfig = {
  apiKey: "AIzaSyD4GPtrN1J6fmAvOE0aoOManp1ySO3YdBM",
  authDomain: "cami-9ed69.firebaseapp.com",
  databaseURL: "https://cami-9ed69-default-rtdb.firebaseio.com",
  projectId: "cami-9ed69",
  storageBucket: "cami-9ed69.firebasestorage.app",
  messagingSenderId: "546492429326",
  appId: "1:546492429326:web:fd536d63f6f076d247785f",
  measurementId: "G-VHT606X84T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);


type SeverityLevel = 'Low' | 'Medium' | 'High';

const { width: screenWidth } = Dimensions.get('window');

type RootTabParamList = {
  Scan: undefined;
  Profile: undefined;
  Cars: undefined;
  Maps: undefined;
  Login: undefined;
  SignUp: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createStackNavigator();

type ScanScreenProps = BottomTabScreenProps<RootTabParamList, 'Scan'>;
// Scan Screen
const ScanScreen: React.FC<ScanScreenProps> = ({ navigation }) => {
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
      `Data: ${data}, Type: ${type}`,
      [
        {
          text: "Go to Cars",
          onPress: () => navigation.navigate('Cars'),
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
        {/* <TouchableOpacity style={styles.tabButton} onPress={() => setSelectedScanType("LicensePlate")}>
          <Text style={styles.tabText}>License Plate</Text>
        </TouchableOpacity> */}
      </View>

      <View style={styles.controlContainer}>
        <TouchableOpacity style={styles.scanButton} onPress={() => setScanned(false)}>
          <FontAwesome name="plus" size={24} color="black" />
          <Text style={styles.scanText}>Scan</Text>
        </TouchableOpacity>


        {/* <View style={styles.optionRow}>
          <Text style={styles.optionText}>Military</Text>
          <Switch
            value={isMilitary}
            onValueChange={() => setIsMilitary(!isMilitary)}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isMilitary ? "#f5dd4b" : "#f4f3f4"}
          />
          <Text style={styles.optionText}>Rental</Text>
        </View> */}

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

// Car View Screen
const CarScreen = ({navigation, route}) => {
  const carId = 'TY1234'; // when this is switched to be called by another page, this needs to be changed to route.params
  const [carData, setCarData] = useState(null);
  const [carDamages, setCarDamages] = useState(null);
  const [isDetails, setIsDetails] = useState(true);
  
  useEffect(() => {
    // Function to retrieve data for a specific item
    const fetchItemData = async () => {
      try {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, 'Cars/'+carId)); // Specify the path to the item
        if (snapshot.exists()) {
          setCarData(snapshot.val());
        } else {
          console.log('No data available');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchItemData();
  }, []);

  useEffect(() => {
    // Function to retrieve data for a specific item
    const fetchItemData = async () => {
      try {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, 'Damages/'+carId)); // Specify the path to the item
        if (snapshot.exists()) {
          setCarDamages(snapshot.val());
        } else {
          console.log('No data available');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchItemData();
  }, []);

  const toggleDetails = () => {
    if (!isDetails) setIsDetails(!isDetails); // Switch to details
  };
  const toggleDamage = () => {
    if (isDetails) setIsDetails(!isDetails); // Switch to damages
  };

  return (
    <View style={styles.carViewContainer}>
      {/* Car Info Section */}
      <View style={styles.carImageContainer}>
        {carData ? (
        <>
          {/* placeholder car image */}
          <Image source={require('./assets/car.webp')} style={styles.carouselImage}></Image>

          {/* details / damage selector*/}
          <View style={styles.carButtonContainer}>
            <TouchableOpacity style={[styles.carInfoButton, {backgroundColor: isDetails ? '#687bb1' : '#3c4660'}]} onPress={toggleDetails}>
              <Text style={styles.carInfoButtonText}>Car Info</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.carInfoButton, {backgroundColor: !isDetails ? '#687bb1' : '#3c4660'}]} onPress={toggleDamage}>
              <Text style={styles.carInfoButtonText}>Reports</Text>
            </TouchableOpacity>
          </View>

          {/* actual car detail information */}
          <View style={styles.carInfoContainer}>
            { isDetails ?(
            <>
              <View style={styles.leftColumn}>
                <Text style={styles.carInfoText}>Model: </Text>
                <Text style={styles.carInfoText}>Year: </Text>
                <Text style={styles.carInfoText}>Liscence Plate: </Text>
                <Text style={styles.carInfoText}>MPG: </Text>
                <Text style={styles.carInfoText}>Features: </Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.carInfoText}>{carData.model}</Text>
                <Text style={styles.carInfoText}>{carData.year}</Text>
                <Text style={styles.carInfoText}>{carData.licensePlate}</Text>
                <Text style={styles.carInfoText}>{carData.mpg} </Text>
                <Text style={styles.carInfoText}>{carData.features}</Text>
              </View>
            </>
            ) : (
              <>
              <View style={styles.leftColumn}>
                <Text style={styles.carInfoText}>Rear Door: </Text>
                <Text style={styles.carInfoText}>Windshield: </Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.carInfoText}>{carDamages.rearDoor}</Text>
                <Text style={styles.carInfoText}>{carDamages.Windshield}</Text>

              </View>
            </>
            )} 
          </View>

          {/* Map View Button */}
          <TouchableOpacity style={styles.mapViewButton} onPress={()=>navigation.navigate('Maps', { latitude: carData.latitude, longitude: carData.longitude })}>
            <Text style={styles.mapViewButtonText}>Map View</Text>
          </TouchableOpacity>
        </>
        ) : (
          <Text style={styles.loadingMsg}>Loading...</Text>
        )}
      </View>

      

    </View>
  );
};

// Maps Screen
const MapsScreen = ({ route }) => {
  const {latitude, longitude} = route.params;
  const initialRegion = {
    latitude: latitude,         // Center latitude
    longitude: longitude,       // Center longitude
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
          latitude: latitude,
          longitude: longitude,
        }}
        title="Starting Point" // Optional: Title shown on tap
        description="This is the starting center point." // Optional: Description shown on tap
      />
    </MapView>
  );
};

const LoginScreen = ({navigation}) =>{

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // function that actually handles login
  const handleLogin = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          // Handle authentication state change
          onAuthStateChanged(auth, (user) => {
            if (user) {
              // User is signed in, log the UID and redirect to HomeNav
              navigation.navigate("Tabs");
            } else {
              alert("Invalid ID or Password");
              // User is signed out, handle accordingly
              navigation.navigate("Login")// Redirect to Login
            }
          });
        })
        .catch((error) => {
          const errorMessage = error.message;
          alert(errorMessage);
        });
  };

  return (
    <View style={styles.Logincontainer}>
      <Image source={require('./assets/Cami Logo.png')} style={styles.loginLogo}></Image>
      <Text style={styles.loginTitle}>Login</Text>
      <Text style={styles.loginText}>Please sign in to continue</Text>
      <TextInput style={styles.loginInput} placeholder='Enter your email' autoFocus={false} onChangeText={setEmail}></TextInput>
      <TextInput style={styles.loginInput} placeholder='Enter your password' secureTextEntry={true} autoFocus={false} onChangeText={setPassword}></TextInput>

      {/* actual Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={() => handleLogin(email, password)}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      {/* Link to Sign In Page */}
      <Text style={styles.signupText}>Dont have an account?</Text>
      <TouchableOpacity style={styles.signupLink} onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signupLinkText}>Click here to Sign Up!</Text>
      </TouchableOpacity>
    </View>
  );
};

const SignUpScreen = ({navigation}) =>{

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegistration = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            navigation.navigate("Tabs");
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
          });
  };

  return (
    <View style={styles.Logincontainer}>
      <Image source={require('./assets/Cami Logo.png')} style={styles.loginLogo}></Image>
      <Text style={styles.loginTitle}>Register Now!</Text>
      <Text style={styles.loginText}>Please provide your information to continue</Text>
      <TextInput style={styles.loginInput} placeholder='Enter your email' autoFocus={false} onChangeText={setEmail}></TextInput>
      <TextInput style={styles.loginInput} placeholder='Enter your password' autoFocus={false} secureTextEntry={true} onChangeText={(setPassword)}></TextInput>

      {/* actual Register Button */}
      <TouchableOpacity style={styles.loginButton} onPress={() => handleRegistration(email, password)}>
        <Text style={styles.loginButtonText}>Register</Text>
      </TouchableOpacity>

      {/* Link to Log In Page */}
      <Text style={styles.signupText}>Already have an account?</Text>
      <TouchableOpacity style={styles.signupLink} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginLinkText}>Click here to Log In!</Text>
      </TouchableOpacity>
    </View>
  );
};

// Tab Navigator, which will be used as a screen inside the Stack Navigator
function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ //this is what contains all the info for navbar styling
      headerShown: false,
      tabBarStyle: { backgroundColor: '#000', height: 72 },
      tabBarInactiveTintColor: '#fff',
      tabBarActiveTintColor: '#fff',
      tabBarLabelStyle: {fontSize: 20, textAlign: 'center'},
      tabBarIconStyle: {display: 'none'},
      
    }}
    initialRouteName='Scan'
  >
    <Tab.Screen name="Profile" component={ProfileScreen} />
    <Tab.Screen name="Scan" component={ScanScreen} />
    <Tab.Screen name="Cars" component={CarScreen} />
    </Tab.Navigator>
  );
}

// App Component
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Tabs">
        {/* Tab Navigator is now a screen inside the Stack Navigator */}
        <Stack.Screen name="Tabs" component={MyTabs} options={{headerShown: false}} />
        {/* Additional Stack Screens */}
        <Stack.Screen name="Maps" component={MapsScreen} options={{headerShown: false}} />
        <Stack.Screen name="Login" component={LoginScreen} options = {{headerShown: false}}/>
        <Stack.Screen name="SignUp" component={SignUpScreen} options = {{headerShown: false}}/>
      </Stack.Navigator>
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
    flex: 0.8, // Occupy 65% of the screen
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
  carouselContainer: {
    marginBottom: 20,
  },
  carouselImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  carModel: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  carDetails: {
    fontSize: 16,
    color: '#aaaaaa',
    textAlign: 'center',
    marginTop: 5,
  },
  damageContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  damageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#2e2e2e',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  damageText: {
    color: 'white',
    fontSize: 16,
  },
  severityText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  severityLow: {
    color: '#4caf50',
  },
  severityMedium: {
    color: '#ff9800',
  },
  severityHigh: {
    color: '#f44336',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  Logincontainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: 16,
    alignItems: 'center',
  },
  loginInput: {
    width: '80%',
    height: 50,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderColor: '#555',
    borderRadius: 8,
    borderWidth: 0.5,
    marginBottom: 8,
    bottom: 100,

    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // Android Shadow
    elevation: 10,
  },
  loginTitle: {
    color: 'black',
    alignSelf: 'flex-start',
    left: 40,
    fontWeight: 'bold',
    fontSize: 25,
    marginBottom: 6,
    bottom: 60,
  },
  loginText: {
    height: 25,
    color: 'black',
    alignSelf: 'flex-start',
    left: 40,
    marginBottom: 40,
    bottom: 60,
  },
  loginButton: {
    backgroundColor: '#c9f0ff',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
    bottom: 75,
  },
  loginButtonText: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
  },
  signupText: {
    position: 'absolute', //ignore the flexbox alignment
    height: 25,
    color: 'black',
    left: 67,
    bottom: 0,
    marginBottom: 30,
  },
  signupLink: {
    position: 'absolute',
    right: 67,
    bottom: 0,
    marginBottom: 37,
  },
  signupLinkText: {
    color: 'blue',
  },
  loginLinkText: {
    left: 8,
    color: 'blue',
  },
  loginLogo: {
    bottom: 130,
    right: 0,
    left: 0,
    alignSelf: 'center',
  },
  carButtonContainer: {
    flexDirection: 'row', // Align items in a row
    justifyContent: 'space-evenly', // Space between the buttons
    alignItems: 'center',
    paddingTop:5,
    paddingBottom: 15,
    backgroundColor: 'white'
  },
  carInfoButton: {
    flex: 1, // Equal button widths
    backgroundColor: '#3c4660',
    paddingVertical: 15, // Vertical padding
    borderRadius: 0, // Rounded corners
    alignItems: 'center', // Center text horizontally
  },
  carDamagesButton: {
    flex: 1, // Equal button widths
    backgroundColor: '#687bb1',
    paddingVertical: 15, // Vertical padding
    borderRadius: 0, // Rounded corners
    alignItems: 'center', // Center text horizontally
  },
  carInfoButtonText: {
    color: 'white',
    fontSize: 18,
  },
  carViewContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  carImageContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  mapViewButton:{
    position: 'absolute', // Equal button widths
    bottom: 0,
    width: '100%',
    backgroundColor: '#3c4660',
    height: '7%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapViewButtonText:{
    fontSize: 18,
    color: 'white',
    alignSelf: 'center',
  },
  carInfoContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    height: '30%',
    marginHorizontal: 5,
  },
  leftColumn: {
    borderColor: 'black',
    borderWidth: 0.5,
    width: '40%',
  },
  rightColumn: {
    borderColor: 'black',
    borderWidth: 0.5,
    width: '60%',
  },
  carInfoText: {
    flex: 1,
    flexDirection: 'column',
    color: 'black',
    fontSize: 16,
    marginVertical: 4,
    marginLeft: 7,
  },
  loadingMsg: {
    position: 'absolute',
    top: '50%',
    left: '40%',
    fontSize: 20,
  }
});

export default App;
