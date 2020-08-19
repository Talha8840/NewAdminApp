import React from 'react';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import {Text, View, StyleSheet} from 'react-native';

const CustomAlert = ({displayText}) => {
  return (
    <View>
      <Animatable.View animation="fadeInUp" style={styles.container}>
        <LinearGradient
          start={{x: 1, y: 0}}
          end={{x: 0, y: 0}}
          colors={['#06b5d2', '#3ebdb4']}
          style={styles.subContainer}>
          <Text style={styles.text}>{displayText}</Text>
        </LinearGradient>
      </Animatable.View>
    </View>
  );
};

export default CustomAlert;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    width: '100%',
  },
  subContainer: {
    width: '80%',
    padding: 10,
    borderRadius: 10,
  },
  text: {textAlign: 'center', fontSize: 14},
});
