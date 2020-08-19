import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import LinearGradient from 'react-native-linear-gradient';
import OtpInput from '../components/OtpInput';
import CountDown from 'react-native-countdown-component';
import {Auth} from 'aws-amplify';
import SCREENS from '../../SCREENS';

export default function SignInOtp({navigation, route}) {
  const [timerId, setTimerId] = useState(1);
  const [user, setUser] = useState(route.params.user);
  const [resendOtp, setResendOtp] = useState(false);
  const phone = route.params.phoneNumber;
  console.log(route.params.phoneNumber, 'params');
  const [isFilled, setFilled] = useState(false);
  const [isClicked, setClicked] = useState(false);
  const [code, setCode] = useState('');
  const [userId, setuserId] = useState(user.username);

  const confirmSignIn = () => {
    setClicked(true);
    Auth.confirmSignIn(user, code)
      .then(async (data) => {
        await AsyncStorage.setItem('userId', userId);
        navigation.navigate(SCREENS.WELCOME);
      })
      .catch((err) => alert(`${err.message}`));
  };

  const resendOtpCode = () => {
    console.log(phone, 'phone');
    Auth.signIn(`+91${phone}`, 'Litt@123')
      .then((user) => {
        setTimerId(timerId + 1);
        setUser(user);
        setResendOtp(false);
      })
      .catch((err) => alert(`${err.message}`));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <OtpInput code={code} setCode={setCode} />
      {code.length == 6 ? (
        <TouchableOpacity style={styles.btnWidth} onPress={confirmSignIn}>
          <LinearGradient
            start={{x: 1, y: 0}}
            end={{x: 0, y: 0}}
            colors={['#06b5d2', '#3ebdb4']}
            style={styles.button}>
            {!isClicked ? (
              <Text style={styles.btnText}>Submit</Text>
            ) : (
              <Text style={styles.btnText}>Submitting...</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      ) : (
        <View style={styles.containerWidth}>
          <LinearGradient
            start={{x: 1, y: 0}}
            end={{x: 0, y: 0}}
            colors={['#35383b', '#1e403a']}
            style={styles.button}>
            <Text style={styles.btnText}>Submit</Text>
          </LinearGradient>
        </View>
      )}
      {resendOtp ? (
        <TouchableOpacity onPress={resendOtpCode} style={styles.btnWidth}>
          <Text style={styles.resendButtonText}>Resend OTP</Text>
        </TouchableOpacity>
      ) : null}
      <CountDown
        id={timerId}
        until={30}
        size={16}
        showSeparator
        onFinish={() => setResendOtp(true)}
        digitStyle={{backgroundColor: 'transparent'}}
        digitTxtStyle={{color: '#eeeeee'}}
        timeToShow={['M', 'S']}
        timeLabels={false}
        separatorStyle={{color: '#eeeeee'}}
      />
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
  title: {
    fontSize: 16,
    color: '#eeeeee',
    textAlign: 'center',
  },
  otpView: {
    width: '50%',
    height: 100,
  },
  containerWidth: {width: '90%'},
  button: {
    margin: 25,
    padding: 10,
    borderRadius: 25,
  },
  btnText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '900',
    fontFamily: 'SFUIDisplay-Semibold',
  },
  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: '#06b5d2',
  },
  btnWidth: {width: '90%'},
  resendButtonText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#0fb6cd',
    textDecorationLine: 'underline',
    fontWeight: '900',
    fontFamily: 'SFUIDisplay-Semibold',
  },
});
