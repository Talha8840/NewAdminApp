import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import Slider from 'react-native-slider';
import Icon from 'react-native-vector-icons/FontAwesome';
import CoinImg from '../../assets/images/SociusCoins.png';
import XpImg from '../../assets/images/XP.png';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import Sound from 'react-native-sound';
import SCREENS from '../../../SCREENS';
import morningMeditationImg from '../../assets/images/Morning-Meditation.jpg';
import eveningMeditationImg from '../../assets/images/Evening-Meditation.jpg';
import smileyGeniusImg from '../../assets/images/Genius.png';
import {navigateReward} from '../../utils/rewardsNavigation';

let sound;

export default function MeditationModal({sessionType, navigation, rewards}) {
  const [value, setValue] = useState(0);
  const [timer, setTimer] = useState(0.0);
  const [isPaused, setPaused] = useState(false);

  const [isModal, setModal] = useState(true);
  const [isCongrats, setCongrats] = useState(false);

  const {socioCoins, xps, newLevel, awardData, userData, levelUp} = rewards;

  console.warn(newLevel, 'newLevelnewLevel');

  const onClose = () => {
    setModal(!isModal);
    navigateReward(navigation, {
      newLevel,
      socioCoins,
      userSocioCoins: userData.getUser.socioCoins + userData.getUser.spentCoins,
      awardData,
      levelUp,
      screenName: 'MEDITATION_MODAL',
    });
  };
  const morningSession = {
    bgImage: morningMeditationImg,
    text: 'Create your best day ever',
  };
  const eveningSession = {
    bgImage: eveningMeditationImg,
    text: 'Create your dreams',
  };

  return (
    <ImageBackground
      source={
        sessionType == 'morning'
          ? morningSession.bgImage
          : eveningSession.bgImage
      }
      style={styles.container}>
      <View style={styles.subContainerOne}>
        <Text style={styles.headerText}>
          {sessionType == 'morning' ? morningSession.text : eveningSession.text}
        </Text>
      </View>
      <TouchableOpacity>
        <Icon name={`${isPaused ? 'play' : 'pause'}`} size={50} color="#ffff" />
      </TouchableOpacity>
      <View style={styles.subContainerTwo}>
        <Slider
          value={timer}
          onValueChange={(value) => setValue(value)}
          minimumTrackTintColor="#06b5d2"
          maximumTrackTintColor="#2d2d2d"
          thumbTintColor="transparent"
          animateTransitions={true}
          step={0.1}
          maximumValue={1.1}
        />
        <View style={styles.rowBetween}>
          <Text style={styles.timerText}>{timer.toFixed(1)}</Text>
          <Text style={styles.timerText}>
            {' '}
            {sessionType == 'morning' ? '5.35' : '6.50'}
          </Text>
        </View>
      </View>

      <Modal isVisible={isModal} animationIn="zoomIn">
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Good Job!</Text>
          <Image source={smileyGeniusImg} style={styles.smiley} />
          <Text style={styles.modalTextOne}>You have earned</Text>
          {socioCoins > 0 ? (
            <View style={styles.row}>
              <Text style={styles.modalTextTwo}>+{socioCoins}</Text>
              <Image
                source={CoinImg}
                resizeMode="contain"
                style={styles.iconImg}
              />
            </View>
          ) : null}
          {xps > 0 ? (
            <View style={styles.row}>
              <Text style={styles.modalTextTwo}>+{xps}</Text>
              <Image
                source={XpImg}
                resizeMode="contain"
                style={styles.iconImg}
              />
            </View>
          ) : null}
          <TouchableOpacity style={styles.modalButton} onPress={onClose}>
            <LinearGradient
              start={{x: 1, y: 0}}
              end={{x: 0, y: 0}}
              colors={['#06b5d2', '#3ebdb4']}
              style={styles.modalButtonTextView}>
              <Text style={styles.modalButtonText}>Ok</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal isVisible={isCongrats} animationIn="zoomIn">
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Congratulations!</Text>
          <Text style={styles.modalTextOne}>You have reached</Text>
          <View style={styles.row}>
            <Text style={styles.modalTextTwo}>Level {newLevel}</Text>
          </View>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              setCongrats(false);
              {
                navigation.navigate('TabNavigator', {
                  screen: SCREENS.MEDITATION_ENTRY,
                });
              }
            }}>
            <LinearGradient
              start={{x: 1, y: 0}}
              end={{x: 0, y: 0}}
              colors={['#06b5d2', '#3ebdb4']}
              style={styles.button}>
              <Text style={styles.modalButtonText}>Ok</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Modal>
    </ImageBackground>
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
    fontFamily: 'SFUIDisplay-Semibold',
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
  modal: {
    flex: 0.6,
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'SFUIDisplay-Medium',
  },
  modalTitle: {
    marginLeft: 10,
    fontSize: 22,
    color: '#0fb6cd',
    fontWeight: '900',
    textAlign: 'center',
    margin: 10,
    fontFamily: 'SFUIDisplay-Semibold',
  },
  modalTextOne: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
    margin: 10,
    fontFamily: 'SFUIDisplay-Medium',
  },
  row: {flexDirection: 'row'},
  modalTextTwo: {
    fontSize: 18,
    color: '#0fb6cd',
    fontWeight: '900',
    textAlign: 'center',
    marginRight: 5,
  },
  iconImg: {marginLeft: 5, width: 20, height: 20, marginTop: 2},
  modalTextThree: {
    fontSize: 18,
    color: '#ff7821',
    fontWeight: '900',
    textAlign: 'center',
    fontFamily: 'SFUIDisplay-Medium',
  },
  smiley: {
    width: 100,
    height: 100,
  },
  modalButtonTextView: {
    margin: 25,
    padding: 10,
    borderRadius: 25,
    width: '50%',
  },
  button: {
    margin: 25,
    padding: 10,
    borderRadius: 25,
    width: '50%',
  },
});
