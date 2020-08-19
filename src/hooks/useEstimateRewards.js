import React, {useState, useEffect} from 'react';
import {
  GET_ESTIMATEDACTIONREWARDS,
  GET_USER,
  GET_AWARD,
} from '../graphql/query';
import {useQuery, useLazyQuery} from '@apollo/client';
import {Image} from 'react-native';

export default function useEstimateRewards(actionId, userId) {
  const [socioCoins, setSocioCoins] = useState(null);
  const [xps, setXps] = useState(null);
  const [levelUp, isLevelUp] = useState(true);
  const [newLevel, setNewLevel] = useState(null);
  const [awardId, setAwardId] = useState(null);
  const [awardData, setAwardData] = useState(null);
  const [skip, setSkip] = useState(false);

  console.log('skip before', skip);

  console.log(actionId, userId, 'actionId, userId');

  const {data: userData, refetch, loading} = useQuery(GET_USER, {
    variables: {id: userId},
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      console.log(data, 'userData EstimatedRewards');
    },
    skip: !userId,
  });

  //   async function userfunc() {
  //     const user = await AsyncStorage.getItem('userId');
  //     setUserId(user);
  //   }

  useEffect(() => {
    console.log('userData from userEstimated', userData);
    setSkip(false);
  }, [actionId, userData && userData.getUser.socioCoins]);

  const {data: estimatedRewards} = useQuery(GET_ESTIMATEDACTIONREWARDS, {
    skip: skip || !userData,
    variables: {
      userId: userId,
      userLevelId: userData && userData.getUser.levelId,
      userXps: userData && userData.getUser.Xps,
      userSocioCoins:
        userData && userData.getUser.socioCoins + userData.getUser.spentCoins,
      actionId,
    },
    onCompleted: (data) => {
      console.log('skip 2', skip);
      if (userId) {
        setSkip(true);
      }

      console.warn('estimated Award', data);
      setSocioCoins(
        estimatedRewards &&
          estimatedRewards.getEstimatedActionRewards.data.socioCoins,
      );
      setXps(
        estimatedRewards && estimatedRewards.getEstimatedActionRewards.data.xps,
      );
      isLevelUp(
        estimatedRewards &&
          estimatedRewards.getEstimatedActionRewards.data.levelup,
      );
      setNewLevel(
        estimatedRewards &&
          estimatedRewards.getEstimatedActionRewards.data.newlevel,
      );
      setAwardId(
        estimatedRewards &&
          estimatedRewards.getEstimatedActionRewards.data.newAwardId,
      );

      setAwardData(
        estimatedRewards &&
          estimatedRewards.getEstimatedActionRewards.data.awardData,
      );

      if (
        estimatedRewards &&
        estimatedRewards.getEstimatedActionRewards.data.awardData
      ) {
        Image.prefetch(
          estimatedRewards.getEstimatedActionRewards.data.awardData.url,
        );
      }
    },
  });

  return {
    socioCoins,
    xps,
    newLevel,
    awardId,
    awardData,
    userData,
    levelUp,
  };
}
