import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import StarIcon from 'react-native-vector-icons/AntDesign';

export default function Rewards() {
  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
        <StarIcon name="star" color={'#e5a445'} size={20} />
        <Text style={styles.text}>Unlock 2 additional daily intentions</Text>
      </View>
      <View style={styles.bodyContainer}>
        <StarIcon name="star" color={'#e5a445'} size={20} />
        <Text style={styles.text}>+100 socius coins</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    backgroundColor: '#181818',
    padding: 20,
    borderRadius: 15,
    marginTop: -5,
  },
  bodyContainer: {
    flexDirection: 'row',
    margin: 10,
  },
  text: {
    fontSize: 18,
    color: '#eeeeee',
    marginLeft: 10,
  },
});
