import {View, Text,TouchableOpacity, TextInput} from 'react-native';
import { styles} from '../App';
import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile } from 'firebase/auth';
import {app, auth} from '../App';

export const LoginScreen = (navigation : any) =>{

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    // function that actually handles login
    const handleLogin = (email : string, password: string) => {
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