import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Dimensions,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import CoinIcon from 'react-native-vector-icons/FontAwesome';
import CoinImg from '../../assets/images/SociusCoins.png';
import XpImg from '../../assets/images/XP.png';
import DatePicker from 'react-native-datepicker';
import LocalImageUpload from './LocalImageUpload';
import Camera from './Camera';
import DropdownMetaWorld from '../../components/DropdownMetaWorld';
import DropDownIcon from 'react-native-vector-icons/AntDesign';
import {useMutation} from '@apollo/client';
import {
  CREATE_METAWORLD,
  CREATE_ACTIVITY,
  UPDATE_USER,
} from '../../graphql/mutation';
import {Formik} from 'formik';
import * as Yup from 'yup';
import uuid from 'react-native-uuid';
import RNFetchBlob from 'rn-fetch-blob';
import moment from 'moment';
import useEstimateRewards from '../../hooks/useEstimateRewards';
import SCREENS from '../../../SCREENS';
import AddPhotoImg from '../../assets/images/Add-Photo.png';
import smileyGeniusImg from '../../assets/images/Genius.png';
import {navigateReward} from '../../utils/rewardsNavigation';
import {categories} from '../../utils/categories';
import ImagePicker from 'react-native-image-crop-picker';



const {width, height} = Dimensions.get('window');
const screenHeight = Math.round(Dimensions.get('window').height);

