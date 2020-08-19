import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Switch,
  BackHandler,
  Alert,
  Dimensions,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import {
  CREATE_ACTIVITY,
  UPDATE_META_WORLD,
  UPDATE_TASK,
} from '../../graphql/mutation';
import {useMutation} from '@apollo/client';
import useEstimateRewards from '../../hooks/useEstimateRewards';
import CoinImg from '../../assets/images/SociusCoins.png';
import XpImg from '../../assets/images/XP.png';
import SCREENS from '../../../SCREENS';
import smileyGeniusImg from '../../assets/images/Genius.png';
import Sound from 'react-native-sound';

const SOUNDBUNDLE = Platform.OS == 'ios' ? '' : Sound.MAIN_BUNDLE

const MUSIC_URL =
  'https://littimages.s3.ap-south-1.amazonaws.com/music/RATING+AND+MEDITATION+POP+UP+AUDIO.mp3';

let sound = new Sound(MUSIC_URL, SOUNDBUNDLE, () => {});
const screenHeight = Math.round(Dimensions.get('window').height);

export default function EditMetaWorld({route, navigation}) {
  useEffect(() => {
    sound.stop();
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

  const {item, userId} = route.params;
  console.warn('item', item);
  const [isModal, setModal] = useState(false);
  const [isSuccessModal, setSuccessModal] = useState(false);
  const [createActivity] = useMutation(CREATE_ACTIVITY);
  const rewards = useEstimateRewards('METALIFE_MANIFESTED', userId);
  const {socioCoins, xps, newLevel, awardData, userData, levelUp} = rewards;
  const [isEnabled, setIsEnabled] = useState(item.materialised ? true : false);
  const [updateMetaWorld] = useMutation(UPDATE_META_WORLD);
  const [updateMetaTask] = useMutation(UPDATE_TASK);
  const materialisedIntention =
    userData &&
    userData.getUser.tasks.items.filter((i) => {
      return i.metaWorldId == item.id;
    });
  console.warn('materialisedIntention', userData);

  const updateMetaTaskHandler = () => {
    updateMetaTask({
      variables: {
        input: {
          id: materialisedIntention[0].id,
          materialisationDone: true,
        },
      },
    })
      .then((data) => {
        console.warn('meta updated data', data);
      })
      .catch((err) => {
        console.warn(err);
      });
  };

  const updateMetaWorldHandler = () => {
    updateMetaWorld({
      variables: {
        input: {
          id: item.id,
          materialised: isEnabled,
        },
      },
    })
      .then((data) => {
        console.warn('data', data);
        updateMetaTaskHandler();
        setModal(false);
        createUserActivity();
      })
      .catch((err) => {
        console.warn(err);
      });
  };

  const createUserActivity = () => {
    createActivity({
      variables: {
        input: {
          userId: userId,
          actionId: 'METALIFE_MANIFESTED',
          socioCoins,
          xps,
        },
      },
    })
      .then((data) => {
        console.log(data);
        sound.play();
        setSuccessModal(true);
      })
      .catch((err) => console.warn(err));
  };

  return (
    <>
      <View style={styles.containerHeader}>
        <TouchableOpacity
          style={styles.leftMargin}
          onPress={() => navigation.navigate(SCREENS.METAWORLD_MAIN)}>
          <Icon name="ios-arrow-back" color={'#975bc1'} size={30} />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <View style={styles.marginContainer}>
          <Text style={styles.title}>Your Meta Life</Text>
          <Text style={styles.wishText}>{item.name}</Text>
          <Text style={styles.descriptionText}>{item.description}</Text>
        </View>

        <View style={styles.marginContainer}>
          <View style={styles.materialisation}>
            <Text style={styles.secondTitle}>
              Planned date of Materialisation
            </Text>

            <View style={styles.date}>
              <Text style={styles.dateText}>
                {new Date(item.materialisationDate).toDateString().substr(3)}
              </Text>
            </View>
          </View>
          <View style={styles.top} />
          <View style={styles.materialise}>
            <Text style={styles.wishText}>Materialised</Text>
            <Switch
              trackColor={{false: '#767577', true: '#975bc1'}}
              thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                setIsEnabled(true);
                setModal(true);
              }}
              value={isEnabled}
              style={{transform: [{scaleX: 1}, {scaleY: 1}],marginTop:5}}
              disabled={isEnabled ? true : false}
            />
          </View>
          <View style={styles.imageContainer}>
            <Image source={{uri: item.url}} style={styles.image} />
          </View>
        </View>
      </View>

      <Modal isVisible={isModal} animationIn="zoomIn">
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            Are you sure want to materialise this metalife?
          </Text>
          <View style={styles.colBetween}>
            <View style={styles.rowAround}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setIsEnabled(!isEnabled);
                  setModal(false);
                }}>
                <LinearGradient
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  colors={['#13529f', '#975bc1']}
                  style={styles.modalButtonTextView}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  updateMetaWorldHandler();
                }}>
                <LinearGradient
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  colors={['#13529f', '#975bc1']}
                  style={styles.modalButtonTextView}>
                  <Text style={styles.modalButtonText}>Yes</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal isVisible={isSuccessModal} animationIn="zoomIn">
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
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              setSuccessModal(false);
              navigation.navigate(SCREENS.FINISH, {
                newLevel,
                socioCoins,
                userSocioCoins:
                  userData.getUser.socioCoins + userData.getUser.spentCoins,
                awardData,
                levelUp,
              });
            }}>
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
    marginTop: -20,
  },
  marginContainer: {margin: 20},
  containerHeader: {
    flex: 0.1,
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#ffff',
  },
  leftMargin: {marginLeft: 20},
  top: {marginTop: screenHeight/29.86},
  title: {
    fontSize: 30,
    color: '#2e2e2e',
    fontWeight: '900',
    fontFamily: 'GalanoGrotesqueDEMO-Bold',
  },
  smiley: {
    width: 100,
    height: 100,
  },
  row: {flexDirection: 'row'},
  modalTitle: {
    marginLeft: 10,
    fontSize: 22,
    color: '#0fb6cd',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
  },
  modalTextOne: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
    margin: 10,
  },
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
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modal: {
    flex: 0.6,
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wishText: {
    fontSize: 22,
    color: '#2e2e2e',
    marginTop: 10,
    fontWeight: '900',
    fontFamily: 'PointDEMO-SemiBold',
  },
  descriptionText: {
    fontSize: 20,
    color: '#2e2e2e',
    marginTop: 10,
    fontWeight: '900',
    fontFamily: 'PointDEMO-SemiBold',
  },
  secondTitle: {
    fontSize: 22,
    color: '#2e2e2e',
    fontWeight: '900',
    fontFamily: 'PointDEMO-SemiBold',
  },
  image: {
    borderRadius: 20,
    width: '100%',
    height: 220,
  },
  materialise: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  imageContainer: {
    // margin: 20,
    marginTop: 50,
    alignItems: 'center',
  },
  materialisation: {
    alignItems: 'center',
  },
  date: {
    width: '80%',
    color: '#2e2e2e',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 5,
    marginTop: 10,
  },
  dateText: {
    color: '#2e2e2e',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '900',
    fontFamily: 'PointDEMO-SemiBold',
  },
  modalButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '60%',
  },
  modalButtonText: {
    textAlign: 'center',
    fontSize: 14,
    // fontWeight: '800',
    color: '#eeeeee',
    fontWeight: '900',
    fontFamily: 'SFUIDisplay-Semibold',
  },
  modalButtonTextView: {
    margin: 25,
    padding: 10,
    borderRadius: 25,
    width: '50%',
  },
  modalText: {
    fontSize: 20,
    color: '#252525',
    fontWeight: '900',
    fontFamily: 'PointDEMO-SemiBold',
    textAlign: 'center',
    margin: 10,
  },
  modalView: {
    flex: 0.5,
    backgroundColor: '#ffff',
    margin: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colBetween: {flexDirection: 'column', justifyContent: 'space-between'},
  rowAround: {flexDirection: 'row', justifyContent: 'space-around'},
});
