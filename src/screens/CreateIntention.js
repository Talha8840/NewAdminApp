import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  BackHandler,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DropDownIcon from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import {useMutation} from '@apollo/client';
import {CREATE_TASK, CREATE_ACTIVITY, UPDATE_USER} from '../graphql/mutation';
import {Formik} from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import DropdownIntention from '../components/DropdownIntention';
import useEstimateRewards from '../hooks/useEstimateRewards';
import SCREENS from '../../SCREENS';
import {copilot, walkthroughable, CopilotStep} from 'react-native-copilot';
import {navigateReward} from '../utils/rewardsNavigation';
import {categories} from '../utils/categories';
import Modal from 'react-native-modal';

const WalkthroughableView = walkthroughable(View);
const screenHeight = Math.round(Dimensions.get('window').height);
function CreateIntention({navigation, route, start, copilotEvents}) {
  const userId = route.params.userId;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createIntention] = useMutation(CREATE_TASK);
  const [createActivity] = useMutation(CREATE_ACTIVITY);
  const [isDropdown, setDropdown] = useState(false);
  const rewards = useEstimateRewards('INTENTION_CREATION', userId);
  const {socioCoins, xps, newLevel, awardData, userData, levelUp} = rewards;
  const [secondStepActive] = useState(true);
  const [updateUser] = useMutation(UPDATE_USER);
  const [isModal, setModal] = useState(false);

  console.warn(userData, 'userData');

  const handleCreateIntension = (values) => {
    console.log('val==>', values);
    if (
      values.intentionName == '' ||
      values.description == '' ||
      values.category == '' ||
      values.startDate == '' ||
      values.endDate == ''
    ) {
      setModal(true);
    } else {
      setIsSubmitting(true);
      createIntention({
        variables: {
          input: {
            userId: userId,
            name: values.intentionName,
            description: values.description,
            categoryId: values.category,
            startDate: values.startDate,
            endDate: values.endDate,
            taskType: 'user',
            metaWorldId: 'user',
          },
        },
      })
        .then((data) => {
          createUserActivity();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const createUserActivity = () => {
    createActivity({
      variables: {
        input: {
          userId: userId,
          actionId: 'INTENTION_CREATION',
          socioCoins,
          xps,
        },
      },
    })
      .then((data) => {
        if (data) {
          navigateReward(navigation, {
            newLevel,
            socioCoins,
            userSocioCoins:
              userData.getUser.socioCoins + userData.getUser.spentCoins,
            awardData,
            levelUp,
            screenName: 'CREATE_INTENTION',
          });
        }
      })
      .catch((err) => console.warn(err));
  };
  const formValidation = Yup.object().shape({
    intentionName: Yup.string().required('Required'),
    description: Yup.string()
      .required('Required')
      .max(500, 'Word limit 30 words.'),
    category: Yup.string().required('Required'),
    startDate: Yup.string().required('Required'),
    endDate: Yup.string().required('Required'),
  });

  useEffect(() => {
    const timeOut = setTimeout(() => {
      if (userData && !userData.getUser.createIntentionCopilot) start();
    }, 600);

    copilotEvents.on('stop', () => {
      updateUser({
        variables: {
          input: {
            id: userId,
            createIntentionCopilot: true,
          },
        },
      });
    });
    const backAction = () => {
      navigation.navigate(SCREENS.HOME);
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => {
      backHandler.remove();
      clearTimeout(timeOut);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.containerHeader}>
        <TouchableOpacity
          style={styles.backNavigationButton}
          onPress={() =>
            navigation.navigate('TabNavigator', {screen: SCREENS.HOME})
          }>
          <Icon name="ios-arrow-back" color={'#0fb6cd'} size={30} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Take charge of your life</Text>
      </View>
      <Formik
        enableReinitialize={true}
        initialValues={{
          intentionName: '',
          description: '',
          category: '',
          startDate: '',
          endDate: '',
        }}
        onSubmit={handleCreateIntension}
        // validationSchema={formValidation}
      >
        {({
          touched,
          errors,
          handleChange,
          handleSubmit,
          setFieldValue,
          values,
        }) => (
          <View style={styles.containerBody}>
            <CopilotStep
              active={secondStepActive}
              text="You can choose the Category in which you want to create an Intention."
              order={1}
              name="category">
              <WalkthroughableView style={styles.category}>
                <Text style={styles.titleText}>Category</Text>
                <View style={styles.categoryView}>
                  <TouchableOpacity
                    style={styles.categoryDropdown}
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
                      style={styles.iconMargin}
                      color={'#0fb6cd'}
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
              </WalkthroughableView>
            </CopilotStep>
            {isDropdown ? (
              <View
                style={[
                  styles.rowReverse,
                  Platform.OS == 'ios' ? {zIndex: 100} : null,
                ]}>
                <DropdownIntention
                  isDropdown={isDropdown}
                  setDropdown={setDropdown}
                  setFieldValue={setFieldValue}
                />
              </View>
            ) : null}
            {/* <View style={styles.top} /> */}
            <CopilotStep
              active={secondStepActive}
              text="Give a name to this task. Let's say you have selected Health as your category and you want to exercise everyday. Keep Exercise as the Title."
              order={2}
              name="intentionName">
              <WalkthroughableView
                style={{height: screenHeight / 13, justifyContent: 'center'}}>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange('intentionName')}
                  value={values.intentionName}
                  placeholderTextColor="#cccfd2"
                  placeholder="Intention name"
                />
                {errors.intentionName && touched.intentionName && (
                  <View style={styles.messageContainer}>
                    <Text style={styles.message}>{errors.intentionName}</Text>
                  </View>
                )}
              </WalkthroughableView>
            </CopilotStep>
            <CopilotStep
              text="Research has proven that if you follow a certain routine for 21 DAYS, it becomes part of your lifestyle.Lets select a Start Date and an End Date. When do you want to start this Intention. Remember! The Intention should be atleast for 21 Days."
              order={3}
              name="date">
              <WalkthroughableView style={styles.dateView}>
                <View>
                  <Text style={styles.titleText}>Start Date</Text>
                  <View style={styles.dateContainer}>
                    <DatePicker
                      style={styles.date}
                      date={values.startDate}
                      showIcon={false}
                      mode="date"
                      androidMode="spinner"
                      placeholder="Select Start Date"
                      format="ll"
                      minDate={moment().format('ll')}
                      confirmBtnText="Set"
                      cancelBtnText="Cancel"
                      customStyles={{
                        dateInput: {
                          borderWidth: 0,
                        },
                        dateText: {
                          color: '#eeeeee',
                          fontSize: 17,
                          fontFamily: 'SFUIDisplay-Semibold',
                          fontWeight: '900',
                        },
                      }}
                      onDateChange={(date) => {
                        // setStartDate(date);
                        setFieldValue('startDate', new Date(`${date}`));
                        setFieldValue(
                          'endDate',
                          moment(new Date(`${date}`)).add(21, 'd'),
                        );
                      }}
                    />
                  </View>
                  {errors.startDate && touched.startDate && (
                    <View style={styles.messageContainer}>
                      <Text style={styles.message}>{errors.startDate}</Text>
                    </View>
                  )}
                </View>
                <View>
                  <Text style={styles.endDateText}>End Date</Text>
                  <View style={styles.dateContainer}>
                    <DatePicker
                      style={styles.date}
                      date={values.endDate}
                      showIcon={false}
                      mode="date"
                      androidMode="spinner"
                      placeholder="Select End Date"
                      format="ll"
                      minDate={
                        values.startDate
                          ? moment(values.startDate).add(21, 'd').format('ll')
                          : moment(new Date()).format('ll')
                      }
                      confirmBtnText="Set"
                      cancelBtnText="Cancel"
                      customStyles={{
                        dateInput: {
                          borderWidth: 0,
                        },
                        dateText: {
                          color: '#eeeeee',
                          fontSize: 17,
                          fontFamily: 'SFUIDisplay-Semibold',
                          fontWeight: '900',
                        },
                      }}
                      onDateChange={(date) => {
                        setFieldValue('endDate', new Date(`${date}`));
                      }}
                    />
                  </View>
                  {errors.endDate && touched.endDate && (
                    <View style={styles.messageContainer}>
                      <Text style={styles.message}>{errors.endDate}</Text>
                    </View>
                  )}
                </View>
              </WalkthroughableView>
            </CopilotStep>
            {/* <View style={styles.top} /> */}
            <CopilotStep
              text="Now let's give a detailed and brief description of your Intention. Your description cannot be more than 50 characters. Eg: I want to exercise regularly everyday for 1 hour. "
              order={4}
              name="description">
              <WalkthroughableView
                style={{height: screenHeight / 6, justifyContent: 'center'}}>
                <TextInput
                  multiline={true}
                  blurOnSubmit={true}
                  numberOfLines={4}
                  maxLength={50}
                  style={styles.textArea}
                  onChangeText={handleChange('description')}
                  value={values.description}
                  placeholderTextColor="#cccfd2"
                  placeholder="Type in the Habit that you want to develop in the future."
                />
                {errors.description && touched.description && (
                  <View style={styles.messageContainer}>
                    <Text style={styles.message}>{errors.description}</Text>
                  </View>
                )}
              </WalkthroughableView>
            </CopilotStep>
            <View style={styles.top} />
            {!isSubmitting ? (
              <TouchableOpacity onPress={handleSubmit}>
                <LinearGradient
                  start={{x: 1, y: 0}}
                  end={{x: 0, y: 0}}
                  colors={['#06b5d2', '#3ebdb4']}
                  style={styles.button}>
                  <Text style={styles.buttonText}>Set as New Intention</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity>
                <LinearGradient
                  start={{x: 1, y: 0}}
                  end={{x: 0, y: 0}}
                  colors={['#C0C0C0', '#A9A9A9']}
                  style={styles.button}>
                  <Text style={styles.buttonText}>Submitting...</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        )}
      </Formik>
      <Modal isVisible={isModal} animationIn="zoomIn">
        <View style={styles.modalView}>
          <TouchableOpacity
            style={styles.closeButtonView}
            onPress={() => setModal(false)}>
            <Text style={styles.closeButton}>x</Text>
          </TouchableOpacity>
          <View style={styles.modalMargin}>
            <Text style={styles.modalTextTitle}>
              Please fill all the fields
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModal(false);
              }}>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={['#06b5d2', '#3ebdb4']}
                style={styles.modalButtonTextView}>
                <Text style={styles.modalButtonText}>Ok</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
export default copilot({
  overlay: 'svg',
  animated: true,
  allowSkip: false,
  labels: {
    skip: ' ',
  },
  backdropColor: '#ffffff52',
  tooltipStyle: {
    borderRadius: 10,
    paddingTop: 5,
  },
  verticalOffset: Platform.OS == 'ios' ? 0 : screenHeight / 24.5,
})(CreateIntention);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252525',
    // zIndex:100,
  },
  containerHeader: {
    flex: 0.15,
    flexDirection: 'row',
    margin: 20,
    width: '100%',
    alignItems:'center'
  },
  containerBody: {
    flex: 1,
    margin: 20,
    // marginTop: -30,
    // justifyContent:'center',
    // backgroundColor:'blue'
  },
  modalView: {
    flex: 0.3,
    backgroundColor: '#181818',
    // margin: 30,
    borderRadius: 15,
  },
  modalTextTitle: {
    fontSize: 20,
    color: '#eeeeee',
    // fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    // fontWeight: '900',
    // fontFamily: 'PointDEMO-SemiBold',
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
  modalMargin: {
    margin: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  category: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: screenHeight / 10,
    alignItems: 'center',
  },
  backNavigationButton: {
    width: 50,
    alignItems: 'center',
    height: 50,
    marginLeft: -20,
  },
  headerText: {
    fontSize: 30,
    color: '#eeeeee',
    textAlign: 'left',
    marginTop: -5,
    width: '60%',
    fontWeight: '900',
    fontFamily: 'SFUIDisplay-Semibold',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '900',
    fontFamily: 'SFUIDisplay-Semibold',
  },

  datePicker: {
    width: '80%',
    color: '#2e2e2e',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  endDateText: {
    fontSize: 18,
    color: '#eeeeee',
    marginLeft: 10,
    fontWeight: '900',
    fontFamily: 'SFUIDisplay-Semibold',
  },
  titleText: {
    fontSize: 18,
    color: '#eeeeee',
    fontWeight: '900',
    fontFamily: 'SFUIDisplay-Semibold',
    fontWeight: '900',
  },
  categoryView: {
    width: 180,
    marginTop: 5,
  },
  categoryDropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectedDropdown: {flexDirection: 'row', justifyContent: 'space-evenly'},
  date: {
    fontSize: 16,
    color: '#eeeeee',
    fontFamily: 'SFUIDisplay-Semibold',
    fontWeight: '900',
  },
  input: {
    // marginTop: 30,
    borderColor: '#06b5d2',
    borderBottomWidth: 0.75,
    fontSize: 17,
    color: '#eeeeee',
    fontFamily: 'SFUIDisplay-Semibold',
    fontWeight: '900',
  },
  dropdownInitialText: {
    color: '#eeeeee',
    fontSize: 14,
    marginLeft: 10,
    fontWeight: '900',
    fontFamily: 'SFUIDisplay-Medium',
    fontWeight: '900',
  },
  iconMargin: {marginRight: 10},
  bottomLine: {
    borderBottomColor: '#06b5d2',
    borderBottomWidth: 0.75,
  },
  top: {marginTop: screenHeight/29.86},
  textArea: {
    borderColor: '#06b5d2',
    borderWidth: 0.75,
    fontSize: 16,
    color: '#eeeeee',
    justifyContent: 'flex-start',
    height: Platform.OS == 'ios' ? screenHeight / 6 : null,
    textAlignVertical: 'top',
    fontWeight: '900',
    fontFamily: 'SFUIDisplay-Medium',
    alignItems: 'center',
  },
  button: {
    margin: 25,
    padding: 10,
    borderRadius: 25,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1d1d1d',
    padding: 5,
    marginTop: 10,
    width: '100%',
  },
  modal: {
    flex: 0.6,
    backgroundColor: '#ffff',
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
  row: {flexDirection: 'row'},
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
  modalButtonTextView: {
    margin: 25,
    padding: 10,
    borderRadius: 25,
    width: '50%',
  },
  modalButtonView: {
    margin: 25,
    padding: 10,
    borderRadius: 25,
    width: '100%',
  },
  smiley: {
    width: 100,
    height: 100,
  },
  message: {
    margin: 5,
    fontSize: 14,
    color: '#ff0000',
    marginBottom: -20,
  },
  dateView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginTop: 20,
    // marginBottom: 20,
    height: screenHeight / 6,
    alignItems: 'center',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: -15,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
    // marginTop: -20,
    // zIndex: Platform.OS =='ios' ? 100 : null
  },
});
