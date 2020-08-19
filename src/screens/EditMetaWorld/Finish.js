import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity,Platform} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ConfettiCannon from 'react-native-confetti-cannon';
import Sound from 'react-native-sound';
import SCREENS from '../../../SCREENS';
import MetaLifeMaterializedImg from '../../assets/images/Meta-life-Materialised.png';
import ConfettiImg10 from '../../assets/images/Confetti-Diamond_2.png';
import ConfettiImg5 from '../../assets/images/Confetti-Diamond_3.png';
import Confetti from 'react-native-magic-confetti';
import FastImage from 'react-native-fast-image';
import {navigateReward} from '../../utils/rewardsNavigation';

const SOUNDBUNDLE = Platform.OS == 'ios' ? '' : Sound.MAIN_BUNDLE

const MUSIC_URL =
  'https://littimages.s3.ap-south-1.amazonaws.com/music/META+LIFE+MATERIALISED+Screen+Trimmed.mp3';

let sound = new Sound(MUSIC_URL, SOUNDBUNDLE, () => {});

export default function Finish({navigation, route}) {
  const [showConfetti, setConfetti] = useState(true);
  const {
    newLevel,
    socioCoins,
    userSocioCoins,
    awardData,
    levelUp,
  } = route.params;

  function playSound() {
    sound.play();
  }

  useEffect(() => {
    sound.stop();
    playSound();
  }, []);

  return (
    <View style={styles.container}>
      {showConfetti ? (
        <Confetti
          count={50} // custom number of confettis
          size={25}
          colors={['#e5a445', '#ff7821', '#13529f', '#975bc1']}
          imageComponent={FastImage}
          confettiImages={[ConfettiImg5, ConfettiImg10]}
          yspeed={1}
        />
      ) : null}
      <Text style={styles.successTextTwo}>Congratulations!</Text>
      <View>
        <Image
          source={MetaLifeMaterializedImg}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={{margin: 20}}>
        <Text style={styles.successTextOne}>
          Your Creation has been materialized in your life. Very well done.
        </Text>
        <Text style={styles.successTextOne}>
          Continue changing and creating your future.
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          setConfetti(false);
          sound.stop();
          navigateReward(navigation, {
            newLevel,
            socioCoins,
            userSocioCoins,
            awardData,
            levelUp,
            screenName: 'EDIT_META_WORLD',
          });
        }}
        style={styles.center}>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          colors={['#13529f', '#975bc1']}
          style={styles.button}>
          <Text style={styles.buttonText}>Ok</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    color: '#975bc1',
    fontWeight: '900',
    textAlign: 'center',
  },
  successTextOne: {
    fontSize: 20,
    color: '#626262',
    fontWeight: '900',
    textAlign: 'center',
    fontFamily: 'PointDEMO-SemiBold',
    // margin: 20,
  },

  bodyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    marginTop: 20,
  },
  image: {
    width: 300,
    height: 300,
  },
  successTextTwo: {
    fontSize: 25,
    color: '#626262',
    // fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'GalanoGrotesqueDEMO-Bold',
    fontWeight: '900',
  },
  bodyText: {
    fontSize: 16,
    color: '#eeeeee',
    textAlign: 'center',
  },
  bodyTextTwo: {
    fontSize: 18,
    color: '#0fb6cd',
    fontWeight: '900',
    textAlign: 'center',
  },
  bodyTextThree: {
    fontSize: 18,
    color: '#ff7821',
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 10,
  },
  button: {
    margin: 25,
    padding: 10,
    borderRadius: 25,
    width: 200,
  },
  center: {justifyContent: 'center', alignItems: 'center'},
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '900',
    color: '#ffff',
  },
});
