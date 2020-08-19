import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  BackHandler,
  Dimensions,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import CoinImg from '../assets/images/SociusCoins.png';
import XpImg from '../assets/images/XP.png';
import CustomSlider from './Home/Slider/CustomSlider';
import {useMutation} from '@apollo/client';
import {CREATE_ACTIVITY, UPDATE_USER} from '../graphql/mutation';
import useCanRate from '../hooks/useCanRate';
import useEstimateRewards from '../hooks/useEstimateRewards';
import {ratings} from '../utils/mapRatings';
import CustomAlert from '../components/CustomAlert';
import Sound from 'react-native-sound';
import {copilot, walkthroughable, CopilotStep} from 'react-native-copilot';
import SCREENS from '../../SCREENS';
import moment from 'moment';
import {navigateReward} from '../utils/rewardsNavigation';

const MUSIC_URL =
  'https://littimages.s3.ap-south-1.amazonaws.com/music/RATING+AND+MEDITATION+POP+UP+AUDIO.mp3';

let sound = new Sound(MUSIC_URL, Sound.MAIN_BUNDLE, () => {});

const screenHeight = Math.round(Dimensions.get('window').height);
const USER_ACTIVITY_MAPPINGS = {
  1: 'INTENTION_RATING_DIDNOTDO',
  2: 'INTENTION_RATING_BAD',
  3: 'INTENTION_RATING_OKAY',
  4: 'INTENTION_RATING_GOOD',
  5: 'INTENTION_RATING_GREAT',
  6: 'INTENTION_RATING_GENIUS',
};

const WalkthroughableView = walkthroughable(View);

