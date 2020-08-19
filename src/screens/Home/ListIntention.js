import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import ActivityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Flow} from 'react-native-animated-spinkit';
import {categories} from '../../utils/categories';
import SCREENS from '../../../SCREENS';
import metaTaskImg from '../../assets/images/Meta-task.png';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function ListIntention({
  navigation,
  loading,
  userId,
  userData,
  refetch,
}) {
  console.log('user', userData);

  return (
    <ScrollView>
      <View style={styles.marginContainer}>
        <Text style={styles.textColor}>
          {new Date().toDateString().substr(3)}
        </Text>
      </View>
      {userData == [] ? (
        <View style={styles.center}>
          <Text style={styles.loadingText}>Getting your tasks...</Text>
          <View style={styles.top}>
            <Flow size={48} color="#0fb6cd" />
          </View>
        </View>
      ) : (
        userData &&
        userData.getUser.tasks.items.map((intention) => {
          return (
            <TouchableOpacity
              key={intention.id}
              onPress={() =>
                navigation.navigate(SCREENS.RATE_INTENTION, {
                  intention,
                  userId,
                  userData,
                  refetch,
                  categories,
                })
              }
              style={styles.container}>
              <View style={styles.containerHeader}>
                <View style={styles.header}>
                  {intention.categoryId == 'METALIFE' ? (
                    <Image
                      resizeMode="cover"
                      source={metaTaskImg}
                      style={styles.metaImg}
                    />
                  ) : (
                    categories[intention.categoryId].icon
                  )}
                  <Text
                    style={{
                      marginLeft: 10,
                      fontSize: 16,
                      color: categories[intention.categoryId].color,
                    }}>
                    {intention.categoryId == 'METALIFE'
                      ? 'Meta Task'
                      : intention.categoryId}
                  </Text>
                </View>
                <ActivityIcon name="greater-than" color={'#0fb6cd'} size={15} />
              </View>
              <Text style={styles.description}>{intention.description}</Text>
            </TouchableOpacity>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1d1d1d',
    margin: 20,
    borderRadius: 10,
    marginTop: -10,
  },
  marginContainer: {margin: 20, marginTop: 0},
  textColor: {color: '#919191'},
  center: {justifyContent: 'center', alignItems: 'center'},
  loadingText: {textAlign: 'center', color: '#eeeeee'},
  top: {marginTop: 10},
  containerHeader: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    margin: 10,
  },
  header: {
    flexDirection: 'row',
  },
  metaImg: {
    width: screenWidth / 20,
    height: screenHeight / 25,
  },
  descriptionContainer: {
    margin: 5,
    marginTop: -5,
    marginBottom: 20,
  },
  description: {
    marginLeft: 10,
    fontSize: 16,
    color: '#eeeeee',
    marginBottom: 10,
  },
  nextIcon: {
    margin: 5,
    marginTop: 10,
  },
});
