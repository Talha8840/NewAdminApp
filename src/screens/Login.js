import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {Auth} from 'aws-amplify';
import * as Animatable from 'react-native-animatable';
import SCREENS from '../../SCREENS';
import Logo from '../assets/images/logo.png';
import SignUpOtp from '../screens/SignUp/SignUpOtp';

export default function Login({navigation}) {
  const [user, setUser] = useState(null);
  const [showSignUpOtp, setShowSignUpOtp] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(null);
  // const [selectedValue, setSelectedValue] = useState('+91');

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => navigation.navigate(SCREENS.WELCOME))
      .catch((err) => console.log(err));

    const backAction = () => {
      navigation.navigate(SCREENS.SIGNIN_ENTRY);
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  });

  const formValidation = Yup.object().shape({
    phoneNumber: Yup.string()
      .required('Required')
      .matches(/(^[^a-zA-Z]*$)/g, 'Please enter a valid phone number')
      .min(10, 'Please enter a valid phone number')
      .max(10, 'Please enter a valid phone number'),
  });

  const resendOtpCode = (phoneNumber) => {
    setPhoneNumber(`+91${phoneNumber}`);
    const phoneNumberToConfirm = `+91${phoneNumber}`;
    Auth.resendSignUp(phoneNumberToConfirm)
      .then((data) => {
        const user = `+91${phoneNumber}`;
        console.warn(data, 'confirmSignUpOTP');
        setShowSignUpOtp(true);
      })
      .catch((err) => {
        console.warn('err', err);
      });
  };

  const signIn = (values, setSubmitting) => {
    const phoneNumber = values.phoneNumber;
    Auth.signIn(`+91${values.phoneNumber}`, 'Litt@123')
      .then((user) => {
        console.log('login', user);
        setUser(user);
        setSubmitting(false);
        navigation.navigate(SCREENS.SIGNIN_OTP, {
          user,
          phoneNumber,
        });
      })
      .catch((err) => {
        console.warn(err, 'error message');
        if (err.message !== 'User is not confirmed.') {
          alert(`${err.message}`);
        }
        if (err.message === 'User is not confirmed.') {
          resendOtpCode(phoneNumber);
        }
        setSubmitting(false);
      });
  };

  return (
    <>
      {showSignUpOtp ? (
        <SignUpOtp
          user={user}
          navigation={navigation}
          phonenumber={phoneNumber}
        />
      ) : (
        <Formik
          enableReinitialize={true}
          initialValues={{
            phoneNumber: '',
          }}
          onSubmit={(values, {setSubmitting}) => {
            if (values.phoneNumber.length == 10) {
              signIn(values, setSubmitting);
            } else {
              alert('Please enter valid phone number');
              setSubmitting(false);
            }
          }}
          validationSchema={formValidation}>
          {({
            touched,
            errors,
            handleChange,
            handleSubmit,
            values,
            isSubmitting,
          }) => {
            return (
              <View style={styles.container}>
                <Animatable.View
                  animation="fadeInDown"
                  style={styles.logoContainer}>
                  <Image source={Logo} style={styles.logo} />
                </Animatable.View>
                <View style={styles.inputContainer}>
                  <View style={styles.row}>
                    <Icon
                      size={25}
                      color="#06b5d2"
                      name="phone"
                      style={styles.icon}
                    />
                    <TextInput
                      style={styles.input}
                      onChangeText={handleChange('phoneNumber')}
                      value={values.phoneNumber}
                      keyboardType="number-pad"
                      placeholder="Phone number"
                      placeholderTextColor="#eeeeee"
                    />
                  </View>
                  {errors.phoneNumber && touched.phoneNumber && (
                    <View style={styles.messageContainer}>
                      <Text style={styles.message}>{errors.phoneNumber}</Text>
                    </View>
                  )}
                  {!isSubmitting ? (
                    <Animatable.View animation="fadeInUp">
                      <TouchableOpacity onPress={handleSubmit}>
                        <LinearGradient
                          start={{x: 1, y: 0}}
                          end={{x: 0, y: 0}}
                          colors={['#06b5d2', '#3ebdb4']}
                          style={styles.button}>
                          <Text style={styles.btnTextOne}>Sign in</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </Animatable.View>
                  ) : (
                    <LinearGradient
                      start={{x: 1, y: 0}}
                      end={{x: 0, y: 0}}
                      colors={['#35383b', '#1e403a']}
                      style={styles.button}>
                      <Text style={styles.btnTextTwo}>Sending OTP...</Text>
                    </LinearGradient>
                  )}
                </View>
              </View>
            );
          }}
        </Formik>
      )}
    </>
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
  inputContainer: {
    flex: 0.55,
    margin: 25,
  },
  row: {flexDirection: 'row'},
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: -10,
    paddingLeft: 0,
    height: 40,
    borderColor: '#06b5d2',
    borderBottomWidth: 0.75,
    fontSize: 18,
    color: '#eeeeee',
    fontWeight: '900',
    fontFamily: 'SFUIDisplay-Medium',
  },
  icon: {
    padding: 6.5,
    borderColor: '#06b5d2',
    borderBottomWidth: 0.75,
  },
  picker: {
    marginTop: -10.25,
    height: 50,
    width: 100,
    borderColor: '#06b5d2',
    borderBottomWidth: 0.75,
  },
  button: {
    margin: 25,
    padding: 10,
    borderRadius: 25,
  },
  btnTextTwo: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#bbc3c2',
  },
  btnTextOne: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'SFUIDisplay-Semibold',
  },
  message: {
    margin: 5,
    fontSize: 14,
    color: '#ff0000',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
