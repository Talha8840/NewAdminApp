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
import UserIcon from 'react-native-vector-icons/AntDesign';
import EmailIcon from 'react-native-vector-icons/Fontisto';
import PhoneIcon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import {Formik} from 'formik';
import * as Yup from 'yup';
import CheckBox from 'react-native-check-box';
import {Auth} from 'aws-amplify';
import CustomAlert from '../../components/CustomAlert';
import SignUpOtp from './SignUpOtp';
import SCREENS from '../../../SCREENS';
import logoImg from '../../assets/images/logo.png';

export default function SignUpIndex({navigation}) {
  const [user, setUser] = useState(null);
  const [askCode, setAskCode] = useState(false);
  const [customAlert, setCustomAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(false);
  const [phonenumber, setPhonenumber] = useState(null);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate(SCREENS.SIGNIN_ENTRY);
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
      .then(() => navigation.navigate(SCREENS.WELCOME))
      .catch((err) => console.log(err));
  });
  const formValidation = Yup.object().shape({
    name: Yup.string()
      .required('Required')
      .matches(
        /(^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z ]*)*$)/g,
        'Please enter a valid name',
      ),
    phoneNumber: Yup.string()
      .required('Required')
      .matches(/(^[^a-zA-Z]*$)/g, 'Please enter a valid phone number')
      .min(10, 'Please enter a valid phone number')
      .max(10, 'Please enter a valid phone number'),
    email: Yup.string().email().required('Required'),
    agree: Yup.string()
      .required('Required')
      .matches(/(^[^false])/g, 'Click agree to continue ...'),
  });
  const signUp = (values, setSubmitting) => {
    Auth.signUp({
      username: `+91${values.phoneNumber}`,
      password: 'Litt@123',
      attributes: {
        email: values.email,
        phone_number: `+91${values.phoneNumber}`,
        name: values.name,
      },
    })
      .then((data) => {
        console.log(data.user.userSub);
        setPhonenumber(`+91${values.phoneNumber}`);
        setUser(data.user.username);
        setAskCode(true);
      })
      .catch((err) => {
        console.log(err.message);
        if (
          err.message ===
          'An account with the given phone_number already exists.'
        ) {
          setAlertMessage('phone number already exists');
          setCustomAlert(true);
          setTimeout(() => {
            setCustomAlert(false);
            setSubmitting(false);
          }, 3000);
        }
        if (
          err.message === 'PreSignUp failed with error emailId already exists.'
        ) {
          setAlertMessage('Email already exists');
          setCustomAlert(true);
          setTimeout(() => {
            setCustomAlert(false);
            setSubmitting(false);
          }, 3000);
        }
      });
  };

  return askCode ? (
    <SignUpOtp user={user} navigation={navigation} phonenumber={phonenumber} />
  ) : (
    <View style={styles.container}>
      <Formik
        enableReinitialize={true}
        initialValues={{
          name: '',
          phoneNumber: '',
          email: '',
          password: 'Litt@123',
          agree: false,
        }}
        onSubmit={(values, {setSubmitting}) => {
          if (
            values.name.length === 0 ||
            values.email.length === 0 ||
            values.phoneNumber.length === 0
          ) {
            setAlertMessage('Fill all the fields');
            setCustomAlert(true);
            setTimeout(() => {
              setCustomAlert(false);
            }, 3000);
            setSubmitting(false);
          } else if (!values.agree) {
            setAlertMessage('Click agree to continue ...');
            setCustomAlert(true);
            setTimeout(() => {
              setCustomAlert(false);
            }, 3000);
            setSubmitting(false);
          } else {
            signUp(values, setSubmitting);
          }
        }}
        validationSchema={formValidation}>
        {({
          touched,
          errors,
          handleChange,
          handleSubmit,
          values,
          setFieldValue,
          isSubmitting,
        }) => (
          <>
            <View style={styles.logoContainer}>
              <Image source={logoImg} style={styles.logo} />
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.subContainer}>
                <UserIcon
                  size={25}
                  color="#06b5d2"
                  name="user"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange('name')}
                  value={values.name}
                  placeholderTextColor="#cccfd2"
                  placeholder="Username"
                />
              </View>
              {errors.name && touched.name && (
                <View style={styles.messageContainer}>
                  <Text style={styles.message}>{errors.name}</Text>
                </View>
              )}
              <View style={styles.subContainer}>
                <PhoneIcon
                  size={25}
                  color="#06b5d2"
                  name="phone"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange('phoneNumber')}
                  value={values.phoneNumber}
                  placeholderTextColor="#cccfd2"
                  placeholder="Phone number"
                  keyboardType="number-pad"
                />
              </View>
              {errors.phoneNumber && touched.phoneNumber && (
                <View style={styles.messageContainer}>
                  <Text style={styles.message}>{errors.phoneNumber}</Text>
                </View>
              )}
              <View style={styles.subContainer}>
                <EmailIcon
                  size={25}
                  color="#06b5d2"
                  name="email"
                  style={styles.icon}
                />
                <TextInput
                  keyboardType="email-address"
                  style={styles.input}
                  onChangeText={handleChange('email')}
                  value={values.email}
                  placeholderTextColor="#cccfd2"
                  placeholder="Email Id"
                />
              </View>
              {errors.email && touched.email && (
                <View style={styles.messageContainer}>
                  <Text style={styles.message}>{errors.email}</Text>
                </View>
              )}
              <View style={styles.row}>
                <CheckBox
                  style={styles.checkbox}
                  onClick={() => setFieldValue('agree', !values.agree)}
                  isChecked={values.agree}
                  rightText={'I accept the terms and conditions'}
                  rightTextStyle={{
                    fontSize: 14,
                    color: '#eeeeee',
                    fontWeight: '800',
                    fontFamily: 'SFUIDisplay-Medium',
                  }}
                  checkBoxColor="#06b5d2"
                />
              </View>
              {errors.agree && touched.agree && (
                <View style={styles.messageContainer}>
                  <Text style={styles.message}>{errors.agree}</Text>
                </View>
              )}
              {!isSubmitting ? (
                <TouchableOpacity onPress={handleSubmit}>
                  <LinearGradient
                    start={{x: 1, y: 0}}
                    end={{x: 0, y: 0}}
                    colors={['#06b5d2', '#3ebdb4']}
                    style={styles.button}>
                    <Text style={styles.btnText}>Create Account</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                <LinearGradient
                  start={{x: 1, y: 0}}
                  end={{x: 0, y: 0}}
                  colors={['#35383b', '#1e403a']}
                  style={styles.button}>
                  <Text style={styles.btnTextTwo}>Signing up ...</Text>
                </LinearGradient>
              )}
            </View>
            {customAlert && <CustomAlert displayText={alertMessage} />}
          </>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252525',
  },
  otpcontainer: {
    flex: 1,
    backgroundColor: '#252525',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flex: 0.45,
    marginTop: 30,
    alignItems: 'center',
  },
  logo: {
    width: '50%',
    height: '50%',
  },
  inputContainer: {
    flex: 0.75,
    margin: 25,
    marginTop: -45,
  },
  subContainer: {flexDirection: 'row', marginBottom: 15},
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    borderColor: '#06b5d2',
    borderBottomWidth: 0.75,
    fontSize: 18,
    color: '#eeeeee',
    fontWeight: '800',
    fontFamily: 'SFUIDisplay-Medium',
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
  icon: {
    padding: 10,
    borderColor: '#06b5d2',
    borderBottomWidth: 0.75,
  },
  hidePasswordIcon: {
    padding: 10,
    marginTop: 5,
    borderColor: '#06b5d2',
    borderBottomWidth: 0.75,
  },
  button: {
    margin: 25,
    padding: 10,
    borderRadius: 25,
  },
  btnSubmit: {textAlign: 'center', fontSize: 16, fontWeight: '800'},
  btnTextTwo: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#bbc3c2',
    fontFamily: 'SFUIDisplay-Semibold',
  },
  btnWidth: {width: '90%'},
  btnText: {
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
  row: {flexDirection: 'row'},
  checkbox: {flex: 1, padding: 10},
});
