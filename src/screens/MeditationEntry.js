import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import {GET_USER, USER_ACTIVITY_BY_USERID} from '../graphql/query';
import {useQuery, useMutation} from '@apollo/client';
import getMeditationDuration from '../utils/meditationDuration';
import {startOfDay, endOfDay} from 'date-fns';
import * as Animatable from 'react-native-animatable';
import {useFocusEffect} from '@react-navigation/native';
import SCREENS from '../../SCREENS';
import {copilot, walkthroughable, CopilotStep} from 'react-native-copilot';
import {UPDATE_USER} from '../graphql/mutation';
import TimerImg from '../assets/images/Timer.png';
import HomeScreen from './Home/index'

const WalkthroughableView = walkthroughable(View);

function MeditationEntry({navigation, start, copilotEvents}) {
  const [isClicked, setClicked] = useState(false);
  const [session, setSession] = useState('');
  const [sessionType, setSessionType] = useState('');
  const [userId, setuserId] = useState(null);
  const [toolTip, setToolTip] = useState(false);
  const [updateUser] = useMutation(UPDATE_USER);
  const [isMorningMeditationDone, setMorningMeditationDone] = useState(false);
  const [isEveningMeditationDone, setEveningMeditationDone] = useState(false);

  const {data: userData, refetch: userRefetch} = useQuery(GET_USER, {
    variables: {id: userId},
    onCompleted: (data) => {
      if (data && !data.getUser.meditationCopilot) {
        start();
      }
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });
  const seconds = userData && userData.getUser.meditationDuration;
  const dateNow = new Date();

  const startDate = startOfDay(dateNow);
  const endDate = endOfDay(dateNow);

  const {refetch} = useQuery(USER_ACTIVITY_BY_USERID, {
    variables: {
      userId: userId,
      createdAt: {between: [startDate, endDate]},
    },
    onCompleted: (data) => {
      data.UserActivityByUserId.items.forEach((item) => {
        if (item.actionId == 'MORNING_MEDITATION') {
          setMorningMeditationDone(true);
        } else if (item.actionId == 'EVENING_MEDITATION') {
          setEveningMeditationDone(true);
        }
      });
      return true;
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  async function userfunc() {
    const user = await AsyncStorage.getItem('userId');
    setuserId(user);
    copilotEvents.on('stop', () => {
      updateUser({
        variables: {
          input: {
            id: user,
            meditationCopilot: true,
          },
        },
      });
    });
  }

  useFocusEffect(
    useCallback(() => {
      userfunc();
      refetch();
      userRefetch();
      console.warn('inside useeffect meditations');
    }, []),
  );

  function checkMorningSession() {
    console.warn('isMorningMeditationDone', isMorningMeditationDone);
    if (isMorningMeditationDone) {
      setSessionType('morning');
      setToolTip(true);
      setTimeout(() => {
        setToolTip(false);
      }, 3000);
    } else {
      setClicked(!isClicked);
      setSession('morning');
    }
  }
  function checkEveningSession() {
    if (isEveningMeditationDone) {
      setSessionType('evening');
      setToolTip(true);
      setTimeout(() => {
        setToolTip(false);
      }, 3000);
    } else {
      setClicked(!isClicked);
      setSession('evening');
    }
  }

  return (
    <><View  style={styles.container}><HomeScreen/></View>
     
      {/* <View style={styles.container}>
        <View style={styles.topMargin}>
          <Text style={styles.userName}>Welcome to Your</Text>
          <Text style={styles.titleTextOne}>Meditation</Text>
          <Text style={styles.titleTextTwo}>Room</Text>
          <View style={styles.timer}>
            <Image source={TimerImg} style={styles.timerImg} />
            <Text style={styles.timeText}>
              {getMeditationDuration(seconds)}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.containerTwo}>
        {!isClicked ? (
          <CopilotStep
            text="As you can see, You have a Morning Meditation Audio and an Evening Meditation Audio. Start and End your day with Meditation. You also Earn Socius Coins and XP's when you finish the Meditation."
            order={1}
            name="openApp">
            <WalkthroughableView style={styles.buttonContainer}>
              <>
                <TouchableOpacity
                  onPress={() => checkMorningSession()}
                  style={styles.morningBtn}>
                  <LinearGradient
                    start={{x: 1, y: 0}}
                    end={{x: 0, y: 0}}
                    colors={['#06b5d2', '#3ebdb4']}
                    style={styles.button}>
                    <Text style={styles.buttonText}>Morning</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.eveningBtn}
                  onPress={() => checkEveningSession()}>
                  <LinearGradient
                    start={{x: 1, y: 0}}
                    end={{x: 0, y: 0}}
                    colors={['#06b5d2', '#3ebdb4']}
                    style={styles.button}>
                    <Text style={styles.buttonText}>Evening</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            </WalkthroughableView>
          </CopilotStep>
        ) : (
          <View style={styles.proceedView}>
            <ScrollView contentContainerStyle={styles.scrollView}>
              <View style={styles.marginContainer}>
                <Text style={styles.timeText}>
                  The Meditation room is a place to clear your mind and focus on
                  what your priority is.
                </Text>
                <View style={styles.top}>
                  <Text style={styles.timeText}>
                    Ensure your are not distracted and try to complete the
                    entire duration.
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.btnWidth}
                onPress={() => {
                  setClicked(false);
                  navigation.navigate(SCREENS.MEDITATION_ROOM, {type: session});
                }}>
                <LinearGradient
                  start={{x: 1, y: 0}}
                  end={{x: 0, y: 0}}
                  colors={['#06b5d2', '#3ebdb4']}
                  style={styles.proceedButton}>
                  <Text style={styles.buttonText}>Proceed</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnWidth}
                onPress={() => {
                  setClicked(false);
                }}>
                <LinearGradient
                  start={{x: 1, y: 0}}
                  end={{x: 0, y: 0}}
                  colors={['#06b5d2', '#3ebdb4']}
                  style={styles.backToHomeButton}>
                  <Text style={styles.buttonText}>Back</Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}
      </View>

      {toolTip ? (
        <Animatable.View animation="fadeInUp" style={styles.toolTipView}>
          <LinearGradient
            start={{x: 1, y: 0}}
            end={{x: 0, y: 0}}
            colors={['#06b5d2', '#3ebdb4']}
            style={styles.toolTip}>
            <Text style={styles.toolTipText}>
              You have already done your {sessionType} meditation today.
            </Text>
          </LinearGradient>
        </Animatable.View>
      ) : null} */}
    </>
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
    paddingTop: 5,
  },
  verticalOffset: 36,
})(MeditationEntry);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252525',
    justifyContent: 'center',
  },
  topMargin: {
    marginTop: 70,
  },
  containerTwo: {
    flex: 0.5,
    backgroundColor: '#252525',
    justifyContent: 'center',
  },
  toolTipView: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    width: '100%',
  },
  toolTip: {
    width: '80%',
    padding: 10,
    borderRadius: 10,
  },
  toolTipText: {
    textAlign: 'center',
    fontSize: 14,
  },
  titleTextOne: {
    fontSize: 35,
    color: '#eeeeee',
    textAlign: 'left',
    margin: 20,
    fontWeight: '900',
    marginTop: -15,
    fontFamily: 'SFUIDisplay-Semibold',
  },
  titleTextTwo: {
    fontSize: 35,
    color: '#eeeeee',
    textAlign: 'left',
    margin: 20,
    marginTop: -15,
    fontWeight: '900',
    fontFamily: 'SFUIDisplay-Semibold',
  },
  timeText: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: '800',
    color: '#eeeeee',
    fontFamily: 'SFUIDisplay-Semibold',
  },
  top: {
    marginTop: 20,
  },
  proceedView: {
    backgroundColor: '#181818',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    borderRadius: 10,
  },
  scrollView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  marginContainer: {
    margin: 20,
  },
  userName: {
    fontSize: 30,
    color: '#eeeeee',
    textAlign: 'left',
    margin: 20,
    fontWeight: '900',
    fontFamily: 'SFUIDisplay-Semibold',
  },
  button: {
    margin: 25,
    padding: 10,
    borderRadius: 25,
  },
  proceedButton: {
    margin: 25,
    padding: 10,
    borderRadius: 25,
  },
  backToHomeButton: {
    marginTop: -5,
    margin: 25,
    marginBottom: 20,
    padding: 10,
    borderRadius: 25,
  },
  btnWidth: {
    width: '70%',
  },
  buttonContainer: {
    // flex: 0.55,
    margin: 25,
    marginTop: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  morningBtn: {
    width: '90%',
    marginTop: 50,
  },
  eveningBtn: {
    width: '90%',
    marginTop: -15,
  },
  timer: {
    margin: 25,
    marginTop: 0,
    flexDirection: 'row',
  },
  timerImg: {
    width: 25,
    height: 25,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'SFUIDisplay-Medium',
  },
});
