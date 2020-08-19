import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import HealthIcon from 'react-native-vector-icons/MaterialIcons';
import LeisureIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FinanceIcon from 'react-native-vector-icons/FontAwesome';
import ContributeIcon from 'react-native-vector-icons/FontAwesome5';
import LearningIcon from 'react-native-vector-icons/FontAwesome5';
import PetsIcon from 'react-native-vector-icons/MaterialIcons';
import RelationshipIcon from 'react-native-vector-icons/FontAwesome';
import OppurtunityIcon from 'react-native-vector-icons/FontAwesome5';
import CareerIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import VacationIcon from 'react-native-vector-icons/Fontisto';
import HouseIcon from 'react-native-vector-icons/FontAwesome';
import MysticalIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ThingsIcon from 'react-native-vector-icons/Entypo';
import OthersIcon from 'react-native-vector-icons/Entypo';
import {categories} from '../utils/categories';

export default function DropdownMetaWorld({
  setDropdown,
  setFieldValue,
  isDropdown,
}) {
  const metaWorldCategories = [
    'CAREER',
    'CONTRIBUTION',
    'FINANCE',
    'HEALTH',
    'HOUSE',
    'LEARNING',
    'LEISURE',
    'MYSTICAL_EXPERIENCE',
    'OPPURTUNITIES',
    'PETS',
    'RELATIONSHIPS',
    'THINGS',
    'VACATION',
    'OTHERS',
  ];
  return (
    <View style={styles.container}>
      <View style={styles.marginContainer}>
        {metaWorldCategories.map((i) => (
          <TouchableOpacity
            style={styles.categories}
            onPress={() => {
              setDropdown(!isDropdown);
              setFieldValue('category', i);
            }}>
            {categories[i].icon}
            <Text
              style={{
                color: categories[i].color,
                marginLeft: 10,
                fontSize: 13,
              }}>
              {i}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 195,
    backgroundColor: '#303030',
    position: 'absolute',
    marginTop: 0,
    flex: 1,
    zIndex: 100,
  },
  marginContainer: {margin: 10},
  icon: {
    width: '15%',
    textAlign: 'center',
  },
  categories: {
    flexDirection: 'row',
    marginBottom: 10,
  },
});
