import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Keyboard,
  Platform
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import LinearGradient from 'react-native-linear-gradient';
import Sound from 'react-native-sound';
import SCREENS from '../../../SCREENS';
import MetaLifeSuccessImg from '../../assets/images/Metalife-Created.png';
import ConfettiImg10 from '../../assets/images/Confetti-Diamond_2.png';
import ConfettiImg5 from '../../assets/images/Confetti-Diamond_3.png';
import Confetti from 'react-native-magic-confetti';
import FastImage from 'react-native-fast-image';
import {navigateReward} from '../../utils/rewardsNavigation';

const SOUNDBUNDLE = Platform.OS == 'ios' ? '' : Sound.MAIN_BUNDLE

const MUSIC_URL =
  'https://littimages.s3.ap-south-1.amazonaws.com/music/META+LIFE+CONGRATULATIONS+SCREEN.mp3';

let sound = new Sound(MUSIC_URL, SOUNDBUNDLE, () => {});

export default function MetaWorldCongratulation({navigation, route}) {
  const [showConfetti, setConfetti] = useState(true);
  const {
    metaLifeCoins,
    metaLifeXps,
    newLevel,
    userSocioCoins,
    awardData,
    levelUp,
    metaNewLevel,
    metaAwardData,
    metaLevelup,
  } = route.params;
  console.warn('metaLifeCoins', metaLifeCoins);
  console.warn('metaLifeXps', metaLifeXps);
  function playSound() {
    sound.play();
  }

  useEffect(() => {
    sound.stop();
    Keyboard.dismiss();
    playSound();
  }, []);

  return (
    <View style={styles.container}>
      {showConfetti ? (
        <Confetti
          count={40} // custom number of confettis
          size={32}
          colors={['#13529f', '#975bc1']}
          imageComponent={FastImage} // custom image component
          confettiImages={[ConfettiImg5, ConfettiImg10]} // all confetti images to be chosen randomly
          yspeed={3} // fall speed
        />
      ) : null}
      <Text style={styles.title}>Congratulations!</Text>
      <View>
        <Image source={MetaLifeSuccessImg} style={styles.image} />
      </View>
      <Text style={styles.successTextOne}>You have successfully</Text>
      <Text style={styles.successTextTwo}>Created your Meta Life</Text>

      <TouchableOpacity
        onPress={() => {
          setConfetti(false);
          navigateReward(navigation, {
            newLevel: newLevel || metaNewLevel,
            // socioCoins,
            userSocioCoins,
            awardData: awardData || metaAwardData,
            levelUp: levelUp || metaLevelup,
            screenName: 'META_WORLD_CONGRATULATIONS',
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
    fontWeight: '900',
    fontFamily: 'GalanoGrotesqueDEMO-Bold',
  },
  successTextOne: {
    fontSize: 22,
    color: '#626262',
    fontWeight: '900',
    fontFamily: 'PointDEMO-SemiBold',
    textAlign: 'center',
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
    fontWeight: '900',
    fontFamily: 'GalanoGrotesqueDEMO-Bold',
    textAlign: 'center',
    marginTop:15
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
