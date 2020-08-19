import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  BackHandler,
  KeyboardAvoidingView,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {useQuery, useMutation} from '@apollo/client';
import {GET_WORLD} from '../../graphql/query';
import {CREATE_TASK, CREATE_ACTIVITY} from '../../graphql/mutation';
import {Formik} from 'formik';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import useEstimateRewards from '../../hooks/useEstimateRewards';
import SCREENS from '../../../SCREENS';

const screenHeight = Math.round(Dimensions.get('window').height);

export default function CreateMetaIntention({navigation, route}) {
  const {
    metaWorldId,
    metaLifeCoins,
    metaLifeXps,
    metaNewLevel,
    metaAwardData,
    metaLevelup,
  } = route.params;

  console.warn('screenHeight', screenHeight);

  const [createIntention] = useMutation(CREATE_TASK);
  const [createActivity] = useMutation(CREATE_ACTIVITY);

  const [userId, setuserId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [materializedData, setMaterializedData] = useState(null);
  const rewards = useEstimateRewards('INTENTION_CREATION', userId);
  const {socioCoins, xps, newLevel, awardData, userData, levelUp} = rewards;

  useQuery(GET_WORLD, {
    variables: {
      id: metaWorldId && metaWorldId,
    },
    onCompleted: (data) => {
      console.warn(data, 'data');
      setMaterializedData(data.getMetaWorld.materialisationDate);
    },
  });

  async function userfunc() {
    const user = await AsyncStorage.getItem('userId');
    setuserId(user);
  }

  console.warn('user=/>', userId);

  useEffect(() => {
    userfunc();
  }, []);

  const handleCreateIntension = async (values, actions) => {
    setIsSubmitting(true);
    createIntention({
      variables: {
        input: {
          userId: userId,
          name: values.intentionName,
          description: values.description,
          categoryId: 'METALIFE',
          startDate: values.startDate,
          endDate: values.endDate,
          taskType: 'meta',
          metaWorldId: metaWorldId,
        },
      },
    })
      .then((data) => {
        console.warn(data);
        // setModal(!isModal);
        createUserActivity();
      })
      .catch((error) => {
        console.log(error);
        setIsSubmitting(false);
      });
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
        console.log(data);
        if (data) {
          navigation.navigate(SCREENS.METAWORLD_CONGRATULATION, {
            metaLifeCoins,
            metaLifeXps,
            newLevel,
            userSocioCoins:
              userData.getUser.socioCoins + userData.getUser.spentCoins,
            awardData,
            levelUp,
            metaNewLevel,
            metaAwardData,
            metaLevelup,
          });
        }
      })
      .catch((err) => console.warn(err));
  };

  useEffect(() => {
    const backAction = () => {
      navigation.navigate(SCREENS.METAINTENTION_DESCRIPTION);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  const formValidation = Yup.object().shape({
    intentionName: Yup.string().required('Required'),
    description: Yup.string().required('Required'),
  });

  return (
    <View style={styles.container}>
      <View style={styles.containerHeader}>
        <TouchableOpacity
          style={styles.backNavigationButton}
          onPress={() =>
            navigation.navigate(SCREENS.METAINTENTION_DESCRIPTION)
          }>
          <Icon name="ios-arrow-back" color={'#975bc1'} size={30} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Take charge of your life</Text>
      </View>
      <Formik
        enableReinitialize={true}
        initialValues={{
          intentionName: '',
          description: '',
          categoryId: 'META_TASK',
          startDate: moment(new Date().toISOString()),
          endDate: moment(materializedData),
        }}
        validationSchema={formValidation}
        onSubmit={handleCreateIntension}>
        {({
          handleChange,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.containerBody}>
            <View style={styles.rowBetween}>
              <Text style={styles.titleText}>Category</Text>
              <View>
                <Text style={styles.categoryText}>Meta Task</Text>
                <View style={styles.bottomLine} />
              </View>
            </View>
            <View style={styles.top} />
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
            <View style={styles.top} />
            <View style={styles.dateView}>
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
                    confirmBtnText="Set"
                    cancelBtnText="Cancel"
                    disabled={true}
                    customStyles={{
                      dateInput: {
                        borderWidth: 0,
                      },
                      dateText: {
                        color: '#2e2e2e',
                        fontSize: 18,
                        fontWeight: '900',
                        fontFamily: 'PointDEMO-SemiBold',
                      },
                    }}
                  />
                </View>
              </View>
              <View>
                <Text style={styles.endDate}>End Date</Text>
                <View style={styles.dateContainer}>
                  <DatePicker
                    style={styles.date}
                    date={values.endDate}
                    showIcon={false}
                    mode="date"
                    androidMode="spinner"
                    placeholder="Select End Date"
                    format="ll"
                    minDate={moment(materializedData)}
                    confirmBtnText="Set"
                    disabled={true}
                    cancelBtnText="Cancel"
                    customStyles={{
                      dateInput: {
                        borderWidth: 0,
                      },
                      dateText: {
                        color: '#2e2e2e',
                        fontSize: 18,
                        fontWeight: '900',
                        fontFamily: 'PointDEMO-SemiBold',
                      },
                    }}
                  />
                </View>
              </View>
            </View>
            <View style={styles.top} />
            <TextInput
              multiline={true}
              blurOnSubmit={true}
              numberOfLines={4}
              maxLength={50}
              style={styles.textArea}
              onChangeText={handleChange('description')}
              value={values.description}
              placeholderTextColor="#cccfd2"
              placeholder="Type something that you want to develop in the future."
            />
            {errors.description && touched.description && (
              <View style={styles.messageContainer}>
                <Text style={styles.message}>{errors.description}</Text>
              </View>
            )}
<View style={styles.top} />
            {!isSubmitting ? (
              <TouchableOpacity onPress={handleSubmit}>
                <LinearGradient
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  colors={['#13529f', '#975bc1']}
                  style={styles.createButton}>
                  <Text style={styles.buttonText}>Create</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleSubmit}>
                <LinearGradient
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  colors={['#C0C0C0', '#A9A9A9']}
                  style={styles.createButton}>
                  <Text style={styles.buttonText}>Creating...</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
  },
  containerHeader: {
    flex: 0.15,
    flexDirection: 'row',
    margin: 20,
    // width: '100%',
    alignItems:'center'
  },
  top: {marginTop: screenHeight/29.86},
  headerText: {
    fontSize: 30,
    color: '#2e2e2e',
    textAlign: 'left',
    marginTop: -5,
    width: '60%',
    fontWeight: '900',
    fontFamily: 'PointDEMO-SemiBold',
  },
  backNavigationButton: {
    width: 50,
    alignItems: 'center',
    height: 50,
    marginLeft: -20,
  },
  containerBody: {
    flex: 1,
    margin: 20,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleText: {
    fontSize: 22,
    color: '#2e2e2e',
    fontWeight: '900',
    fontFamily: 'PointDEMO-SemiBold',
  },
  categoryText: {
    color: '#2e2e2e',
    fontSize: 16,
    marginRight: 50,
    fontWeight: '900',
    fontFamily: 'PointDEMO-SemiBold',
  },
  endDate: {
    fontSize: 22,
    color: '#2e2e2e',
    marginLeft: 10,
    fontWeight: '900',
    fontFamily: 'PointDEMO-SemiBold',
  },
  bottomLine: {
    borderBottomColor: '#975bc1',
    borderBottomWidth: 0.75,
  },
  input: {
    marginTop: 20,
    borderColor: '#975bc1',
    borderBottomWidth: 0.75,
    fontSize: 18,
    color: '#2e2e2e',
    fontWeight: '900',
    fontFamily: 'PointDEMO-SemiBold',
  },
  textArea: {
    marginTop: 10,
    fontSize: 18,
    color: '#2e2e2e',
    justifyContent: 'flex-start',
    height: 150,
    textAlignVertical: 'top',
    backgroundColor: '#f0f0f0',
    fontWeight: '900',
    fontFamily: 'PointDEMO-SemiBold',
  },
  button: {
    margin: 25,
    padding: 10,
    borderRadius: 25,
    width: '50%',
  },
  createButton: {
    marginTop: 25,
    padding: 10,
    borderRadius: 25,
    width: '100%',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    color: '#eeeeee',
  },
  date: {
    fontSize: 16,
    color: '#2e2e2e',
    fontWeight: '900',
    fontFamily: 'PointDEMO-SemiBold',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    padding: 5,
    marginTop: 10,
    width: '100%',
  },
  dateView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
  modal: {
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
    fontWeight: '900',
    fontFamily: 'PointDEMO-SemiBold',
    textAlign: 'center',
    margin: 10,
  },
  modalTextOne: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: '900',
    fontFamily: 'PointDEMO-SemiBold',
    textAlign: 'center',
    margin: 10,
  },
  row: {flexDirection: 'row'},
  modalTextTwo: {
    fontSize: 18,
    color: '#0fb6cd',
    fontWeight: '900',
    fontFamily: 'PointDEMO-SemiBold',
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
  messageContainer: {
    marginVertical: 5,
  },
  message: {
    margin: 5,
    fontSize: 14,
    color: '#ff0000',
    marginBottom: -40,
    fontWeight: '900',
    fontFamily: 'PointDEMO-SemiBold',
  },
});
