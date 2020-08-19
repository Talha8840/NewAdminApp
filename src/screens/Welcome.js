import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  BackHandler,
  NativeModules,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import LinearGradient from 'react-native-linear-gradient';
import {Auth} from 'aws-amplify';
import * as Animatable from 'react-native-animatable';
import {startOfDay} from 'date-fns';
import useEstimateRewards from '../hooks/useEstimateRewards';
import {CREATE_ACTIVITY} from '../graphql/mutation';
import {GET_USER_NAME, USER_ACTIVITY_BY_USERID} from '../graphql/query';
import {useMutation, useQuery} from '@apollo/client';
import SCREENS from '../../SCREENS';
import {fonts} from '../utils/fonts';
import {navigateReward} from '../utils/rewardsNavigation';

export default function Welcome({navigation}) {
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loginActivity, setLoginActivity] = useState(false);

  const [createActivity] = useMutation(CREATE_ACTIVITY);
  const rewards = useEstimateRewards('SIGN_IN', userId);
  const {socioCoins, xps, newLevel, awardData, userData, levelUp} = rewards;
  console.log('userData', userData);
  const [createActivityData, setCreateActivityData] = useState(null);

  const createUserActivityAction = () => {
    return createActivity({
      variables: {
        input: {
          userId: userId,
          actionId: 'SIGN_IN',
          socioCoins,
          xps,
        },
      },
    })
      .then((data) => {
        setCreateActivityData(data);
      })
      .catch((err) => console.warn(err));
  };

  console.warn(userData, 'userData');

  const handleAuthenticatedUser = async () => {
    try {
      const data = await Auth.currentAuthenticatedUser();
      const {sub} = data.signInUserSession.idToken.payload;
      setUserId(sub);
    } catch (authErr) {
      console.log('Auth Error:', authErr);
    }
  };

  useEffect(() => {
    handleAuthenticatedUser();
  }, [userId]); // Very very important to have userId as a dependency

  useEffect(() => {
    const backAction = () => {
      Alert.alert('Hold on!', 'Are you sure you want to exit app?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'YES', onPress: () => BackHandler.exitApp()},
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(async (user) => {
        console.log(user, 'user');
        const dateNow = new Date();
        const startDate = startOfDay(dateNow);
        const startVal = `${+startDate}`;
        const start = await AsyncStorage.getItem('startOfDay');
        setUserName(user.signInUserSession.idToken.payload.name);
        if (!start || start != startVal) {
          setUserId(user.signInUserSession.idToken.payload.sub);
          setLoginActivity(true);
          await createUserActivityAction();
          await AsyncStorage.setItem('startOfDay', startVal);
        }
      })
      .catch((err) => console.log('err==>', err));
  }, []);

  // console.log('userId', userId);

  return (
    <View style={styles.container}>
      <Animatable.Text animation="fadeInDown" style={styles.titleTextOne}>
        Welcome{userData && !userData.getUser.homeCopilot ? ',' : null}
      </Animatable.Text>
      {userData && userData.getUser.homeCopilot ? (
        <Animatable.Text animation="fadeIn" style={styles.titleTextTwo}>
          Back,
        </Animatable.Text>
      ) : null}
      <Animatable.Text animation="fadeIn" style={styles.userName}>
        {userData && userData.getUser.name}
      </Animatable.Text>

      <Animatable.View animation="fadeInUp" style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.btnWidth}
          onPress={() => {
            if (loginActivity) {
              console.log(createActivityData, 'createActivityData');
              navigateReward(navigation, {
                newLevel,
                socioCoins,
                userSocioCoins:
                  userData &&
                  userData.getUser.socioCoins + userData.getUser.spentCoins,
                awardData,
                levelUp,
                screenName: 'WELCOME',
              });
            } else {
              navigation.navigate('TabNavigator', {screen: SCREENS.HOME});
            }
          }}>
          <LinearGradient
            start={{x: 1, y: 0}}
            end={{x: 0, y: 0}}
            colors={['#06b5d2', '#3ebdb4']}
            style={styles.button}>
            <Text style={styles.buttonText}>Proceed</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252525',
    justifyContent: 'center',
  },
  titleTextOne: {
    fontSize: 35,
    color: '#eeeeee',
    textAlign: 'left',
    margin: 20,
    fontWeight: '900',
    fontFamily: 'SFUIDisplay-Semibold',
  },
  titleTextTwo: {
    fontSize: 35,
    color: '#eeeeee',
    textAlign: 'left',
    margin: 20,
    marginTop: -15,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 30,
    color: '#eeeeee',
    textAlign: 'left',
    margin: 20,
    marginTop: -10,
    textTransform: 'capitalize',
    fontWeight: '900',
    fontFamily: 'SFUIDisplay-Semibold',
  },
  btnWidth: {width: '60%'},
  button: {
    margin: 25,
    padding: 10,
    borderRadius: 25,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    // fontWeight: '800',
    fontWeight: '900',
    fontFamily: 'SFUIDisplay-Medium',
  },
  buttonContainer: {
    flex: 0.55,
    margin: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
