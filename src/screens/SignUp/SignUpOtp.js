import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import {Auth} from 'aws-amplify';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import OtpInput from '../../components/OtpInput';
import SCREENS from '../../../SCREENS';

const SignUpOtp = ({user, phonenumber, navigation}) => {
  console.warn(user, 'user');
  console.warn(phonenumber, 'phonenumber');

  const [isFilled, setFilled] = useState(false);
  const [code, setCode] = useState('');
  const [resendOtp, setResendOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const confirmSignUp = () => {
    setFilled(false);
    setIsSubmitting(true);
    Auth.confirmSignUp(phonenumber, code)
      .then((data) => {
        Auth.signIn(phonenumber, 'Litt@123')
          .then((userData) => {
            Auth.setPreferredMFA(userData, 'SMS')
              .then(async (res) => {
                await AsyncStorage.setItem(
                  'userId',
                  userData.signInUserSession.idToken.payload.sub,
                );
                console.log('res', res);
                navigation.navigate(SCREENS.WELCOME);
              })
              .catch((err) => {
                alert(`${err.message}`);
              });
          })
          .catch((err) => {
            alert(`${err.message}`);
          });
      })
      .catch((err) => {
        alert(`${err.message}`);
        setFilled(false);
      });
    setResendOtp(true);
  };

  const resendOtpCode = () => {
    Auth.resendSignUp(user)
      .then((data) => {
        console.warn(data, 'confirmSignUpOTP');
      })
      .catch((err) => {
        console.warn('err', err);
      });
  };

  return (
    <>
      <View style={styles.otpcontainer}>
        <Text style={styles.title}>Enter OTP</Text>

        {/* <OTPInputView
        pinCount={6}
        style={styles.otpView}
        codeInputFieldStyle={styles.underlineStyleBase}
        onCodeFilled={(code) => {
          setCode(code);
          setFilled(true);
        }}
      /> */}

        <OtpInput code={code} setCode={setCode} />

        {code.length == 6 ? (
          !isSubmitting ? (
            <TouchableOpacity style={styles.btnWidth} onPress={confirmSignUp}>
              <LinearGradient
                start={{x: 1, y: 0}}
                end={{x: 0, y: 0}}
                colors={['#06b5d2', '#3ebdb4']}
                style={styles.button}>
                <Text style={styles.btnSubmit}>Submit</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.btnWidth}>
              <LinearGradient
                start={{x: 1, y: 0}}
                end={{x: 0, y: 0}}
                colors={['#35383b', '#1e403a']}
                style={styles.button}>
                <Text style={styles.btnSubmit}>Submitting..</Text>
              </LinearGradient>
            </TouchableOpacity>
          )
        ) : (
          <View style={styles.btnWidth}>
            <LinearGradient
              start={{x: 1, y: 0}}
              end={{x: 0, y: 0}}
              colors={['#35383b', '#1e403a']}
              style={styles.button}>
              <Text style={styles.btnSubmit}>Submit</Text>
            </LinearGradient>
          </View>
        )}
        <TouchableOpacity onPress={resendOtpCode} style={styles.btnWidth}>
          <Text style={styles.resendButtonText}>Resend OTP</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  btnWidth: {width: '90%'},
  resendButtonText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#0fb6cd',
    textDecorationLine: 'underline',
  },
  textInput: {fontSize: 20, color: 'white', letterSpacing: 28},
  inputBorderContainer: {flexDirection: 'row', justifyContent: 'center'},
  inputBorderView: {
    height: 2,
    backgroundColor: 'red',
    width: '8%',
    marginTop: 2,
    marginHorizontal: 6,
  },
  otpcontainer: {
    flex: 1,
    backgroundColor: '#252525',
    justifyContent: 'center',
    alignItems: 'center',
  },
  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: '#06b5d2',
  },
  title: {
    fontSize: 16,
    color: '#eeeeee',
  },
  otpView: {
    width: '50%',
    height: 100,
  },
  button: {
    margin: 25,
    padding: 10,
    borderRadius: 25,
  },
  btnSubmit: {textAlign: 'center', fontSize: 16, fontWeight: '800'},
  btnWidth: {width: '90%'},
});

export default SignUpOtp;
