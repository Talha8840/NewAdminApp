import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

export default function Item({value}) {
  return (
    <View style={styles.performanceText}>
      <Text style={styles.textColor}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  performanceText: {
    width: '17%',
    marginLeft: 2,
    marginTop: -10,
  },
  textColor: {color: '#eeeeee'},
});
