import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  BackHandler,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import CalendarIcon from 'react-native-vector-icons/Fontisto';
import DatePicker from 'react-native-datepicker';
// import {Picker} from '@react-native-community/picker';
import RNPickerSelect from 'react-native-picker-select';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {UPDATE_USER, UPDATE_PHONE_NUMBER} from '../graphql/mutation';
import {GET_USER_FOR_EDIT_PAGE} from '../graphql/query';
import {useMutation, useQuery} from '@apollo/client';
import {Auth, Hub} from 'aws-amplify';
import CustomAlert from '../components/CustomAlert';
import moment from 'moment';
import SCREENS from '../../SCREENS';
import Avatar from '../assets/images/avatar.png';
// import LocalImageUpload from '../screens/CreateMetaWorld/LocalImageUpload';
import RNFetchBlob from 'rn-fetch-blob';
import uuid from 'react-native-uuid';
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-crop-picker';

export default function EditProfile({navigation}) {
  navigation.setOptions({
    headerStyle: {
      elevation: 0,
      backgroundColor: '#252525',
    },
    headerLeft: () => (
      <Icon
        name="ios-arrow-back"
        size={30}
        color="#0fb6cd"
        style={styles.iconMargin}
        onPress={() => navigation.goBack()}
      />
    ),
  });

  const [user, setUser] = useState(null);
  const [confirmSignIn, setConfirmSignIn] = useState(false);
  const [isModal, setModal] = useState(false);
  const [imageUploadModal, setImageUploadModal] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [isNavigation, setNavigation] = useState(true);
  const [showCodeBlock, setShowCodeBlock] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showEditButton, setShowEditButton] = useState(true);
  const [displayAlert, setDisplayAlert] = useState(false);
  const [editPhone, setEditPhone] = useState(false);
  const [alertMessage, setAlertMessage] = useState(
    'Phone number already exist.',
  );
  const [userId, setuserId] = useState(null);
  const [phoneNumberLength, setPhoneNumberLength] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(null);
  const [attributes, setAttributes] = useState(null);
  const [userDetail, setUserDetail] = useState({
    id: userId,
    name: '',
    age: '',
    gender: '',
    phoneNumber: '',
    dob: '',
    userPhoto: null,
    emailId: '',
  });

  async function userfunc() {
    const usr = await AsyncStorage.getItem('userId');
    setuserId(usr);
  }

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((data) => {
        // facebook user won't have attributes. Only cognito record
        // created with phone number will have attribues.
        console.warn(data.attributes, 'attributes');

        setAttributes(data.attributes);
        // console.warn(data.signInUserSession.accessToken, 'datadatadata');
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    userfunc();
  }, []);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate(SCREENS.MENU);
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  });

  useQuery(GET_USER_FOR_EDIT_PAGE, {
    variables: {
      id: userId,
    },
    onCompleted: (data) => {
      console.log('data profile', data);
      const numberLength = data.getUser.phoneNumber.length;
      console.warn(numberLength, 'numberLEngth');
      if (numberLength >= 14) {
        setEditPhone(true);
        setShowEditButton(false);
      } else {
        setShowEditButton(true);
      }

      setPhoneNumberLength(numberLength);
      setUserDetail({
        id: data.getUser.id,
        name: data.getUser.name,
        age: data.getUser.age,
        phoneNumber: data.getUser.phoneNumber,
        dob: data.getUser.dob,
        gender: data.getUser.gender,
        userPhoto: data.getUser.url,
        emailId: data.getUser.email,
      });
    },
    fetchPolicy: 'network-only',
  });

  // console.warn('user=/>', userId);

  const [updateUser] = useMutation(UPDATE_USER);
  const [sendCode] = useMutation(UPDATE_PHONE_NUMBER);

  const facebookSignIn = () => {
    setModal(false);
    Hub.listen('auth', ({payload: {event, data}}) => {
      console.log(event, 'event');
      console.log(data, 'data');
      switch (event) {
        // case 'signIn_failure':
        //   setAlertMessage('Facebook successfully linked to account');
        //   setDisplayAlert(true);
        //   setTimeout(() => {
        //     setDisplayAlert(false);
        //   }, 3000);
        //   break;

        case 'customState_failure':
          setAlertMessage('Facebook successfully linked to account');
          setDisplayAlert(true);
          setTimeout(() => {
            setDisplayAlert(false);
          }, 3000);
          break;
      }
    });

    Auth.federatedSignIn({provider: 'Facebook'});
  };

  const sendOtp = async (phoneNumber) => {
    console.warn(phoneNumber, 'updatePhoneNumber');
    // signing out the federated user so that the nornal
    // user pool user can signin and verify the new phone number.

    console.warn(userDetail.phoneNumber, 'userDetail');

    console.warn(editPhone, 'editPhone');

    if (!attributes) {
      console.warn('signinIn');
      await Auth.signIn(userDetail.phoneNumber, 'Litt@123');
    }

    console.log('Sending code');

    await sendCode({
      variables: {
        userId: userId,
        phoneNumber: phoneNumber,
      },
    })
      .then((data) => {
        console.log(data.data.updatePhoneNumber, 'data');
        if (
          data.data.updatePhoneNumber.error.indexOf(
            'An account with the given phone_number already exists.',
          ) !== -1
        ) {
          setShowCodeBlock(false);
          setDisplayAlert(true);
          setAlertMessage('User Already Exisits.');
          setTimeout(() => {
            setDisplayAlert(false);
          }, 5000);
        }
      })
      .catch((err) => {
        setDisplayAlert(true);
        setAlertMessage('Something went wrong. Please try again.');
        setTimeout(() => {
          setDisplayAlert(false);
        }, 5000);
        console.log(err, 'err');
      });
  };

  const resendOtpCode = (phoneNumber) => {
    const phoneNumberToConfirm = `+91${phoneNumber}`;
    Auth.verifyCurrentUserAttribute('phone_number')
      .then((data) => {
        const user = `+91${phoneNumber}`;
        console.warn(data, 'confirmSignUpOTP');
      })
      .catch((err) => {
        console.warn('err', err);
      });
  };

  const handleUpdateUser = async (values, actions) => {
    setIsSubmitting(true);
    console.log(values, 'values');

    let updateParams = {
      id: userId,
      name: values.userName,
      dob: values.dob,
      gender: values.gender,
      phoneNumber: values.phoneNumber,
    };

    console.log(selectedImg, 'selectedImg.filename');

    if (selectedImg) {
      const [, , , extension] = /([^.]+)(\.(\w+))?$/.exec(
        selectedImg.filename ? selectedImg.filename : selectedImg.uri,
      );
      const key = `${uuid()}${extension && '.'}${extension}`;
      console.warn('values===>', key);

      const newFile = {
        region: 'ap-south-1',
        bucket,
        key: `user/${key}`,
        localUri: await convertFileUri(selectedImg.uri),
        mimeType: 'image/jpeg',
      };
      console.log('newFile===>', newFile);

      updateParams = {
        id: userId,
        name: values.userName,
        dob: values.dob,
        gender: values.gender,
        phoneNumber: values.phoneNumber,
        url: `https://${bucket}.s3.ap-south-1.amazonaws.com/user/${key}`,
        file: newFile,
      };
    }

    updateUser({
      variables: {
        input: updateParams,
      },
    })
      .then((data) => {
        navigation.navigate('TabNavigator', {screen: SCREENS.HOME});
        setIsSubmitting(false);
      })
      .catch((error) => {
        console.log(error);
        setIsSubmitting(false);
      });
  };

  const takePicture = () => {
    console.log('takePicture');

    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      compressImageQuality: 0.8,
    }).then((image) => {
      console.log(image.path);
      const selectedImg = {uri: image.path};
      setSelectedImg(selectedImg);
      setImageUploadModal(false);
    });
  };

  const pickImageFrmGallery = () => {
    console.log('pickImageFrmGallery');
    ImagePicker.openPicker({
      compressImageMaxHeight:400,
      compressImageMaxHeight:400,
      cropping: true,
      compressImageQuality: 0.8,
    }).then((image) => {
      console.log(image.path);
      const selectedImg = {uri: image.path};
      setSelectedImg(selectedImg);
      setImageUploadModal(false);
    });
  };

  const formValidation = Yup.object().shape({
    userName: Yup.string()
      .required('Required')
      .matches(
        /(^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z ]*)*$)/g,
        'Please enter a valid name',
      ),
    gender: Yup.string()
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

    code: Yup.string()
      .matches(/(^[^a-zA-Z]*$)/g, 'Please enter a valid phone number')
      .min(6, 'Please enter a valid phone number')
      .max(6, 'Please enter a valid phone number'),
    // dob: Yup.string().required('Required'),
  });

  let bucket = 'littimages';

  console.warn('selectedImg', selectedImg);

  const convertFileUri = async (fileUri) => {
    const data = await RNFetchBlob.fs.readFile(fileUri, 'base64');
    return Buffer.from(data, 'base64');
  };

  const placeholder = {label: 'Select Gender', value: null, color: '#252525'};

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="position"
      keyboardVerticalOffset={-110}>
      {/* {showImageUpload ? (
        <LocalImageUpload
          setNavigation={setNavigation}
          isNavigation={isNavigation}
          setImageError={setImageError}
          setSelectedImg={setSelectedImg}
          setModal={setModal}
          setShowImageUpload={setShowImageUpload}
        />
      ) : null} */}
      <ScrollView>
        <Formik
          enableReinitialize={true}
          initialValues={{
            userName: userDetail.name ? userDetail.name : '',
            dob: userDetail.dob,
            gender: userDetail.gender ? userDetail.gender : '',
            phoneNumber:
              userDetail.phoneNumber.length > 13
                ? ''
                : userDetail.phoneNumber
                ? userDetail.phoneNumber.indexOf('+91') === -1
                  ? userDetail.phoneNumber
                  : userDetail.phoneNumber.slice(3)
                : '',
            code: '',
            showConFirmationCode: false,
            phoneNumberUpdated: false,
          }}
          onSubmit={handleUpdateUser}
          validationSchema={formValidation}>
          {({
            touched,
            errors,
            handleChange,
            handleSubmit,
            setFieldValue,
            values,
          }) => (
            <View style={styles.container}>
              <View style={styles.imageContainer}>
                <TouchableOpacity onPress={() => setImageUploadModal(true)}>
                  {userDetail.userPhoto ? (
                    <Image
                      source={
                        selectedImg
                          ? {uri: selectedImg.uri}
                          : {uri: userDetail.userPhoto}
                      }
                      style={styles.avatar}
                    />
                  ) : (
                    <Image
                      source={selectedImg ? {uri: selectedImg.uri} : Avatar}
                      style={styles.avatar}
                    />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={() => setModal(true)}>
                  <LinearGradient colors={['#3b5998', '#3b5998']}>
                    <Text style={styles.buttonText}>Link Facebook</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              <View style={styles.inputContainer}>
                <View>
                  <Text style={styles.label}>Name</Text>
                </View>
                <View style={styles.textInput}>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange('userName')}
                    value={values.userName}
                    placeholderTextColor="#cccfd2"
                    placeholder="Username"
                  />
                </View>
                {errors.userName && touched.userName && (
                  <View style={styles.messageContainer}>
                    <Text style={styles.message}>{errors.userName}</Text>
                  </View>
                )}
                <View>
                  <Text style={styles.label}>Date of birth</Text>
                  <View style={styles.textInput}>
                    <DatePicker
                      style={{width: '100%', color: '#eeeeee'}}
                      date={
                        values.dob
                          ? moment(values.dob).format('ll')
                          : '05-01-1971'
                      }
                      // showIcon={false}
                      iconComponent={
                        <CalendarIcon
                          size={25}
                          color="#06b5d2"
                          name="date"
                          style={styles.icon}
                        />
                      }
                      mode="date"
                      androidMode="spinner"
                      placeholder="Select your DOB"
                      format="ll"
                      maxDate={new Date()}
                      confirmBtnText="Set"
                      cancelBtnText="Cancel"
                      customStyles={{
                        dateIcon: {
                          position: 'absolute',
                          left: 0,
                          top: 4,
                          marginRight: 20,
                        },
                        dateInput: {
                          borderWidth: 0,
                          borderBottomWidth: 0.75,
                          borderBottomColor: '#06b5d2',
                          marginTop: 12,
                        },
                        dateText: {
                          color: '#eeeeee',
                          fontSize: 18,
                        },
                      }}
                      onDateChange={(date) => {
                        setFieldValue('dob', new Date(`${date}`).toISOString());
                      }}
                    />
                  </View>
                  {errors.dob && touched.dob && (
                    <View style={styles.messageContainer}>
                      <Text style={styles.message}>{errors.dob}</Text>
                    </View>
                  )}
                </View>

                <View>
                  <Text style={styles.label}>Gender</Text>
                </View>
                <View style={styles.pickerView}>
                  <RNPickerSelect
                    onValueChange={(itemValue, itemIndex) => {
                      setFieldValue('gender', itemValue);
                    }}
                    style={pickerStyle}
                    value={values.gender}
                    placeholder={placeholder}
                    items={[
                      {label: 'Female', value: 'female', color: '#252525'},
                      {label: 'Male', value: 'male', color: '#252525'},
                      {label: 'Other', value: 'other', color: '#252525'},
                    ]}
                  />
                </View>
                {/* <View style={styles.pickerView}>
                  <Picker
                    selectedValue={values.gender}
                    style={{height: 50, width: 100 }}
                    onValueChange={(itemValue, itemIndex) => {
                      setFieldValue('gender', itemValue);
                    }}>
                      <Picker.Item
                      label={values.gender ? values.gender : 'Gender'}
                      value={values.gender ? values.gender : ''}
                    />
                    <Picker.Item label="Female" value="female" />
                    <Picker.Item label="Male" value="male" />
                    <Picker.Item label="Other" value="other" />
                  </Picker>
                </View> */}
                {errors.gender && touched.gender && (
                  <View style={styles.messageContainer}>
                    <Text style={styles.message}>{errors.gender}</Text>
                  </View>
                )}

                <View>
                  <Text style={styles.label}>Phone number</Text>
                </View>
                <View style={styles.textInput}>
                  <TextInput
                    style={styles.input}
                    onChangeText={(event) => {
                      console.warn(event);
                      setFieldValue('phoneNumber', event);
                      if (event.length < 10) {
                        setFieldValue('showConFirmationCode', false);
                      }

                      if (event.length >= 10) {
                        setShowCodeBlock(true);
                      }
                    }}
                    value={values.phoneNumber}
                    placeholderTextColor="#cccfd2"
                    placeholder="Phone number"
                    keyboardType="number-pad"
                    editable={editPhone}
                  />

                  {showEditButton ? (
                    !editPhone ? (
                      <TouchableOpacity
                        onPress={() => {
                          if (!attributes && phoneNumberLength <= 15) {
                            setDisplayAlert(true);
                            setAlertMessage(
                              'You are logged in as facebook user. Please signin with your number to update it',
                            );
                            setTimeout(() => {
                              setDisplayAlert(false);
                            }, 5000);
                          } else {
                            setEditPhone(true);
                          }
                        }}
                        style={styles.editBtnWidth}>
                        <LinearGradient
                          colors={['#eeeeee', '#eeeeee']}
                          style={styles.editButton}>
                          <Text style={styles.buttonTextEdit}>Edit Number</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity style={styles.editBtnWidth}>
                        <LinearGradient
                          colors={['#06b5d2', '#3ebdb4']}
                          style={styles.editButton}>
                          <Text style={styles.buttonTextEdit}>Edit Number</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    )
                  ) : null}
                </View>
                {errors.phoneNumber && touched.phoneNumber && (
                  <View style={styles.messageContainer}>
                    <Text style={styles.message}>{errors.phoneNumber}</Text>
                  </View>
                )}

                {!values.phoneNumberUpdated &&
                showCodeBlock &&
                values.showConFirmationCode ? (
                  <>
                    <View style={styles.textInput}>
                      <TextInput
                        style={styles.input}
                        onChangeText={handleChange('code')}
                        value={values.code}
                        placeholderTextColor="#cccfd2"
                        placeholder="Enter Confirmation Code"
                        keyboardType="number-pad"
                      />
                    </View>
                    {errors.code && touched.code && (
                      <View style={styles.messageContainer}>
                        <Text style={styles.message}>{errors.code}</Text>
                      </View>
                    )}
                  </>
                ) : null}

                {!(
                  ((phoneNumberLength >= 13 && editPhone) ||
                    phoneNumberLength <= 14) &&
                  values.phoneNumber.length === 10 &&
                  showCodeBlock
                ) ? (
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('TabNavigator', {
                          screen: SCREENS.MENU,
                        })
                      }
                      style={styles.btnWidth}>
                      <LinearGradient
                        colors={['#eeeeee', '#eeeeee']}
                        style={styles.button}>
                        <Text style={styles.buttonTextTwo}>Discard</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                    {!isSubmitting ? (
                      <TouchableOpacity
                        onPress={handleSubmit}
                        style={styles.btnWidth}>
                        <LinearGradient
                          start={{x: 1, y: 0}}
                          end={{x: 0, y: 0}}
                          colors={['#06b5d2', '#3ebdb4']}
                          style={styles.button}>
                          <Text style={styles.buttonTextTwo}>Save</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity style={styles.btnWidth}>
                        <LinearGradient
                          start={{x: 1, y: 0}}
                          end={{x: 0, y: 0}}
                          colors={['#C0C0C0', '#A9A9A9']}
                          style={styles.button}>
                          <Text style={styles.buttonTextTwo}>Saving...</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    )}
                  </View>
                ) : values.showConFirmationCode ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '90%',
                      justifyContent: 'space-between',
                    }}>
                    <TouchableOpacity
                      style={styles.changeNumBtnWidth}
                      onPress={() => {
                        console.warn(values.code, 'code');
                        const parsedCode = values.code.toString();

                        const params = {
                          AttributeName: 'phone_number' /* required */,
                          Code: parsedCode /* required */,
                        };
                        if (parsedCode) {
                          console.log(params, 'params');
                          Auth.verifyCurrentUserAttributeSubmit(
                            'phone_number',
                            parsedCode,
                          )
                            .then((data) => {
                              setEditPhone(false);
                              setDisplayAlert(true);
                              setAlertMessage(
                                'Phone number updated. You can now login using your mobile number',
                              );
                              setTimeout(() => {
                                setDisplayAlert(false);
                              }, 5000);
                              setShowCodeBlock(false);
                              setFieldValue('showConFirmationCode', true);
                              console.warn(data, 'data');
                            })
                            .catch((err) => {
                              setEditPhone(false);
                              setDisplayAlert(true);
                              console.log(err.message);
                              if (
                                err.message ===
                                'Invalid verification code provided, please try again.'
                              ) {
                                setAlertMessage(
                                  'Invalid OTP, please try again.',
                                );
                                setTimeout(() => {
                                  setDisplayAlert(false);
                                }, 7000);
                                setConfirmSignIn(true);
                              } else {
                                setAlertMessage(
                                  'Phone number updated. You can now login using your mobile number',
                                );
                                setTimeout(() => {
                                  setDisplayAlert(false);
                                }, 7000);
                                setShowCodeBlock(false);
                              }
                              setFieldValue('showConFirmationCode', true);
                              console.warn(err, 'err');
                            });
                        }
                      }}>
                      <LinearGradient
                        start={{x: 1, y: 0}}
                        end={{x: 0, y: 0}}
                        colors={['#C0C0C0', '#A9A9A9']}
                        style={styles.button}>
                        <Text style={styles.buttonTextTwo}>Confirm OTP</Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.changeNumBtnWidth}
                      onPress={() => {
                        console.warn(phoneNumberLength);
                        resendOtpCode(values.phoneNumber);
                        setFieldValue('showConFirmationCode', true);
                      }}>
                      <LinearGradient
                        start={{x: 1, y: 0}}
                        end={{x: 0, y: 0}}
                        colors={['#C0C0C0', '#A9A9A9']}
                        style={styles.button}>
                        <Text style={styles.buttonTextTwo}>Resend OTP</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.changeNumBtnWidth}
                    onPress={() => {
                      console.warn(phoneNumberLength);
                      if (
                        userDetail.phoneNumber !== `+91${values.phoneNumber}`
                      ) {
                        sendOtp(values.phoneNumber);
                        setFieldValue('showConFirmationCode', true);
                      } else {
                        setDisplayAlert(true);
                        setAlertMessage('You forgot to change the number');
                        setTimeout(() => {
                          setDisplayAlert(false);
                        }, 5000);
                      }
                    }}>
                    <LinearGradient
                      start={{x: 1, y: 0}}
                      end={{x: 0, y: 0}}
                      colors={['#C0C0C0', '#A9A9A9']}
                      style={styles.button}>
                      <Text style={styles.buttonTextTwo}>Send OTP</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
      <Modal isVisible={isModal} animationIn="zoomIn">
        <View style={styles.modalView}>
          <TouchableOpacity
            style={styles.closeButtonView}
            onPress={() => setModal(false)}>
            <Text style={styles.closeButton}>x</Text>
          </TouchableOpacity>
          <View style={styles.modalMargin}>
            <Text style={styles.modalTextTitle}>
              Please link facebook with the same email Id as
            </Text>
            <Text style={styles.modalText}>{userDetail.emailId}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                facebookSignIn();
              }}>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={['#06b5d2', '#3ebdb4']}
                style={styles.modalButtonTextView}>
                <Text style={styles.modalButtonText}>Proceed</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal isVisible={imageUploadModal} animationIn="zoomIn">
        <View style={styles.modalView}>
          <TouchableOpacity
            style={styles.closeButtonView}
            onPress={() => setImageUploadModal(false)}>
            <Text style={styles.closeButton}>x</Text>
          </TouchableOpacity>
          <View style={styles.modalMargin}>
            <Text style={styles.modalTextTitle}>
              Choose an Option
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                // facebookSignIn();
                takePicture();
              }}>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={['#06b5d2', '#3ebdb4']}
                style={styles.ImagemodalButtonTextView}>
                <Text style={styles.modalButtonText}>Take Picture</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                // facebookSignIn();
                pickImageFrmGallery();
              }}>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={['#06b5d2', '#3ebdb4']}
                style={styles.ImagemodalButtonTextView}>
                <Text style={styles.modalButtonText}>
                  Pick image from Gallary
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {displayAlert && <CustomAlert displayText={alertMessage} />}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252525',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderColor: 'white',
    borderRadius: 100,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    color: '#eeeeee',
  },
  inputContainer: {
    flex: 0.75,
    width: '90%',
  },
  modalButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '60%',
  },
  modalButtonText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '800',
    color: '#252525',
  },
  modalButtonTextView: {
    margin: 25,
    padding: 10,
    borderRadius: 25,
    width: '50%',
  },
  ImagemodalButtonTextView: {
    margin: 25,
    padding: 10,
    borderRadius: 25,
    width: '100%',
  },
  modalText: {
    fontSize: 20,
    color: '#0fb6cd',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
  },
  modalTextTitle: {
    fontSize: 20,
    color: '#eeeeee',
    // fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
  },
  closeButtonView: {marginRight: 20},
  modalMargin: {
    // margin: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    textAlign: 'right',
    fontSize: 20,
    color: '#0fb6cd',
    marginTop: 5,
    fontWeight: 'bold',
  },
  modalView: {
    flex: 0.4,
    backgroundColor: '#181818',
    // margin: 30,
    borderRadius: 15,
    justifyContent: 'center',
  },
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
    textTransform: 'capitalize',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  btnWidth: {width: '40%'},
  changeNumBtnWidth: {width: '40%'},
  editBtnWidth: {width: '35%'},
  icon: {
    padding: 13,
    // marginRight:10,
    borderColor: '#06b5d2',
    borderBottomWidth: 0.75,
  },
  linkButton: {
    padding: 5,
    width: 200,
    borderRadius: 15,
    marginTop: 10,
  },
  button: {
    padding: 10,
    borderRadius: 25,
    width: '100%',
  },
  editButton: {
    padding: 10,
    marginTop: 10,
    borderRadius: 15,
    width: '100%',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  iconMargin: {padding: 10, marginLeft: 10},
  label: {
    fontSize: 18,
    color: '#0fb6cd',
  },
  pickerView: {
    borderBottomWidth: 0.75,
    borderBottomColor: '#06b5d2',
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#eeeeee',
  },
  textInput: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  datePickerStyle: {width: '100%', color: '#eeeeee'},
  buttonTextTwo: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
  },
  buttonTextEdit: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '800',
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

const pickerStyle = {
  inputAndroid: {
    fontSize: 18,
    paddingTop: 13,
    paddingHorizontal: 10,
    paddingBottom: 12,
    // borderWidth: 2,
    // borderColor: '#ffbd2f',
    borderRadius: 8,
    // backgroundColor: 'white',
    color: '#eeeeee',
  },
  inputIOS: {
    fontSize: 18,
    paddingTop: 13,
    paddingHorizontal: 10,
    paddingBottom: 12,
    // borderBottomWidth: 2,
    // borderColor: '#ffbd2f',
    borderRadius: 8,
    // backgroundColor: 'white',
    color: '#eeeeee',
  },
};
