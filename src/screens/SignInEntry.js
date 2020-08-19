import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import {Auth, Hub} from 'aws-amplify';
import {Flow} from 'react-native-animated-spinkit';

import SCREENS from '../../SCREENS';

import Logo from '../assets/images/logo.png';

export default function SignInEntry({navigation}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFacebookSignIn, setIsFacebookSignIn] = useState(false);

  useEffect(() => {
    if (isFacebookSignIn) {
      Hub.listen('auth', async ({payload: {event, data}}) => {
        console.warn('event', event);
        console.log('data', data);
        switch (event) {
          case 'signIn':
            console.log('inside facebook signIn', data.attributes);
            console.warn('inside facebook signIn', data.attributes);
            AsyncStorage.setItem(
              'userId',
              data.signInUserSession.idToken.payload.sub,
            );
            setIsLoading(false);
            if (data && !data.attributes) {
              console.warn('inside if block', data.attributes);
              navigation.navigate(SCREENS.WELCOME);
            }
            break;
          case 'signOut':
            setIsLoading(false);
            try {
              const allKeysFromAS = await AsyncStorage.getAllKeys();

              // console.log('All the keys in AsyncStorage', allKeysFromAS);

              // Very very important: Must never use AsyncStorage.clear() anywhere in the app.
              // Libraries like AWS Amplify really depend on caching using AsyncStorage
              // For example, If we use AsyncStorage.clear() during sign out, AWS Pinpoint and push notifications will not work.
              // Refer https://reactnative.dev/docs/asyncstorage#clear
              // Use AsyncStorage.removeItem() or AsyncStorage.multiRemove() instead to clear only your app specific keys.
              const keysToRemoveFromAS = allKeysFromAS.filter((key) => {
                const keyToRemove = !(
                  key.startsWith('aws-amplify-cache') ||
                  key.startsWith('push_token')
                );
                // console.log(keyToRemove);
                return keyToRemove;
              });

              // console.log('keysToRemoveFromAS', keysToRemoveFromAS);

              try {
                await AsyncStorage.multiRemove(keysToRemoveFromAS);
              } catch (e) {
                console.log('Failed To Remove App Specific Keys From AS', e);
              }
            } catch (e) {
              console.log('Failed To Get All The Keys From AS', e);
            }
            break;

          case 'customState_failure':
            console.log('HEllo custom State');
            setTimeout(() => {
              Auth.federatedSignIn({provider: 'Facebook'});
            }, 2000);
            break;
        }
      });
    }

    return () => {
      Hub.remove('auth');
    };
  }, [isFacebookSignIn]);

  const facebookSignIn = () => {
    setIsFacebookSignIn(true);
    setIsLoading(true);
    Auth.federatedSignIn({provider: 'Facebook'});
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={Logo} style={styles.logo} />
      </View>
      {!isLoading ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => navigation.navigate(SCREENS.SIGNUP)}>
            <LinearGradient
              start={{x: 1, y: 0}}
              end={{x: 0, y: 0}}
              colors={['#06b5d2', '#3ebdb4']}
              style={styles.button}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => facebookSignIn()}
            style={{marginTop: -20}}>
            <LinearGradient
              colors={['#3b5998', '#3b5998']}
              style={styles.button}>
              <Text style={styles.buttonTextTwo}>Connect with Facebook</Text>
            </LinearGradient>
          </TouchableOpacity>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Text style={styles.loginTextOne}>Have an account?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(SCREENS.LOGIN)}>
              <Text style={styles.loginTextTwo}>Log In</Text>
            </TouchableOpacity>
          </View>
          <View style={{marginLeft: 50, marginTop: 20}}>
            <TextInput
              style={{fontSize: 20, color: 'white', letterSpacing: 28}}
            />
          </View>
        </View>
      ) : (
        <View style={styles.fbLoadingContainer}>
          <Text style={styles.fbLoadingText}>
            Getting details from facebook...
          </Text>
          <View style={{marginTop: 10}}>
            <Flow size={48} color="#0fb6cd" />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252525',
  },
  logoContainer: {
    flex: 0.45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '50%',
    height: '50%',
  },
  buttonContainer: {
    flex: 0.55,
    margin: 25,
    marginTop: -20,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'SFUIDisplay-Semibold',
  },
  buttonTextTwo: {
    textAlign: 'center',
    fontSize: 16,
    color: '#eeeeee',
    fontWeight: '800',
    fontFamily: 'SFUIDisplay-Semibold',
  },
  button: {
    margin: 25,
    padding: 10,
    borderRadius: 25,
  },
  loginTextOne: {
    fontSize: 16,
    color: '#eeeeee',
    fontWeight: '800',
    fontFamily: 'SFUIDisplay-Semibold',
  },
  loginTextTwo: {
    fontSize: 16,
    marginLeft: 5,
    textAlign: 'left',
    color: '#0fb6cd',
    textDecorationLine: 'underline',
    fontWeight: '800',
    fontFamily: 'SFUIDisplay-Semibold',
  },
  fbLoadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fbLoadingText: {
    textAlign: 'center',
    marginVertical: 'auto',
    color: '#eeeeee',
    fontWeight: '800',
    fontFamily: 'SFUIDisplay-Semibold',
  },
});
