import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity,Platform} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import LinearGradient from 'react-native-linear-gradient';
import {GET_LEVEL} from '../../graphql/query';
import {useQuery} from '@apollo/client';
import Sound from 'react-native-sound';
import levelUpImg from '../../assets/images/Level-Up.png';

import ConfettiImg10 from '../../assets/images/Confetti-Diamond_4.png';
import ConfettiImg5 from '../../assets/images/Confetti-Diamond_4.png';
import Confetti from 'react-native-magic-confetti';
import FastImage from 'react-native-fast-image';
import {navigateFromLevel} from '../../utils/rewardsNavigation';

const SOUNDBUNDLE = Platform.OS == 'ios' ? '' : Sound.MAIN_BUNDLE

const MUSIC_URL =
  'https://littimages.s3.ap-south-1.amazonaws.com/music/LEVEL+UP+AUDIO.mp3';

let sound = new Sound(MUSIC_URL, SOUNDBUNDLE, () => {});

export default function LevelUpCongrats({navigation, route}) {
  const level = route.params.newLevel;

  const [showConfetti, setConfetti] = useState(true);
  const {data} = useQuery(GET_LEVEL, {
    skip: !level,
    variables: {
      id: level,
    },
  });

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
          count={60}
          size={25}
          colors={['#eeeeee', '#0fb6cd']}
          imageComponent={FastImage}
          confettiImages={[ConfettiImg5, ConfettiImg10]}
          yspeed={2} // fall speed
        />
      ) : null}
      <View>
        <Image source={levelUpImg} style={styles.image} />
      </View>
      <Text style={styles.title}>Good job on levelling up!</Text>
      <Text style={styles.littUp}>You have reached Level {level}</Text>
      <Text style={styles.unlockTask}>
        You have unlocked {data && data.getLevel.maxTask} task
      </Text>
      {/* <View style={styles.bodyContainer}>
        <View style={{flexDirection: 'row', margin: 10}}>
          <Text style={styles.bodyTextTwo}>+250 Xp gained</Text>
        </View>
      </View> */}
      <TouchableOpacity
        onPress={() => {
          setConfetti(false);
          // navigateFunc('LEVEL');
          navigateFromLevel(navigation, route.params);
        }}
        style={styles.center}>
        <LinearGradient
          start={{x: 1, y: 0}}
          end={{x: 0, y: 0}}
          colors={['#06b5d2', '#3ebdb4']}
          style={styles.button}>
          <Text style={styles.buttonText}>Done</Text>
        </LinearGradient>
      </TouchableOpacity>
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
    fontWeight: '900',
    fontFamily: 'PointDEMO-SemiBold',
    textAlign: 'center',
    marginTop: 30,
  },
  unlockTask: {
    fontSize: 22,
    color: '#eeeeee',
    fontWeight: '900',
    fontFamily: 'PointDEMO-SemiBold',
    textAlign: 'center',
    marginTop: 30,
  },
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
  littUp: {
    fontSize: 30,
    color: '#eeeeee',
    fontFamily: 'GalanoGrotesqueDEMO-Bold',
    textAlign: 'center',
    margin: 50,
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
  },
  center: {justifyContent: 'center', alignItems: 'center'},
});
