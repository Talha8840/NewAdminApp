import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity,Platform} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Sound from 'react-native-sound';
import ConfettiCannon from 'react-native-confetti-cannon';
import ConfettiImg10 from '../../assets/images/Confetti-Diamond_2.png';
import ConfettiImg5 from '../../assets/images/Confetti-Diamond_3.png';
import Confetti from 'react-native-magic-confetti';
import FastImage from 'react-native-fast-image';
import {navigateFromAward} from '../../utils/rewardsNavigation';

const SOUNDBUNDLE = Platform.OS == 'ios' ? '' : Sound.MAIN_BUNDLE

const MUSIC_URL =
  'https://littimages.s3.ap-south-1.amazonaws.com/music/AWARDS+CONGRATULATIONS+SCREEN.mp3';

let sound = new Sound(MUSIC_URL, SOUNDBUNDLE, () => {});

export default function AwardCongrats({navigation, route}) {
  const award = route.params.awardData;

  console.warn('award', award);
  const [showConfetti, setConfetti] = useState(true);
  function playSound() {
    sound.play();
  }
  useEffect(() => {
    sound.stop();
    if (award.url) {
      playSound();
    }
  }, []);
  return (
    award.url && (
      <View style={styles.container}>
        {showConfetti ? (
          <Confetti
            count={50} // custom number of confettis
            size={30}
            colors={['#e5a445', '#ff7821', '#0fb6cd']}
            imageComponent={FastImage} // custom image component
            confettiImages={[ConfettiImg5, ConfettiImg10]} // all confetti images to be chosen randomly
            yspeed={1.5} // fall speed
          />
        ) : null}
        <Text style={styles.title}>Congratulations!</Text>
        <View>
          <FastImage
            source={{uri: award.url}}
            style={styles.image}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
        <Text style={styles.successTextOne}>{award.text1}</Text>
        <Text style={styles.successTextTwo}>{award.text2}</Text>
        <TouchableOpacity
          onPress={() => {
            setConfetti(false);
            // navigateFunc('AWARD');
            navigateFromAward(navigation, route.params);
          }}
          style={styles.center}>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={['#0fb6cd', '#0fb6cd']}
            style={styles.button}>
            <Text style={styles.buttonText}>Proceed</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    )
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
    color: '#2e2e2e',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '900',
    fontFamily: 'GalanoGrotesqueDEMO-Bold',
  },
  successTextOne: {
    fontSize: 20,
    color: '#2e2e2e',
    fontWeight: '900',
    fontFamily: 'PointDEMO-SemiBold',
    textAlign: 'center',
    // marginBottom:10,
    marginTop: 20,
  },
  bodyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    marginTop: 20,
  },
  image: {
    width: 180,
    height: 180,
  },
  successTextTwo: {
    fontSize: 35,
    color: '#626262',
    fontWeight: '900',
    fontFamily: 'GalanoGrotesqueDEMO-Bold',
    textAlign: 'center',
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
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '900',
    color: '#2e2e2e',
  },
  center: {justifyContent: 'center', alignItems: 'center'},
});
