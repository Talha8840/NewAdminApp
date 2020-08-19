import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function TableTwo({userData, isCopilot}) {
  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <Text
          style={isCopilot ? styles.copilotBodyTextOne : styles.bodyTextOne}>
          Meta life
        </Text>
        <Text
          style={isCopilot ? styles.copilotBodyTextTwo : styles.bodyTextTwo}>
          {userData && userData.getUser.metaWorld.items.length}
        </Text>
      </View>
      <View style={styles.subContainer}>
        <Text
          style={isCopilot ? styles.copilotBodyTextOne : styles.bodyTextOne}>
          Daily intentions
        </Text>
        <Text
          style={isCopilot ? styles.copilotBodyTextTwo : styles.bodyTextTwo}>
          {userData && userData.getUser.tasks.items.length}
        </Text>
      </View>
      <View style={styles.subContainer}>
        <Text
          style={isCopilot ? styles.copilotBodyTextOne : styles.bodyTextOne}>
          Awards
        </Text>
        <Text
          style={isCopilot ? styles.copilotBodyTextTwo : styles.bodyTextTwo}>
          {' '}
          {userData && userData.getUser.awardsCount}
        </Text>
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
    width: '30%',
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
});
