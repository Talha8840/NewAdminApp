import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Dimensions,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {useMutation} from '@apollo/client';
import {UPDATE_TASK} from '../../../graphql/mutation';
import {Formik} from 'formik';
import DatePicker from 'react-native-datepicker';
import DropDownIcon from 'react-native-vector-icons/AntDesign';
import DropdownIntention from '../../../components/DropdownIntention';
import SCREENS from '../../../../SCREENS';
import moment from 'moment';
import {categories} from '../../../utils/categories';

const screenHeight = Math.round(Dimensions.get('window').height);

export default function EditUserIntension({navigation, intention}) {
  const [userId, setuserId] = useState(null);
  const [isDropdown, setDropdown] = useState(false);
  console.log('screenHeight',screenHeight/29.86)
  async function userfunc() {
    const user = await AsyncStorage.getItem('userId');
    setuserId(user);
  }

  useEffect(() => {
    userfunc();
  }, []);

  const [updateIntention] = useMutation(UPDATE_TASK);
  const handleUpdateIntension = async (values) => {
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
        },
      },
    })
      .then((data) => {
        console.log(data);
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
          onPress={() =>
            navigation.navigate(SCREENS.RATE_INTENTION)
          }>
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
           
              <View style={styles.category}>
                <Text style={styles.titleText}>Category</Text>
                <View style={styles.categoryView}>
                  <TouchableOpacity
                    style={styles.categoryDropdown}
                    onPress={() => setDropdown(!isDropdown)}>
                    
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
                  
                    <DropDownIcon
                      name="down"
                      style={styles.iconMargin}
                      color={'#0fb6cd'}
                      size={15}
                    />
                  </TouchableOpacity>
                  <View style={styles.bottomLine} />
                 
                </View>
              </View>
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
           
              <View
                style={{height: screenHeight / 13, justifyContent: 'center'}}>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange('intentionName')}
                  value={values.intentionName}
                  placeholderTextColor="#cccfd2"
                  placeholder="Intention name"
                />
               
              </View>
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
                    minDate={moment().format('ll')}
                    confirmBtnText="Set"
                    cancelBtnText="Cancel"
                    customStyles={{
                      dateInput: {
                        borderWidth: 0,
                      },
                      dateText: {
                        color: '#eeeeee',
                        fontSize: 18,
                      },
                    }}
                    onDateChange={(date) => {
                      setFieldValue('startDate', new Date(`${date}`));
                      setFieldValue(
                        'endDate',
                        moment(new Date(`${date}`)).add(21, 'd'),
                      );
                    }}
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
                    minDate={moment(values.startDate).add(21, 'd').format('ll')}
                    confirmBtnText="Set"
                    cancelBtnText="Cancel"
                    customStyles={{
                      dateInput: {
                        borderWidth: 0,
                      },
                      dateText: {
                        color: '#eeeeee',
                        fontSize: 18,
                      },
                    }}
                    onDateChange={(date) => {
                      setFieldValue('endDate', new Date(`${date}`));
                    }}
                  />
                </View>
              </View>
            </View>
          
                
            {/* <View style={styles.top} /> */}
            
              <View
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
               
              </View>
              <View style={styles.top} />
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