import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {categories} from '../utils/categories';

export default function DropdownIntention({
  setDropdown,
  setFieldValue,
  isDropdown,
}) {
  const intentionCategories = [
    'BUSINESS',
    'CONTRIBUTION',
    'FINANCE',
    'HEALTH',
    'LEARNING',
    'LEISURE',
    'PROJECTS',
    'RELATIONSHIPS',
    'SPIRITUAL',
    'SELF_CARE',
    'OTHERS',
  ];

  return (
    <View style={styles.container}>
      <View style={styles.marginContainer}>
        {intentionCategories.map((i) => (
          <TouchableOpacity
            key={i}
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
    width: 180,
    backgroundColor: '#1d1d1d',
    position: 'absolute',
    flex: 1,
    zIndex: 100,
    marginTop: -20,
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