function RateIntention({navigation, route, start, copilotEvents}) {
  const {intention, userId, categories} = route.params;
  console.warn('inte', intention);
  const [toolTip, setToolTip] = useState(false);
  const [toolTipMessage, setToolTipMessage] = useState(false);
  navigation.setOptions({
    headerStyle: {
      elevation: 0,
      backgroundColor: 'transparent',
    },
    headerLeft: () => (
      <TouchableOpacity
        onPress={() => navigation.navigate(SCREENS.HOME)}
        style={styles.btnPadding}>
        <Icon
          name="ios-arrow-back"
          size={30}
          color={
            intention.category != null
              ? categories[intention.categoryId].color
              : '#06b5d2'
          }
          style={styles.iconMargin}
        />
      </TouchableOpacity>
    ),
  });
  const [createActivity] = useMutation(CREATE_ACTIVITY);
  const [isModal, setModal] = useState(false);
  const [isCongrats, setCongrats] = useState(false);
  const [sliderValue, setSliderValue] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.warn('sliderValue===>', sliderValue);
  const rewards = useEstimateRewards(
    USER_ACTIVITY_MAPPINGS[sliderValue],
    userId,
  );

  const [updateUser] = useMutation(UPDATE_USER);
  const {socioCoins, xps, newLevel, awardData, userData, levelUp} = rewards;
  const canUpdate = useCanRate(userId, intention);
  const currentTime = new Date().getTime();
  const oneHourCheck = moment(intention.createdAt).add(60, 'm');
  const oneHourInSeconds = new Date(oneHourCheck).getTime();
  const allowEdit =
    intention.createdAt === intention.updatedAt &&
    (new Date().toISOString() >= new Date(intention.endDate).toISOString() ||
      currentTime <= oneHourInSeconds);
  function playSound() {
    sound.play();
  }

  const startDateInSeconds = new Date(intention.startDate).getTime();
  const endDateInSeconds = new Date(intention.endDate).getTime();

  const handleCreateActivity = () => {
    if (currentTime > startDateInSeconds && currentTime < endDateInSeconds) {
      if (canUpdate) {
        setIsSubmitting(true);
        createActivity({
          variables: {
            input: {
              userId: userId,
              taskId: intention.id,
              actionId: USER_ACTIVITY_MAPPINGS[sliderValue],
              socioCoins,
              xps,
            },
          },
        })
          .then((data) => {
            playSound();
            setModal(!isModal);
          })
          .catch((err) => {
            setIsSubmitting(false);
            setToolTip(true);
            setToolTipMessage('Something went wrong. Please try again');
            setTimeout(() => {
              setToolTip(false);
            }, 3000);
          });
      } else {
        setToolTip(true);
        setToolTipMessage(
          'You can rate the task only once a day. Please try again tomorrow',
        );
        setTimeout(() => {
          setToolTip(false);
        }, 3000);
      }
    } else {
      setToolTip(true);
      setToolTipMessage(
        'You can rate an item only between the start and end date',
      );
      setTimeout(() => {
        setToolTip(false);
      }, 3000);
    }
  };

  const editIntention = () => {
    if (allowEdit) navigation.navigate(SCREENS.EDIT_INTENTION, {intention});
    else {
      setToolTip(true);
      setToolTipMessage('You can edit the task only after 21 days of creation');
      setTimeout(() => {
        setToolTip(false);
      }, 3000);
    }
  };

  useEffect(() => {
    sound.stop();

    const timeOut = setTimeout(() => {
      if (userData && !userData.getUser.rateIntentionCopilot) start();
    }, 600);

    copilotEvents.on('stop', () => {
      updateUser({
        variables: {
          input: {
            id: userId,
            rateIntentionCopilot: true,
          },
        },
      });
    });
    const backAction = () => {
      navigation.navigate(SCREENS.HOME);
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => {
      backHandler.remove();
      clearTimeout(timeOut);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.containerHeader}>
        <TouchableOpacity
          onPress={() => navigation.navigate(SCREENS.HOME)}
          style={styles.btnPadding}>
          <Icon
            name="ios-arrow-back"
            size={30}
            color={
              intention.category != null
                ? categories[intention.categoryId].color
                : '#06b5d2'
            }
            style={styles.iconMargin}
          />
        </TouchableOpacity>
        <View style={styles.marginContainer}>
          <Text
            style={{
              color:
                intention.category != null
                  ? categories[intention.categoryId].color
                  : '#06b5d2',
              fontSize: 20,
              fontWeight: '900',
              fontFamily: 'SFUIDisplay-Semibold',
            }}>
            {intention.categoryId == 'METALIFE'
              ? 'Meta Task'
              : intention.categoryId}
          </Text>
          <Text style={styles.intentionDescription}>
            {intention.description}
          </Text>
        </View>
      </View>

      <CopilotStep
        text="This is the Rating screen. There are six different ratings that you can give yourself. Each rating carries Socius Coins and XP."
        order={1}
        name="openApp">
        <WalkthroughableView style={styles.containerBody}>
          <Text style={styles.rateText}>Rate yourself</Text>
          <View style={styles.customSliderView}>
            <CustomSlider
              setSliderValue={setSliderValue}
              sliderValue={sliderValue}
              min={1}
              max={6}
              LRpadding={40}
              single={true}
            />
          </View>
          {!isSubmitting ? (
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={handleCreateActivity}>
              <LinearGradient
                start={{x: 1, y: 0}}
                end={{x: 0, y: 0}}
                colors={['#06b5d2', '#3ebdb4']}
                style={styles.button}>
                <Text style={styles.buttonText}>Submit</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.buttonContainer}>
              <LinearGradient
                start={{x: 1, y: 0}}
                end={{x: 0, y: 0}}
                colors={['#C0C0C0', '#A9A9A9']}
                style={styles.button}>
                <Text style={styles.buttonText}>Rating...</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </WalkthroughableView>
      </CopilotStep>

      <View style={styles.divider} />
      <View style={styles.containerBodyTwo}>
        {intention.taskType == 'admin' ? null : (
          <>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={editIntention}>
              <LinearGradient
                colors={['#c9c9c9', '#c9c9c9']}
                style={styles.button}>
                <Text style={styles.buttonText}>Edit</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setToolTip(true);
                setToolTipMessage('You cannot delete a task for now');
              }}
              style={styles.deleteButton}>
              <LinearGradient
                colors={['#c9c9c9', '#c9c9c9']}
                style={styles.button}>
                <Text style={styles.buttonText}>Delete</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
        <Modal isVisible={isModal} animationIn="zoomIn">
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{ratings[sliderValue].text}!</Text>
            <Image source={ratings[sliderValue].smiley} style={styles.smiley} />
            <Text style={styles.modalTextOne}>
              {ratings[sliderValue].text == 'Genius'
                ? 'Good Job Genius!'
                : socioCoins && xps > 0
                ? 'You have earned'
                : ''}
            </Text>
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
                setModal(!isModal);
                navigateReward(navigation, {
                  newLevel,
                  socioCoins,
                  userSocioCoins:
                    userData.getUser.socioCoins + userData.getUser.spentCoins,
                  awardData,
                  levelUp,
                  screenName: 'RATE_INTENTION',
                });
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
      </View>
      {toolTip && <CustomAlert displayText={toolTipMessage} />}
    </View>
  );
}
export default copilot({
  overlay: 'svg',
  animated: true,
  allowSkip: false,
  labels: {
    skip: ' ',
  },
  backdropColor: '#ffffff52',
  tooltipStyle: {
    borderRadius: 10,
    paddingTop: 10,
  },
  verticalOffset: screenHeight / 32,
})(RateIntention);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252525',
    marginTop: Platform == 'android' ? -65 : null,
  },
  marginContainer: {margin: 20},
  // containerHeader: {
  //   flex: 0.25,
  //   margin: 20,
  // },
  containerHeader: {
    // flex: 0.25,
    flexDirection: 'row',
    margin: 20,
    width: '100%',
  },
  backNavigationButton: {
    width: 50,
    alignItems: 'center',
    height: 50,
    marginLeft: -20,
  },
  containerBody: {
    flex: 0.55,
    margin: 20,
    // marginTop: 30,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  iconImg: {marginLeft: 5, width: 20, height: 20, marginTop: 2},

  toolTipView: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    width: '100%',
  },
  btnPadding: {padding: 5},
  iconMargin: {marginLeft: -10, marginTop: 20},
  toolTip: {
    width: '80%',
    padding: 10,
    borderRadius: 10,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
  },
  modal: {
    flex: 0.6,
    backgroundColor: '#ffff',
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
    fontWeight: '900',
    fontFamily: 'SFUIDisplay-Semibold',
  },
  containerBodyTwo: {
    flex: 0.35,
    margin: 20,
  },
  smiley: {
    width: 100,
    height: 100,
  },
  titleText: {
    fontSize: 22,
    color: '#eeeeee',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '900',
    fontFamily: 'SFUIDisplay-Semibold',
  },
  input: {
    marginTop: 20,
    borderColor: '#06b5d2',
    borderBottomWidth: 0.75,
    fontSize: 18,
    color: '#eeeeee',
  },
  textArea: {
    marginTop: 30,
    borderColor: '#06b5d2',
    borderWidth: 0.75,
    fontSize: 18,
    color: '#eeeeee',
    justifyContent: 'flex-start',
    height: 150,
  },
  button: {
    margin: 25,
    padding: 10,
    borderRadius: 25,
    width: '50%',
  },
  intentionDescription: {
    color: '#eeeeee',
    fontSize: 18,
    textAlign: 'left',
    // marginLeft: 50,
    fontWeight: '900',
    fontFamily: 'SFUIDisplay-Semibold',
  },
  rateText: {
    color: '#eeeeee',
    fontSize: 26,
    textAlign: 'left',
    marginLeft: 15,
    fontWeight: '900',
    fontFamily: 'SFUIDisplay-Semibold',
  },
  customSliderView: {
    width: '90%',
    margin: 15,
  },
  divider: {
    borderWidth: 0.2,
    borderBottomColor: '#eeeeee',
    margin: 20,
  },
  modalTitle: {
    marginLeft: 10,
    fontSize: 22,
    color: '#0fb6cd',
    textAlign: 'center',
    margin: 10,
    fontWeight: '900',
    fontFamily: 'SFUIDisplay-Semibold',
  },
  alertTitle: {
    marginLeft: 10,
    fontSize: 22,
    color: '#252525',
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
  },
  modalTextThree: {
    fontSize: 18,
    color: '#ff7821',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