export default function CreateMetaWorld({navigation}) {
  console.log('screenHeight==>', screenHeight/89.6);
  navigation.setOptions({
    headerStyle: {
      elevation: 0,
      backgroundColor: '#ffff',
    },

    headerLeft: () =>
      isNavigation ? (
        <Icon
          name="ios-arrow-back"
          size={30}
          color="#975bc1"
          style={styles.iconPadding}
          onPress={() => navigation.navigate(SCREENS.METAWORLD_MAIN)}
        />
      ) : (
        <Icon
          name="ios-close-circle-outline"
          size={30}
          color="#975bc1"
          style={styles.iconPadding}
          onPress={() => {
            setTakePhoto(false);
            setShowImageUpload(false);
            setNavigation(true);
          }}
        />
      ),
    headerTitle: 'Create your future',
  });
  const [isModal, setModal] = useState(false);
  const [isNavigation, setNavigation] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModal, setSuccessModal] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [isTakePhoto, setTakePhoto] = useState(false);
  const [imageUploadModal, setImageUploadModal] = useState(false);
  const [userId, setuserId] = useState(null);
  const [createActivity] = useMutation(CREATE_ACTIVITY);
  const [updateUser] = useMutation(UPDATE_USER);

  const [metaWorldId, setMetaWorldId] = useState(null);
  const [isDropdown, setDropdown] = useState(false);
  const [imageError, setImageError] = useState(false);
  const rewards = useEstimateRewards('CREATE_METALIFE', userId);
  const {socioCoins, xps, newLevel, awardData, userData, levelUp} = rewards;

  console.warn(userData, 'userData');

  const generateId = () => {
    return uuid();
  };

  useEffect(() => {
    const backAction = () => {
      navigation.navigate(SCREENS.METAWORLD_MAIN);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    (async () => {
      const user = await AsyncStorage.getItem('userId');
      setuserId(user);
      console.log('user', user);
      console.log('useEFFECT');
    })();
    setMetaWorldId(generateId());
    return () => backHandler.remove();
  }, []);

  const [createMetaWorld] = useMutation(CREATE_METAWORLD);

  let bucket = 'littimages';

  console.warn('selectedImg', selectedImg);

  const convertFileUri = async (fileUri) => {
    const data = await RNFetchBlob.fs.readFile(fileUri, 'base64');
    return Buffer.from(data, 'base64');
  };

  const handleCreateMetaWorld = async (values) => {
    console.warn('values', values);
    console.log('selectedImg=}}}', selectedImg);
    if (selectedImg) {
      setIsSubmitting(true);
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

      createMetaWorld({
        variables: {
          input: {
            id: metaWorldId,
            userId: userId,
            name: values.title,
            description: values.description,
            categoryId: values.category,
            materialisationDate: new Date(
              values.materialisationDate,
            ).toISOString(),
            url: `https://${bucket}.s3.ap-south-1.amazonaws.com/user/${key}`,
            file: newFile,
          },
        },
      })
        .then((data) => {
          updateUser({
            variables: {
              input: {
                id: userId,
                socioCoins: userData.getUser.socioCoins - 1000,
                spentCoins: userData.getUser.spentCoins + 1000,
              },
            },
          });
          // setSuccessModal(!isSuccessModal);
          console.warn(data);
          createUserActivity();
        })
        .catch((error) => {
          console.log(error);
          setIsSubmitting(false);
        });
    } else {
      setImageError(true);
    }
  };

  const createUserActivity = () => {
    createActivity({
      variables: {
        input: {
          userId: userId,
          actionId: 'CREATE_METALIFE',
          socioCoins,
          xps,
        },
      },
    })
      .then((data) => {
        setIsSubmitting(false);
        navigation.navigate(SCREENS.METAINTENTION_DESCRIPTION, {
          socioCoins,
          xps,
          metaWorldId,
          newLevel,
          awardData,
          levelUp,
        });
      })
      .catch((err) => setIsSubmitting(false));
  };

  // The below function is for ImagePicker

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
      compressImageMaxHeight: 400,
      compressImageMaxHeight: 400,
      cropping: true,
      compressImageQuality: 0.8,
      mediaType:"photo"
    }).then((image) => {
      console.log("testtttt",image.path);
      const selectedImg = {uri: image.path};
      setSelectedImg(selectedImg);
      setImageUploadModal(false);
      
    });
    
  };

  const formValidation = Yup.object().shape({
    title: Yup.string().required('Required'),
    description: Yup.string()
      .required('Required')
      .max(300, 'Word limit 50 words.'),
    materialisationDate: Yup.string().required('Required'),
    category: Yup.string().required('Required'),
  });
  console.log('re');
  return (
    <View style={styles.containerView}>
      {Platform.OS == 'ios' ? (
        <View style={styles.containerHeader}>
          {isNavigation ? (
            <Icon
              name="ios-arrow-back"
              size={30}
              color="#975bc1"
              style={styles.iconPadding}
              onPress={() => navigation.navigate(SCREENS.METAWORLD_MAIN)}
            />
          ) : (
            <Icon
              name="ios-close-circle-outline"
              size={30}
              color="#975bc1"
              style={styles.iconPadding}
              onPress={() => {
                setTakePhoto(false);
                setShowImageUpload(false);
                setNavigation(true);
              }}
            />
          )}
          <Text style={styles.headerText}>Create your future</Text>
        </View>
      ) : null}


      {/* Below code have to remove this post the other implementation is tested in IOS */}

      {/* {showImageUpload ? (
        <LocalImageUpload
          setNavigation={setNavigation}
          isNavigation={isNavigation}
          setImageError={setImageError}
          setSelectedImg={setSelectedImg}
          setModal={setModal}
          setShowImageUpload={setShowImageUpload}
        />
      ) : null}

      {isTakePhoto ? (
        <View style={styles.cameraView}>
          <View style={styles.overlay}>
            <Camera
              setNavigation={setNavigation}
              isNavigation={isNavigation}
              setImageError={setImageError}
              setSelectedImg={setSelectedImg}
              setTakePhoto={setTakePhoto}
            />
          </View>
        </View>
      ) : null} */}





      <ScrollView contentContainerStyle={styles.containerBody}>
        <Formik
          enableReinitialize={true}
          initialValues={{
            title: '',
            description: '',
            category: '',
            materialisationDate: moment().add(91, 'd').format('ll'),
            image: '',
          }}
          onSubmit={(values) => handleCreateMetaWorld(values)}
          validationSchema={formValidation}>
          {({
            touched,
            errors,
            handleChange,
            handleSubmit,
            setFieldValue,
            values,
          }) => (
            <View >
              <TextInput
                style={styles.input}
                onChangeText={handleChange('title')}
                value={values.title}
                placeholderTextColor="#2e2e2e"
                placeholder="Title"
              />
              {errors.title && touched.title && (
                <View style={styles.messageContainer}>
                  <Text style={styles.message}>{errors.title}</Text>
                </View>
              )}
              <View style={styles.top} />
              <View style={styles.category}>
                <Text style={styles.titleText}>Category</Text>
                <View style={styles.categoryView}>
                  <TouchableOpacity
                    style={styles.rowBetween}
                    onPress={() => setDropdown(!isDropdown)}>
                    {values.category ? (
                      <View style={styles.selectedDropdown}>
                        {categories[values.category].icon}
                        <Text
                          style={[
                            styles.dropdownInitialText,
                            {color: categories[values.category].color},
                          ]}>
                          {values.category}
                        </Text>
                      </View>
                    ) : (
                      <Text style={styles.dropdownInitialText}>
                        Select category
                      </Text>
                    )}
                    <DropDownIcon
                      name="down"
                      style={styles.dropDownIcon}
                      color={'#975bc1'}
                      size={15}
                    />
                  </TouchableOpacity>

                  <View style={styles.bottomLine} />

                  {errors.category && touched.category && (
                    <View style={styles.messageContainer}>
                      <Text style={styles.message}>{errors.category}</Text>
                    </View>
                  )}
                </View>
              </View>
              {isDropdown ? (
                <View
                  style={[
                    styles.rowReverse,
                    Platform.OS == 'ios' ? {zIndex: 100} : null,
                  ]}>
                  <DropdownMetaWorld
                    isDropdown={isDropdown}
                    setDropdown={setDropdown}
                    setFieldValue={setFieldValue}
                  />
                </View>
              ) : null}
                 <View style={styles.top} />
              <TextInput
                multiline={true}
                numberOfLines={4}
                style={styles.textArea}
                blurOnSubmit={true}
                onChangeText={handleChange('description')}
                value={values.description}
                placeholderTextColor="#2e2e2e"
                placeholder="Describe your creation
           What is the texture color?
           What are its measurements?
           How could you feel when have it.
            Be specific! The more detailed it is, the easier it is to manifest."
              />
              {errors.description && touched.description && (
                <View style={styles.messageContainer}>
                  <Text style={styles.message}>{errors.description}</Text>
                </View>
              )}
                 <View style={styles.top} />
              <View style={styles.materialisation}>
                <Text style={styles.titleText}>
                  Planned date of Materialisation
                </Text>
                <DatePicker
                  style={styles.date}
                  date={moment(values.materialisationDate).format('ll')}
                  showIcon={false}
                  mode="date"
                  androidMode="spinner"
                  placeholder="Select date of materialisation"
                  format="ll"
                  minDate={moment().add(91, 'd').format('ll')}
                  confirmBtnText="Set"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateInput: {
                      borderWidth: 0,
                    },
                    dateText: {
                      color: '#2e2e2e',
                      fontSize: 18,
                    },
                  }}
                  onDateChange={(date) => {
                    setFieldValue(
                      'materialisationDate',
                      new Date(`${date}`).toISOString(),
                    );
                  }}
                />
              </View>
              {errors.materialisationDate && touched.materialisationDate && (
                <View style={styles.messageContainer}>
                  <Text style={styles.message}>
                    {errors.materialisationDate}
                  </Text>
                </View>
              )}
                 <View style={styles.top} />
              <View style={styles.imageContainer}>
                <TouchableOpacity
                  onPress={() => setImageUploadModal(true)}
                  style={styles.photo}>
                  {selectedImg ? (
                    <Image
                      source={{uri: selectedImg.uri}}
                      style={styles.selectedImage}
                      resizeMethod="resize"
                      resizeMode="contain"
                    />
                  ) : (
                    <Image
                      source={AddPhotoImg}
                      style={styles.initialImage}
                      resizeMode="contain"
                    />
                  )}
                </TouchableOpacity>
              </View>

              {imageError && (
                <View style={styles.messageContainer}>
                  <Text style={styles.errorUpload}>Please Upload an Image</Text>
                </View>
              )}
   <View style={styles.top} />
              {!isSubmitting ? (
                <TouchableOpacity onPress={handleSubmit}>
                  <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    colors={['#13529f', '#975bc1']}
                    style={styles.doneButton}>
                    <Text style={styles.buttonText}>Submit</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={handleSubmit}>
                  <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    colors={['#C0C0C0', '#A9A9A9']}
                    style={styles.doneButton}>
                    <Text style={styles.buttonText}>Submitting...</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          )}
        </Formik>
      </ScrollView>

      <Modal isVisible={isSuccessModal} animationIn="zoomIn">
        <View style={styles.successModal}>
          <Text style={styles.modalTitle}>Good Job!</Text>
          <Image source={smileyGeniusImg} style={styles.smiley} />
          <Text style={styles.modalTextOne}>You have earned</Text>
          {socioCoins > 0 ? (
            <View style={styles.row}>
              <Text style={styles.modalTextTwo}>+{socioCoins}</Text>
              <Image
                source={CoinImg}
                resizeMode="contain"
                style={styles.iconImg}
              />
            </View>
          ) : null}
          {xps > 0 ? (
            <View style={styles.row}>
              <Text style={styles.modalTextTwo}>+{xps}</Text>
              <Image
                source={XpImg}
                resizeMode="contain"
                style={styles.iconImg}
              />
            </View>
          ) : null}
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              setSuccessModal(!isSuccessModal);
              navigateReward(navigation, {
                newLevel,
                socioCoins,
                userSocioCoins:
                  userData.getUser.socioCoins + userData.getUser.spentCoins,
                awardData,
                levelUp,
                metaWorldId,
                screenName: 'CREATE_META_WORLD',
              });
            }}>
            <LinearGradient
              start={{x: 1, y: 0}}
              end={{x: 0, y: 0}}
              colors={['#06b5d2', '#3ebdb4']}
              style={styles.modalButtonTextView}>
              <Text style={styles.modalButtonText}>Ok</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal isVisible={imageUploadModal} animationIn="zoomIn">
        <View style={styles.modalView}>
          <TouchableOpacity
            style={styles.closeButtonMargin}
            onPress={() => {
              setImageUploadModal(false)
            }}>
            <Text style={styles.closeButton}>x</Text>
          </TouchableOpacity>
          <View style={styles.modal}>
            <TouchableOpacity
              style={styles.btnWidth}
              onPress={() => {
                setNavigation(false);
                setModal(!isModal);
                // setTakePhoto(true);
                takePicture();
              }}>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={['#13529f', '#975bc1']}
                style={styles.button}>
                <Text style={styles.buttonText}>Take Photo</Text>
              </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.orText}>or</Text>
            <TouchableOpacity
              style={styles.uploadBtn}
              onPress={() => {
                // setNavigation(false);
                // setModal(!isModal);
                // setShowImageUpload(true);
                pickImageFrmGallery();
              }}>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={['#13529f', '#975bc1']}
                style={styles.button}>
                <Text style={styles.buttonText}>Upload Photo</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
  },
  photo: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '20%',
    height: '40%',
  },
  date: {
    width: '100%',
    color: '#2e2e2e',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  containerHeader: {
    flex: 0.15,
    flexDirection: 'row',
    margin: 10,
    width: '100%',
    alignItems:'center'
  },
  containerBody: {
    flex: 1,
    margin: 20,
    // justifyContent:'center'
  },
  top: {marginTop:  screenHeight/89.6},
  backNavigationButton: {
    width: 50,
    alignItems: 'center',
    height: 50,
    marginLeft: -20,
  },
  picker: {
    height: 50,
    width: 200,
    color: '#2e2e2e',
  },
  materialisation: {
    alignItems: 'center',
    marginTop: 20,
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  modalView: {
    flex: 0.5,
    backgroundColor: '#ffff',
    margin: 30,
    borderRadius: 15,
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    zIndex: 100,
    left: 0,
    top: 0,
    backgroundColor: 'black',
    width: width,
    height: height - 50,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
    // zIndex: 100
  },
  closeButton: {
    textAlign: 'right',
    fontSize: 20,
    color: '#13529f',
    marginTop: 5,
    fontWeight: 'bold',
  },
  category: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  headerText: {
    color: '#2e2e2e',
    fontSize: 25,
    fontWeight: '900',
    fontFamily: 'PointDEMO-SemiBold',
    textAlign: 'left',
    // marginLeft: 20,
    // marginTop: 5,
  },

  selectedImage: {width: 180, height: 100},
  initialImage: {
    width: 80,
    height: 80,
    justifyContent: 'center',
  },
  imageContainer: {alignItems: 'center', marginTop: 30},
  btnWidth: {width: '90%'},
  containerView: {flex: 1, backgroundColor: '#ffff'},
  cameraView: {flex: 1, height: height},
  iconPadding: {padding: 20},
  closeButtonMargin: {marginRight: 20},
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomLine: {
    borderBottomColor: '#975bc1',
    borderBottomWidth: 0.75,
  },
  categoryView: {width: 180, marginTop: 5},
  dropDownIcon: {marginRight: 10},
  uploadBtn: {width: '90%', marginTop: -5},
  row: {flexDirection: 'row'},
  titleText: {
    fontSize: 20,
    color: '#2e2e2e',
    fontWeight: '900',
    fontFamily: 'PointDEMO-SemiBold',
  },
  dropdownInitialText: {
    color: '#2e2e2e',
    fontSize: 14,
    marginLeft: 10,
    fontFamily: 'PointDEMO-SemiBold',
    fontWeight: '900',
  },
  input: {
    borderColor: '#975bc1',
    borderBottomWidth: 0.75,
    fontSize: 18,
    color: '#2e2e2e',
    fontFamily: 'PointDEMO-SemiBold',
    fontWeight: '900',
    // margin: 20,
  },
  textArea: {
    marginTop: 20,
    fontSize: 16,
    color: '#2e2e2e',
    justifyContent: 'flex-start',
    height: 150,
    backgroundColor: '#f0f0f0',
    textAlignVertical: 'top',
    fontWeight: '900',
    fontFamily: 'PointDEMO-SemiBold',
  },
  button: {
    margin: 25,
    padding: 10,
    borderRadius: 25,
  },
  doneButton: {
    margin: 25,
    padding: 10,
    borderRadius: 25,
    marginTop: 50,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    color: '#eeeeee',
  },
  selectedDropdown: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  orText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    color: '#2e2e2e',
  },

  successModal: {
    flex: 0.6,
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
  },
  modalTitle: {
    marginLeft: 10,
    fontSize: 22,
    color: '#0fb6cd',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
  },
  modalTextOne: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
    margin: 10,
  },
  modalTextTwo: {
    fontSize: 18,
    color: '#0fb6cd',
    fontWeight: '900',
    textAlign: 'center',
    marginRight: 5,
  },
  modalTextThree: {
    fontSize: 18,
    color: '#ff7821',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  smiley: {
    width: 100,
    height: 100,
  },
  modalButtonTextView: {
    margin: 25,
    padding: 10,
    borderRadius: 25,
    width: '50%',
  },
  message: {
    margin: 5,
    fontSize: 14,
    color: '#ff0000',
    fontFamily: 'PointDEMO-SemiBold',
    fontWeight: '900',
  },
  errorUpload: {
    margin: 10,
    fontSize: 14,
    color: '#ff0000',
    fontFamily: 'PointDEMO-SemiBold',
    fontWeight: '900',
  },
  message1: {
    marginTop: -10,
    margin: 5,
    marginBottom: 20,
    fontSize: 14,
    color: '#ff0000',
    fontFamily: 'PointDEMO-SemiBold',
    fontWeight: '900',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconImg: {marginLeft: 5, width: 20, height: 20, marginTop: 2},
});
