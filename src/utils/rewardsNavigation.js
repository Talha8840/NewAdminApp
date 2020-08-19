import SCREENS from '../../SCREENS';

export const navigateReward = (navigation, rewards) => {
  const {
    awardData,
    newLevel,
    socioCoins,
    xps,
    userSocioCoins,
    levelUp,
    screenName,
  } = rewards;

  const totalSocioCoins = socioCoins + userSocioCoins;

  let milestone =
    parseInt(totalSocioCoins / 500) - parseInt(userSocioCoins / 500) > 0;

  //navigate to home if nothing ( no level, no award and no milestone)
  if (!awardData && !levelUp && !milestone) {
    navigation.navigate('TabNavigator', {screen: SCREENS.HOME});
  } else {
    //navigate to award or level or milestone
    if (awardData) {
      navigation.navigate(SCREENS.AWARD_CONGRATS, rewards);
    } else if (levelUp) {
      navigation.navigate(SCREENS.LEVELUP_CONGRATS, rewards);
    } else {
      navigation.navigate(SCREENS.MILESTONE, rewards);
    }
  }
};

export const navigateFromAward = (navigation, rewards) => {
  const {
    awardData,
    newLevel,
    socioCoins,
    xps,
    userSocioCoins,
    levelUp,
    screenName,
  } = rewards;

  const totalSocioCoins = socioCoins + userSocioCoins;

  let milestone =
    parseInt(totalSocioCoins / 500) - parseInt(userSocioCoins / 500) > 0;

  if (!levelUp && !milestone) {
    navigation.navigate('TabNavigator', {screen: SCREENS.HOME});
  } else {
    if (levelUp) {
      navigation.navigate(SCREENS.LEVELUP_CONGRATS, rewards);
    } else {
      navigation.navigate(SCREENS.MILESTONE, rewards);
    }
  }
};

export const navigateFromLevel = (navigation, rewards) => {
  const {
    awardData,
    newLevel,
    socioCoins,
    xps,
    userSocioCoins,
    levelUp,
    screenName,
  } = rewards;

  const totalSocioCoins = socioCoins + userSocioCoins;

  let milestone =
    parseInt(totalSocioCoins / 500) - parseInt(userSocioCoins / 500) > 0;

  if (!milestone) {
    navigation.navigate('TabNavigator', {screen: SCREENS.HOME});
  } else {
    navigation.navigate(SCREENS.MILESTONE, rewards);
  }
};
