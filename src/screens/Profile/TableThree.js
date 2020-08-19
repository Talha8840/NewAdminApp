import React from 'react';
import {View, Text, StyleSheet, Image, Dimensions} from 'react-native';
import getMeditationDuration from '../../utils/meditationDuration';
import lockImg from '../../assets/images/Lock.png';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function TableThree({userData, isCopilot}) {
  const seconds = userData && userData.getUser.meditationDuration;
  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <Text
          style={isCopilot ? styles.copilotBodyTextOne : styles.bodyTextOne}>
          Friends
        </Text>
        <Image resizeMode="contain" source={lockImg} style={styles.image} />
      </View>
      <View style={styles.subContainer}>
        <Text
          style={isCopilot ? styles.copilotBodyTextOne : styles.bodyTextOne}>
          Meditated for{' '}
        </Text>
        <Text
          style={isCopilot ? styles.copilotBodyTextTwo : styles.bodyTextTwo}>
          {getMeditationDuration(seconds)}
        </Text>
      </View>

      <View style={styles.subContainer}>
        <Text
          style={isCopilot ? styles.copilotBodyTextOne : styles.bodyTextOne}>
          Clan
        </Text>
        <Image resizeMode="contain" source={lockImg} style={styles.image} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 11,
    justifyContent: 'space-around',
  },
  subContainer: {
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyTextOne: {
    fontSize: 16,
    color: '#0fb6cd',
    fontWeight: '900',
    textAlign: 'center',
  },
  bodyTextTwo: {
    fontSize: 16,
    color: '#eeeeee',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  copilotBodyTextOne: {
    fontSize: 14,
    color: '#0fb6cd',
    fontWeight: '900',
    textAlign: 'center',
  },
  copilotBodyTextTwo: {
    fontSize: 14,
    color: '#eeeeee',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  image: {
    width: 20,
    height: 20,
  },
  copilotImage: {
    width: 20,
    height: 20,
  },
});
