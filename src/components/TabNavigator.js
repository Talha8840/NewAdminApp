import React from 'react';
import {Image, StyleSheet, Dimensions} from 'react-native';
import HomeScreen from '../screens/Home';
import MeditationEntry from '../screens/MeditationEntry';
import MetaWorldEntry from '../screens/MetaWorldEntry';
import Notification from '../screens/Notification';
import Menu from '../screens/Menu';
import HomeImg from '../assets/images/Home.png';
import MeditationImg from '../assets/images/Meditate.png';
import MetaworldImg from '../assets/images/Meta-World.png';
import NotificationImg from '../assets/images/Notification.png';
import MenuImg from '../assets/images/Menu.png';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';

import SCREENS from '../../SCREENS';
const Tab = createMaterialBottomTabNavigator();
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
console.warn('width', windowWidth);
export default function TabNavigator() {
  return (
    <Tab.Navigator
      activeColor="#eeeeee"
      inactiveColor="#b3acab"
      barStyle={styles.tabBg}>
      <Tab.Screen
        name={SCREENS.HOME}
        component={HomeScreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({color}) => (
            <Image
              resizeMode="contain"
              source={HomeImg}
              style={styles.tabIcon}
            />
          ),
        }}
      />
      <Tab.Screen
        name={SCREENS.MEDITATION_ENTRY}
        component={MeditationEntry}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({color}) => (
            <Image
              resizeMode="contain"
              source={MeditationImg}
              style={styles.tabIcon}
            />
          ),
        }}
      />
      <Tab.Screen
        name={SCREENS.METAWORLD_ENTRY}
        component={MetaWorldEntry}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({color}) => (
            <Image
              resizeMode="contain"
              source={MetaworldImg}
              style={styles.metaTabIcon}
            />
          ),
        }}
      />
      <Tab.Screen
        name={SCREENS.NOTIFICATION}
        component={Notification}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({color}) => (
            <Image
              resizeMode="contain"
              source={NotificationImg}
              style={styles.tabIcon}
            />
          ),
        }}
      />
      <Tab.Screen
        name={SCREENS.MENU}
        component={Menu}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({color}) => (
            <Image
              resizeMode="contain"
              source={MenuImg}
              style={styles.tabIcon}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
const styles = StyleSheet.create({
  tabBg: {
    backgroundColor: '#181818',
    // padding:5,
    justifyContent: 'center',
  },
  tabIcon: {
    width: windowWidth / 13,
    height: windowHeight / 26,
  },
  metaTabIcon: {
    width: windowWidth / 10,
    height: windowHeight / 14,
    marginTop: -10,
  },
});
