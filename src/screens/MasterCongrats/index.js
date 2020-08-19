import React, {useState, useEffect, useCallback} from 'react';
import AwardCongrats from './AwardCongrats';
import LevelUpCongrats from './LevelUpCongrats';
import Milestone from './Milestone';
import SCREENS from '../../../SCREENS';
import {useFocusEffect} from '@react-navigation/native';

export default function MasterCongratsIndex({navigation, route}) {
  const {
    awardData,
    newLevel,
    socioCoins,
    xps,
    userSocioCoins,
    levelUp,
    screenName,
  } = route.params;

  console.log(route.params, 'route.params');

  const [award, setAward] = useState(awardData);
  const [level, setLevel] = useState(levelUp);
  const [showMilestone, setShowMilestone] = useState(false);
  const totalSocioCoins = socioCoins + userSocioCoins;

  let milestone =
    parseInt(totalSocioCoins / 500) - parseInt(userSocioCoins / 500) > 0;

  useEffect(() => {
    console.log('inside useEffect', levelUp, awardData);
    if (!awardData && !levelUp && !milestone) {
      navigation.navigate('TabNavigator', {screen: SCREENS.HOME});
    } else {
      if (levelUp !== level) {
        setLevel(levelUp);
      }
      if (awardData !== award) {
        setAward(awardData);
      }
      setShowMilestone(milestone);
    }
  }, [awardData, levelUp, screenName, userSocioCoins]);

  const navigateFunc = (done) => {
    if (done == 'MILESTONE') {
      console.log('inside mileStone');
      setShowMilestone(null);
      navigation.navigate('TabNavigator', {screen: SCREENS.HOME});
    } else if (done == 'AWARD') {
      console.warn('done AWARD', award);
      if (!showMilestone && !levelUp) {
        navigation.navigate('TabNavigator', {screen: SCREENS.HOME});
      }
      setAward(null);
    } else if (done == 'LEVEL') {
      if (!showMilestone) {
        navigation.navigate('TabNavigator', {screen: SCREENS.HOME});
        console.warn('done LEVEL', level);
      }
      setLevel(null);
    }
  };
  console.warn('b4 if block', level);

  if (award) {
    return <AwardCongrats award={award} navigateFunc={navigateFunc} />;
  }
  if (level) {
    console.log(level, 'level inside if');
    return <LevelUpCongrats level={newLevel} navigateFunc={navigateFunc} />;
  }
  if (showMilestone) {
    return (
      <Milestone
        totalSocioCoins={totalSocioCoins}
        navigateFunc={navigateFunc}
      />
    );
  }

  return null;
}
