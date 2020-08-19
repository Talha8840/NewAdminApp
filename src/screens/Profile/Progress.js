import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useQuery} from '@apollo/client';
import {ProgressBar} from 'react-native-paper';
import {GET_LEVELS} from '../../graphql/query';

import {useFocusEffect} from '@react-navigation/native';

export default function Progress({userData}) {
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, []),
  );

  const [startLevel, setStartLevel] = useState(null);
  const [endLevel, setEndLevel] = useState(null);
  const [intervalVal, setIntervalVal] = useState(0);
  const [xpsForNextLevel, setXpsForNextLevel] = useState(null);
  const [xpTpReact, setXpToReach] = useState(0);

  const currentLevelId = userData && parseInt(userData.getUser.levelId);
  console.warn(currentLevelId, 'currentLevelId');
  const nextLevelId = userData && parseInt(userData.getUser.levelId) + 1;
  console.warn(nextLevelId, 'currentLevelId');
  const currentUserXp = userData && userData.getUser.Xps;

  console.warn(currentLevelId, 'currentLevelId');

  const {refetch} = useQuery(GET_LEVELS, {
    variables: {startLevelId: currentLevelId, endLevelId: nextLevelId},
    onCompleted: (data) => {
      console.log('data from getLevels', data);
      setStartLevel(data.startLevel);
      setEndLevel(data.endLevel);
      setIntervalVal(data.endLevel.xpsToReach - data.startLevel.xpsToReach);
      setXpsForNextLevel(currentUserXp - data.startLevel.xpsToReach);
      setXpToReach(data.endLevel.xpsToReach - currentUserXp);
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  });

  return (
    <View style={styles.marginContainer}>
      <View style={styles.progressContainer}>
        <ProgressBar
          progress={xpsForNextLevel ? xpsForNextLevel / intervalVal : 0}
          color={'#0fb6cd'}
          style={styles.progressBar}
        />
      </View>
      <View style={styles.levelContainer}>
        <Text style={styles.fromLvl}>Lvl {currentLevelId} </Text>
        <Text style={styles.toLvl}>Lvl {nextLevelId}</Text>
      </View>
      <Text style={styles.requiredText}>
        {xpTpReact} more xp needed for Lvl {nextLevelId}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  marginContainer: {margin: 20},
  fromLvl: {color: '#eeeeee', marginLeft: 10},
  toLvl: {color: '#eeeeee', marginLeft: -10},
  progressBar: {
    backgroundColor: '#181818',
    height: 5,
    width: 300,
  },
  levelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
    marginTop: 10,
  },
  requiredText: {
    color: '#eeeeee',
    fontSize: 16,
    textAlign: 'center',
  },
});
