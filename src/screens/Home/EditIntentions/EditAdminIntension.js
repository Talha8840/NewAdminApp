import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import SCREENS from '../../../../SCREENS';

export default function EditAdminIntension({navigation, intention}) {
  return (
    <View style={styles.container}>
      <View style={styles.containerHeader}>
        <TouchableOpacity
          style={styles.backNavigationButton}
          onPress={() => navigation.navigate(SCREENS.RATE_INTENTION)}>
          <Icon name="ios-arrow-back" color={'#0fb6cd'} size={30} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Edit Intention</Text>
      </View>

      <View style={styles.containerBody}>
        <View style={styles.containerBodyOne}>
          <Text style={styles.titleText}>Category</Text>
          <View>
            <Text style={styles.categoryName}>{intention.category.name}</Text>
            <View style={styles.bottomLine} />
          </View>
        </View>
        <TextInput
          style={styles.input}
          value={intention.name}
          placeholderTextColor="#cccfd2"
          placeholder="Intention name"
          editable={false}
        />
        <View style={styles.dateView}>
          <View>
            <Text style={styles.titleText}>Start Date</Text>
            <View style={styles.dateContainer}>
              <Text style={styles.date}>
                {new Date(intention.startDate).toDateString().substr(3)}
              </Text>
            </View>
          </View>
          <View>
            <Text style={styles.titleText}>End Date</Text>
            <View style={styles.dateContainer}>
              <Text style={styles.date}>
                {new Date(intention.endDate).toDateString().substr(3)}
              </Text>
            </View>
          </View>
        </View>
        <TextInput
          multiline={true}
          numberOfLines={4}
          maxLength={50}
          style={styles.textArea}
          value={intention.description}
          editable={false}
          placeholderTextColor="#cccfd2"
          placeholder="Type in the Habit that you want to develop in the future."
        />
      </View>
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
  headerText: {
    fontSize: 35,
    color: '#eeeeee',
    textAlign: 'left',
    marginTop: -5,
    fontWeight: '900',
  },
  bottomLine: {
    borderBottomColor: '#06b5d2',
    borderBottomWidth: 0.75,
  },
  dateView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  containerBody: {
    flex: 0.75,
    margin: 20,
    marginTop: -30,
  },
  categoryName: {
    color: '#eeeeee',
    fontSize: 16,
    marginRight: 50,
  },
  containerBodyOne: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backNavigationButton: {
    width: 50,
    alignItems: 'center',
    height: 50,
    marginLeft: -20,
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
    color: '#eeeeee',
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
