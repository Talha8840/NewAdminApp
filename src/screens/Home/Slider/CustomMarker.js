import React from 'react';
import {StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Fontisto';

export default function CustomMarker() {
  return (
    <Icon name="radio-btn-active" size={25} color="#ffff" style={styles.icon} />
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 30,
    height: 30,
    marginTop: 10,
  },
});
