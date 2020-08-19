import React, {useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  BackHandler,
} from 'react-native';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/Ionicons';
import SCREENS from '../../SCREENS';
import {navigateReward} from '../utils/rewardsNavigation';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export default function MetaWorldSlides({navigation, route}) {
  const imageData = route.params.metaWorld;
  const rewards = route.params.rewards;

  const {newLevel, awardData, levelUp, socioCoins, userData} = rewards;

  console.log(rewards, 'rewards');

  // navigation.setOptions({
  //   headerStyle: {
  //     elevation: 0,
  //     backgroundColor: 'transparent',
  //   },
  //   headerLeft: () => (
  //     <TouchableOpacity
  //       onPress={() => navigation.navigate(SCREENS.METAWORLD_MAIN)}
  //       style={styles.backButton}>
  //       <Icon name="ios-arrow-back" size={25} color="#0fb6cd" />
  //       <Text style={styles.backButtonText}>back</Text>
  //     </TouchableOpacity>
  //   ),
  // });

  useEffect(() => {
    const userSocioCoins =
      userData.getUser.socioCoins + userData.getUser.spentCoins;

    const totalSocioCoins = socioCoins + userSocioCoins;

    let milestone =
      parseInt(totalSocioCoins / 500) - parseInt(userSocioCoins / 500) > 0;

    let timeOut;
    if (awardData || levelUp || milestone) {
      timeOut = setTimeout(() => {
        navigateReward(navigation, {
          newLevel,
          socioCoins,
          userSocioCoins,
          awardData,
          levelUp,
          screenName: 'META_WORLD_SLIDE',
        });
      }, 5000);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [awardData, levelUp, userData.getUser.socioCoins]);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate(SCREENS.METAWORLD_MAIN);
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  return (
    <>
      <View style={styles.containerHeader}>
        <TouchableOpacity
          onPress={() => navigation.navigate(SCREENS.METAWORLD_MAIN)}
          style={styles.backButton}>
          <Icon name="ios-arrow-back" size={25} color="#0fb6cd" />
          <Text style={styles.backButtonText}>back</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Swiper activeDotColor="#06b5d2" autoplay={true} showsButtons={false}>
          {imageData &&
            imageData.metaWorldByUserId.items.map((item) => (
              <View style={styles.top}>
                <Image
                  source={{uri: item.url}}
                  style={styles.wishImage}
                  resizeMode="contain"
                />
              </View>
            ))}
        </Swiper>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: -80,
  },
  wishImage: {
    width: screenWidth,
    height: screenHeight,
  },
  containerHeader: {
    flex: 0.1,
    flexDirection: 'row',
    // margin: 10,
    width: '100%',
    alignItems: 'center',
  },
  backNavigationButton: {
    width: 50,
    alignItems: 'center',
    height: 50,
    marginLeft: -20,
  },
  backButton: {
    backgroundColor: '#f0f8ff8f',
    padding: 5,
    borderRadius: 15,
    height: 40,
    width: '20%',
    marginLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  backButtonText: {fontSize: 20, color: '#2e2e2e'},
  top: {marginTop: -80},
});
