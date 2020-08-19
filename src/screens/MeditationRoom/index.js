import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  AppState,
  Text,
  ImageBackground,
  BackHandler,
  Alert,
  TouchableOpacity,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Sound from 'react-native-sound';
import Slider from 'react-native-slider';
import Icon from 'react-native-vector-icons/FontAwesome';
import MeditationModal from './MeditationModal';
import morningMeditation from '../../assets/images/Morning-Meditation.jpg';
import eveningMeditation from '../../assets/images/Evening-Meditation.jpg';
import KeepAwake from 'react-native-keep-awake';
import SCREENS from '../../../SCREENS';
import {useFocusEffect} from '@react-navigation/native';
import {CREATE_ACTIVITY} from '../../graphql/mutation';
import {useMutation} from '@apollo/client';
import useEstimateRewards from '../../hooks/useEstimateRewards';

let interval;
let timerMinutes;
let timerSeconds;
let sound;

const SOUNDBUNDLE = Platform.OS == 'ios' ? '' : Sound.MAIN_BUNDLE

let morningSound = new Sound(
  'https://littimages.s3.ap-south-1.amazonaws.com/music/Morning+Meditation+432Hz.mp3',
  SOUNDBUNDLE,
);

let eveningSound = new Sound(
  'https://littimages.s3.ap-south-1.amazonaws.com/music/Evening+Meditation+432Hz.mp3',
  SOUNDBUNDLE,
);

const MUSIC_URL =
  'https://littimages.s3.ap-south-1.amazonaws.com/music/RATING+AND+MEDITATION+POP+UP+AUDIO.mp3';

let modalSound = new Sound(MUSIC_URL, SOUNDBUNDLE, () => {});

const getRemaining = (time) => {
  const mins = Math.floor(time / 60);
  const secs = time - mins * 60;
  return {mins, secs};
};

export default function MeditationRoom({navigation, route}) {
  const sessionType = route.params.type;

  const [value, setValue] = useState(0);
  const [playFirstTime, setplayFirstTime] = useState(true);
  const [timer, setTimer] = useState(0);
  const [minutesTimer, setMinutesTimer] = useState(0);
  const [secondsTimer, setSecondsTimer] = useState(0);
  const [isPaused, setPaused] = useState(true);
  const [isComplete, setComplete] = useState(false);
  const [createActivity] = useMutation(CREATE_ACTIVITY);
  const {mins, secs} = getRemaining(secondsTimer);
  const [userId, setuserId] = useState(null);

  const rewards = useEstimateRewards(
    sessionType == 'morning' ? 'MORNING_MEDITATION' : 'EVENING_MEDITATION',
    userId,
  );
  const {socioCoins, xps, newLevel, awardData, userData, levelUp} = rewards;

  async function userfunc() {
    const user = await AsyncStorage.getItem('userId');
    setuserId(user);
  }

  const morningSession = {
    bgImage: morningMeditation,
    text: 'Create your best day ever',
  };
  const eveningSession = {
    bgImage: eveningMeditation,
    text: 'Create your dreams',
  };

  function playModalSound() {
    modalSound.play();
  }

  function _createActivity() {
    setTimeout(() => {
      playModalSound();
      setComplete(true);
    }, 500);
    createActivity({
      variables: {
        input: {
          userId: userId,
          actionId:
            sessionType == 'morning'
              ? 'MORNING_MEDITATION'
              : 'EVENING_MEDITATION',
          value: sessionType == 'morning' ? 300 : 420,
          socioCoins,
          xps,
        },
      },
    })
      .then((data) => {
        clearInterval(timerSeconds);
      })
      .catch((err) => {
        console.warn(err, 'error from meditation room');
        clearInterval(interval);
      });
  }

  function playSound() {
    sound = sessionType === 'morning' ? morningSound : eveningSound;
    KeepAwake.activate();
    sound.play(async (success) => {
      if (success) {
        await _createActivity();
        KeepAwake.deactivate();
      }
    });
  }

  function playTimer() {
    timerSeconds = setInterval(() => {
      sound.getCurrentTime((seconds) => {
        console.log('current ' + seconds);
        setSecondsTimer(Math.floor(seconds));
        setTimer(seconds);
      });
    }, 1000);
  }

  function pauseTimer() {
    clearInterval(timerSeconds);
  }

  useEffect(() => {
    console.warn(secondsTimer, 'secondsTimer');
    userfunc();
    let timerSeconds = null;

    AppState.addEventListener(
      'change',
      (state) => {
        console.log('state===>', state);
        if (state === 'background') {
          pauseTimer();
          sound.stop();
          clearInterval(timerSeconds);
          setSecondsTimer(0);
          setPaused(true);
          setTimer(0);
          setplayFirstTime(true);
          // navigation.navigate(SCREENS.MEDITATION_ENTRY)
        }
      },
      [],
    );

    const backAction = () => {
      sessionType === 'morning' ? morningSound.pause() : eveningSound.pause();
      pauseTimer();
      clearInterval(timerSeconds);
      sessionType === 'morning' ? morningSound.stop() : eveningSound.stop();
      navigation.navigate(SCREENS.MEDITATION_ENTRY);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [timerSeconds, isPaused]);

  return (
    <>
      {!isComplete ? (
        <ImageBackground
          source={
            sessionType == 'morning'
              ? morningSession.bgImage
              : eveningSession.bgImage
          }
          style={styles.container}>
          <View style={styles.subContainerOne}>
            <Text style={styles.headerText}>
              {sessionType == 'morning'
                ? morningSession.text
                : eveningSession.text}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              if (!isPaused) {
                sound.pause();
                pauseTimer();
                clearInterval(timerSeconds);
                setPaused(true);
              } else {
                if (playFirstTime) {
                  playSound();
                  setplayFirstTime(false);
                } else {
                  sound.play(async (success) => {
                    if (success) {
                      await _createActivity();
                      KeepAwake.deactivate();
                    }
                  });
                }
                playTimer();
                setPaused(false);
              }
            }}>
            <Icon
              name={`${isPaused ? 'play' : 'pause'}`}
              size={50}
              color="#ffff"
            />
          </TouchableOpacity>
          <View style={styles.subContainerTwo}>
            <Slider
              value={timer}
              onValueChange={(value) => setValue(value)}
              minimumTrackTintColor="#06b5d2"
              maximumTrackTintColor="#2d2d2d"
              thumbTintColor="transparent"
              animateTransitions={true}
              step={1}
              maximumValue={sessionType == 'morning' ? 315 : 386}
            />
            <View style={styles.rowBetween}>
              <Text style={styles.timerText}>
                {mins}:{secs.toString().length === 1 ? `0${secs}` : secs}
              </Text>
              <Text style={styles.timerText}>
                {sessionType == 'morning' ? '5.27' : '6.45'}
              </Text>
            </View>
          </View>
        </ImageBackground>
      ) : (
        <MeditationModal
          sessionType={sessionType}
          rewards={rewards}
          navigation={navigation}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 25,
    color: '#eeeeee',
    textAlign: 'left',
    fontWeight: '900',
    width: '45%',
    fontFamily: 'SFUIDisplay-Medium',
  },
  subContainerOne: {
    flex: 0.5,
    width: '90%',
    justifyContent: 'center',
    marginTop: -20,
  },
  subContainerTwo: {
    flex: 0.5,
    width: '90%',
    margin: 15,
    justifyContent: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timerText: {color: '#eeeeee'},
});
