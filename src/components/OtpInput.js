import React, {useState} from 'react';
import {View, TextInput, StyleSheet, Dimensions, Platform} from 'react-native';

const screenWidth = Dimensions.get('window').width;
// console.log('screenWidth', screenWidth / 20.7);

const OtpInput = ({code, setCode}) => {
  return (
    <View style={styles.container}>
      <View style={{justifyContent: 'center'}}>
        <TextInput
          maxLength={6}
          keyboardType="number-pad"
          value={code}
          onChangeText={(text) => {
            setCode(text);
          }}
          style={styles.textInput}
        />
      </View>
      <View style={styles.inputBorderContainer}>
        <View style={styles.inputBorderView} />
        <View style={styles.inputBorderView} />
        <View style={styles.inputBorderView} />
        <View style={styles.inputBorderView} />
        <View style={styles.inputBorderView} />
        <View style={styles.inputBorderView} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: screenWidth / 10.25,
    marginTop: 20,
    justifyContent: 'center',
  },
  textInput: {
    fontSize: 20,
    color: 'white',
    letterSpacing:
      Platform.OS == 'ios' ? screenWidth / 11.85 : screenWidth / 12.85,
    marginLeft: Platform.OS == 'ios' ? screenWidth / 20.7 : 0,
  },
  inputBorderContainer: {flexDirection: 'row'},
  inputBorderView: {
    height: 2,
    backgroundColor: '#0fb6cd',
    width: '10%',
    marginTop: 2,
    marginHorizontal: screenWidth / 55,
  },
});

export default OtpInput;
