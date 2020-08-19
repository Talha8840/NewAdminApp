import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {useMutation} from '@apollo/client';
import {Formik} from 'formik';
import DatePicker from 'react-native-datepicker';
import {UPDATE_TASK} from '../../../graphql/mutation';
import SCREENS from '../../../../SCREENS';
import moment from 'moment';
import Sound from 'react-native-sound';

const SOUNDBUNDLE = Platform.OS == 'ios' ? '' : Sound.MAIN_BUNDLE

const MUSIC_URL =
  'https://littimages.s3.ap-south-1.amazonaws.com/music/RATING+AND+MEDITATION+POP+UP+AUDIO.mp3';

let sound = new Sound(MUSIC_URL, SOUNDBUNDLE, () => {});

export default function EditMetaIntension({navigation, intention}) {
  const [userId, setuserId] = useState(null);

  async function userfunc() {
    const user = await AsyncStorage.getItem('userId');
    setuserId(user);
  }

  console.warn('user=/>', userId);

  console.warn(intention.startDate, 'intention');

  useEffect(() => {
    userfunc();
  }, []);

  const [updateIntention] = useMutation(UPDATE_TASK);
  const handleUpdateIntension = async (values, actions) => {
    console.warn(values);
    updateIntention({
      variables: {
        input: {
          id: intention.id,
          userId: userId,
          name: values.intentionName,
          description: values.description,
          categoryId: values.category,
          startDate: values.startDate,
          endDate: values.endDate,
          taskType: 'meta',
        },
      },
    })
      .then((data) => {
        console.warn(data);
        navigation.navigate('TabNavigator', {screen: SCREENS.HOME});
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerHeader}>
        <TouchableOpacity
          style={styles.backNavigationButton}
          onPress={() => navigation.navigate(SCREENS.RATE_INTENTION)}>
          <Icon name="ios-arrow-back" color={'#0fb6cd'} size={30} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Take charge of your life</Text>
      </View>
      <Formik
        enableReinitialize={true}
        initialValues={{
          intentionName: intention.name,
          description: intention.description,
          category: intention.categoryId,
          startDate: intention.startDate,
          endDate: intention.endDate,
        }}
        onSubmit={handleUpdateIntension}>
        {({handleChange, handleSubmit, setFieldValue, values}) => (
          <View style={styles.containerBody}>
            <View style={styles.subContainerBody}>
              <Text style={styles.titleText}>Category</Text>
              <View>
                <Text style={styles.categoryName}>Meta Task</Text>

                <View style={styles.bottomLine} />
              </View>
            </View>
            <TextInput
              style={styles.input}
              onChangeText={handleChange('intentionName')}
              value={values.intentionName}
              placeholderTextColor="#cccfd2"
              placeholder="Intention name"
            />
            <View style={styles.dateView}>
              <View>
                <Text style={styles.titleText}>Start Date</Text>
                <View style={styles.dateContainer}>
                  <DatePicker
                    style={styles.date}
                    date={moment(values.startDate).format('ll')}
                    showIcon={false}
                    mode="date"
                    androidMode="spinner"
                    placeholder={moment(values.startDate).format('ll')}
                    format="ll"
                    minDate={moment(values.startDate).add(21, 'd').format('ll')}
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
                    disabled={true}
                  />
                </View>
              </View>
              <View>
                <Text style={styles.endDateText}>End Date</Text>
                <View style={styles.dateContainer}>
                  <DatePicker
                    style={styles.date}
                    date={moment(values.endDate).format('ll')}
                    showIcon={false}
                    mode="date"
                    androidMode="spinner"
                    placeholder={moment(values.endDate).format('ll')}
                    format="ll"
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
                    disabled={true}
                  />
                </View>
              </View>
            </View>
            <TextInput
              multiline={true}
              numberOfLines={4}
              maxLength={50}
              blurOnSubmit={true}
              style={styles.textArea}
              onChangeText={handleChange('description')}
              value={values.description}
              placeholderTextColor="#cccfd2"
              placeholder="Type in the Habit that you want to develop in the future."
            />

            <TouchableOpacity onPress={handleSubmit}>
              <LinearGradient
                start={{x: 1, y: 0}}
                end={{x: 0, y: 0}}
                colors={['#06b5d2', '#3ebdb4']}
                style={styles.button}>
                <Text style={styles.buttonText}>Update Intention</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
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
  containerHeader: {
    flex: 0.25,
    flexDirection: 'row',
    margin: 20,
    width: '60%',
  },
  dateView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
  },
  bottomLine: {
    borderBottomColor: '#06b5d2',
    borderBottomWidth: 0.75,
  },
  backNavigationButton: {
    width: 50,
    alignItems: 'center',
    height: 50,
    marginLeft: -20,
  },
  subContainerBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryName: {
    color: '#eeeeee',
    fontSize: 16,
    marginRight: 50,
  },
  headerText: {
    fontSize: 35,
    color: '#eeeeee',
    textAlign: 'left',
    marginTop: -5,
    fontWeight: '900',
  },
  containerBody: {
    flex: 0.75,
    margin: 20,
    marginTop: -30,
  },
  datePicker: {
    width: '80%',
    color: '#2e2e2e',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  endDateText: {
    fontSize: 22,
    color: '#eeeeee',
    marginLeft: 10,
  },
  titleText: {
    fontSize: 22,
    color: '#eeeeee',
  },
  date: {
    fontSize: 16,
    color: '#020202',
  },
  input: {
    marginTop: 20,
    borderColor: '#06b5d2',
    borderBottomWidth: 0.75,
    fontSize: 18,
    color: '#eeeeee',
  },
  textArea: {
    marginTop: 30,
    borderColor: '#06b5d2',
    borderWidth: 0.75,
    fontSize: 18,
    color: '#eeeeee',
    justifyContent: 'flex-start',
    height: 150,
    textAlignVertical: 'top',
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
});
