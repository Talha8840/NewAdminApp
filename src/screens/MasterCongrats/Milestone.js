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
import LinearGradient from 'react-native-linear-gradient';
import Sound from 'react-native-sound';
import ConfettiImg4 from '../../assets/images/Confetti-Diamond.png';
import ConfettiCoinImg from '../../assets/images/Socius_Coins_1.png';
import Confetti from 'react-native-magic-confetti';
import FastImage from 'react-native-fast-image';
import SCREENS from '../../../SCREENS';
import CoinImg from '../../assets/images/Socius_Coins_Double.png';

const SOUNDBUNDLE = Platform.OS == 'ios' ? '' : Sound.MAIN_BUNDLE

const MUSIC_URL =
  'https://littimages.s3.ap-south-1.amazonaws.com/music/EVERY+500%2C+1000+SOCIUS+COINS+SCREEN+AUDIO.mp3';

let sound = new Sound(MUSIC_URL, SOUNDBUNDLE, () => {});

export default function Milestone({navigation, route}) {
  const totalSocioCoins = route.params.socioCoins + route.params.userSocioCoins;

  const [showConfetti, setConfetti] = useState(true);
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
          count={30} // custom number of confettis
          size={17.5}
          colors={['#ff7821', '#0fb6cd']}
          imageComponent={FastImage} // custom image component
          confettiImages={[ConfettiImg4]} // all confetti images to be chosen randomly
          yspeed={2} // fall speed
        />
      ) : null}
      <Text style={styles.title}>Congratulations!</Text>
      <View style={styles.confettiContainer}>
        <Image source={ConfettiCoinImg} style={styles.image} />
      </View>
      <Text style={styles.title}>You just</Text>
      <Text style={styles.littUp}>Litt Up!</Text>
      <View style={styles.bodyContainer}>
        <Text style={styles.bodyText}>You have earned</Text>
        <View style={styles.result}>
          <Text style={styles.bodyTextTwo}>{totalSocioCoins}</Text>
          <Image
            source={CoinImg}
            style={styles.iconMargin}
            resizeMode="contain"
          />
          <Text style={styles.bodyTextFour}>till now</Text>
          {/* <CoinIcon
            name="circle"
            color={'#e5a445'}
            size={25}
            style={styles.iconMargin}
          /> */}
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          setConfetti(false);
          // navigateFunc('MILESTONE');
          navigation.navigate('TabNavigator', {screen: SCREENS.HOME});
        }}
        style={styles.center}>
        <LinearGradient colors={['#eeeeee', '#eeeeee']} style={styles.button}>
          <Text style={styles.buttonText}>Collect</Text>
        </LinearGradient>
      </TouchableOpacity>
      <View style={{width: '80%'}}>
        <Text style={styles.bodyTextFour}>
          You can earn more socius coins as you complete more intentions.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252525',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    color: '#eeeeee',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  confettiContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  col: {flexDirection: 'column'},
  confettiOne: {marginLeft: -10, marginTop: -80, position: 'absolute'},
  confettiTwo: {position: 'absolute', marginTop: -25, marginLeft: -20},
  confettiThree: {marginLeft: 15, position: 'absolute', marginTop: 5},
  confettiFour: {marginLeft: 10, position: 'absolute', marginTop: 35},
  confettiFive: {marginLeft: 30, marginTop: 60, position: 'absolute'},
  confettiSix: {marginLeft: -40, marginTop: -60, position: 'absolute'},
  confettiSeven: {marginLeft: 5, position: 'absolute', marginTop: 10},
  confettiEight: {marginLeft: -40, position: 'absolute', marginTop: 35},
  confettiNine: {marginLeft: -60, marginTop: 60, position: 'absolute'},
  mediumImg: {width: 25, height: 25},
  bigImg: {width: 50, height: 50},
  bodyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    marginTop: 20,
  },
  image: {
    width: 200,
    height: 200,
  },
  smallImg: {width: 15, height: 15},
  mediumSmallImg: {width: 20, height: 20},
  littUp: {
    fontSize: 40,
    color: '#eeeeee',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bodyText: {
    fontSize: 16,
    color: '#eeeeee',
    textAlign: 'center',
    marginBottom: 5,
  },
  result: {flexDirection: 'row', justifyContent: 'space-evenly'},
  bodyTextTwo: {
    fontSize: 18,
    color: '#e5a445',
    fontWeight: '900',
    textAlign: 'center',
  },
  bodyTextFour: {
    fontSize: 18,
    color: '#eeeeee',
    fontWeight: '900',
    textAlign: 'center',
  },
  iconMargin: {
    marginLeft: 5,
    width: 25,
    height: 25,
    marginRight: 5,
  },
  row: {flexDirection: 'row'},
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
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '900',
  },
  center: {justifyContent: 'center', alignItems: 'center'},
});
