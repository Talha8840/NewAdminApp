import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import CoinIcon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import {useMutation} from '@apollo/client';
import {CREATE_ACTIVITY} from '../graphql/mutation';
import SCREENS from '../../SCREENS';
import ConfettiCoinImg from '../assets/images/coin.png';

export default function Congratulation({navigation}) {
  const sessionType = 'morning';
  const [userId, setuserId] = useState(null);

  const [createActivity] = useMutation(CREATE_ACTIVITY);

  const createUserActivity = () => {
    createActivity({
      variables: {
        input: {
          userId: userId,
          actionId:
            sessionType == 'morning'
              ? 'MEDITATION_MORNING'
              : 'MEDITATION_EVENING',
          value: 300,
        },
      },
    })
      .then((data) => {
        navigation.navigate(SCREENS.MEDITATION_ENTRY);
      })
      .catch((err) => console.warn(err));
  };

  async function userfunc() {
    const user = await AsyncStorage.getItem('userId');
    setuserId(user);
  }

  console.warn('user=/>', userId);

  useEffect(() => {
    userfunc();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Congratulations!</Text>
      <View>
        <Image source={ConfettiCoinImg} style={styles.image} />
      </View>
      <Text style={styles.title}>You just</Text>
      <Text style={styles.littUp}>Litt Up!</Text>
      <View style={styles.bodyContainer}>
        <Text style={styles.bodyText}>You have earned</Text>
        <View style={styles.result}>
          <Text style={styles.bodyTextTwo}>+250</Text>
          <CoinIcon
            name="circle"
            color={'#e5a445'}
            size={25}
            style={styles.iconMargin}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.bodyTextTwo}>+250</Text>
          <Text style={styles.bodyTextThree}>XP</Text>
        </View>
      </View>
      <TouchableOpacity onPress={createUserActivity} style={styles.buttonView}>
        <LinearGradient colors={['#eeeeee', '#eeeeee']} style={styles.button}>
          <Text style={styles.buttonText}>Collect</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252525',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    color: '#eeeeee',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    marginTop: 20,
  },
  image: {
    width: 200,
    height: 200,
  },
  littUp: {
    fontSize: 40,
    color: '#eeeeee',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bodyText: {
    fontSize: 16,
    color: '#eeeeee',
    textAlign: 'center',
  },
  result: {flexDirection: 'row', margin: 10},
  bodyTextTwo: {
    fontSize: 18,
    color: '#0fb6cd',
    fontWeight: '900',
    textAlign: 'center',
  },
  iconMargin: {marginLeft: 10},
  row: {flexDirection: 'row'},
  bodyTextThree: {
    fontSize: 18,
    color: '#ff7821',
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 10,
  },
  button: {
    margin: 25,
    padding: 10,
    borderRadius: 25,
    width: 200,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '900',
  },
});
