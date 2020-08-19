import React, {useEffect, useState} from 'react';
import Swiper from 'react-native-swiper';
import AsyncStorage from '@react-native-community/async-storage';

import One from './One';
import Two from './Two';
import Three from './Three';
import {Auth} from 'aws-amplify';

import SCREENS from '../../../SCREENS';

export default function StartIndex({navigation}) {
  const [index, setIndex] = useState(null);

  const handleAuthenticatedUser = async () => {
    try {
      const isOnBoard = await AsyncStorage.getItem('onBoard');

      try {
        const user = await Auth.currentAuthenticatedUser();

        if (user && isOnBoard === 'true') {
          navigation.navigate(SCREENS.WELCOME);
        }
      } catch (e) {
        console.log('Auth Error', e);

        if (isOnBoard === 'true') {
          navigation.navigate(SCREENS.SIGNIN_ENTRY);
        }
      }
    } catch (e) {
      console.log('Failed to get item From AS: onBoard', e);
    }
  };

  useEffect(() => {
    handleAuthenticatedUser();
  });

  return (
    <>
      <Swiper
        showsPagination={false}
        onIndexChanged={(idx) => setIndex(idx)}
        loop={false}>
        <One />
        <Two index={index} />
        <Three navigation={navigation} index={index} />
      </Swiper>
    </>
  );
}
