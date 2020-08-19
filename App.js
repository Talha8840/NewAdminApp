import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {StatusBar, Platform, View, StyleSheet, Linking} from 'react-native';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import StackNavigator from './src/components/StackNavigator';
import AsyncStorage from '@react-native-community/async-storage';
import {ApolloProvider} from '@apollo/client';
import createAppsyncClient from './src/utils/client';
import Amplify, {Auth} from 'aws-amplify';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import OneSignal from 'react-native-onesignal';
const client = createAppsyncClient();

async function urlOpener(url, redirectUrl) {
  await InAppBrowser.isAvailable();
  const {type, url: newUrl} = await InAppBrowser.openAuth(url, redirectUrl, {
    showTitle: false,
    enableUrlBarHiding: true,
    enableDefaultShare: false,
    ephemeralWebSession: false,
  });

  if (type === 'success') {
    Linking.openURL(newUrl);
  }
}

Amplify.configure({
  Auth: {
    identityPoolId: 'ap-south-1:c5f5542a-897a-46a3-b131-b730090d02f0',
    region: 'ap-south-1',
    identityPoolRegion: 'ap-south-1',
    userPoolId: 'ap-south-1_SUnj12pWl',
    userPoolWebClientId: '3m46nrq8k24055jo9ajq01l6g1',
  },
  oauth: {
    domain: 'auth.litttheapp.com',
    scope: ['email', 'profile', 'openid'],
    redirectSignIn: 'myapp://',
    redirectSignOut: 'myapp://',
    responseType: 'token',
    urlOpener,
  },
});

console.disableYellowBox = true;

const App = () => {
  useEffect(() => {
    OneSignal.init('910b8196-e25f-4ade-8476-e9a4495c1c88');
    OneSignal.enableVibrate(true);
    OneSignal.addEventListener('received', (data) => {
        console.log(data);
        console.log('sent')

    });
    OneSignal.inFocusDisplaying(2);
    return unmount();
  }, []);
  const unmount = ()=>{
    OneSignal.removeEventListener('received');
  }
  const [user, setUser] = useState(null);

  const getAuthenticatedUser = async () => {
    try {
      const data = await Auth.currentAuthenticatedUser();
      const {sub} = data.signInUserSession.idToken.payload;

      console.log('data', data);
      setUser(data);

      try {
        await AsyncStorage.setItem('userId', sub);
      } catch (asyncErr) {
        console.log('AsyncStorage Error:', asyncErr);
      }
    } catch (authErr) {
      console.log('Auth Error:', authErr);
    }
  };

  useEffect(() => {
    getAuthenticatedUser();
  }, []);

  return (
    <ApolloProvider client={client}>
      <StatusBar barStyle="dark-content" hidden />
      <View style={styles.navigationContainer}>
        <NavigationContainer theme={DarkTheme}>
          <StackNavigator user={user} />
        </NavigationContainer>
      </View>
    </ApolloProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  navigationContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
});
