import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Auth} from 'aws-amplify';
import AsyncStorage from '@react-native-community/async-storage';

import SCREENS from '../../SCREENS';

export default function Menu({navigation}) {
  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <TouchableOpacity
          style={styles.closeButtonView}
          onPress={() => {
            navigation.navigate('TabNavigator', {screen: SCREENS.HOME});
          }}>
          <Text style={styles.closeButton}>x</Text>
        </TouchableOpacity>
        <View style={styles.subContainerOne}>
          <TouchableOpacity
            style={styles.bottom}
            onPress={() => {
              navigation.navigate(SCREENS.PROFILE);
            }}>
            <Text style={styles.listText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottom}
            onPress={() => {
              navigation.navigate(SCREENS.ABOUT);
            }}>
            <Text style={styles.listText}>About Us</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottom}>
            <Text style={styles.listText}>Report</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottom}
            onPress={() => {
              Auth.signOut().then(async () => {
                navigation.navigate(SCREENS.SIGNIN_ENTRY);

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

                    try {
                      await AsyncStorage.setItem('onBoard', 'true');
                    } catch (e) {
                      console.log("Failed to Set Item: onBoard === 'true'", e);
                    }
                  } catch (e) {
                    console.log(
                      'Failed To Remove App Specific Keys From AS',
                      e,
                    );
                  }
                } catch (e) {
                  console.log('Failed To Get All The Keys From AS', e);
                }
              });
            }}>
            <Text style={styles.listText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252525',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subContainer: {
    flex: 0.4,
    width: '75%',
    backgroundColor: '#1d1d1d',
    borderRadius: 15,
  },
  closeButtonView: {marginRight: 20},
  button: {
    margin: 25,
    padding: 10,
    borderRadius: 25,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
  },
  closeButton: {
    textAlign: 'right',
    fontSize: 20,
    color: '#0fb6cd',
    marginTop: 5,
    fontWeight: 'bold',
  },
  subContainerOne: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    margin: 20,
  },
  bottom: {marginBottom: 10},
  buttonContainer: {
    flex: 0.55,
    margin: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listText: {color: '#0fb6cd', fontSize: 18},
});
