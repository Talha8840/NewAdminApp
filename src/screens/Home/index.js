import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  BackHandler,
  Dimensions,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import AddIcon from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import Summary from './Summary';
import IntentionsList from './ListIntention';
import {useQuery, useMutation} from '@apollo/client';
import {
  GET_USER,
  GET_CONCENTRICCALCULATION,
  GET_LEVELSBYRANKID,
} from '../../graphql/query';
import * as Animatable from 'react-native-animatable';
import {useFocusEffect} from '@react-navigation/native';
import {USER_ACTIVITY_BY_USERID} from '../../graphql/query';
import {
  UPDATE_USER,
  SCHEDULED_PUSH_NOTIFICATIONS,
} from '../../graphql/mutation';
import {startOfDay, endOfDay} from 'date-fns';
import {copilot, walkthroughable, CopilotStep} from 'react-native-copilot';
import SCREENS from '../../../SCREENS';
import avatarImg from '../../assets/images/avatar.png';
import CoinImg from '../../assets/images/SociusCoins.png';
import {Auth} from 'aws-amplify';
import Modal from 'react-native-modal';

const WalkthroughableView = walkthroughable(View);

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

function HomeScreenIndex({navigation, start, copilotEvents}) {
  const [userId, setuserId] = useState(null);
  const [toolTip, setToolTip] = useState(false);
  const [socioCoinsEarned, setSocioCoinsEarned] = useState(0);
  const [xpsEarned, setXpsEarned] = useState(0);
  const [taskDone, setTaskDone] = useState(0);
  const [secondStepActive] = useState(true);
  const [updateUser] = useMutation(UPDATE_USER);
  const [userData, setUserData] = useState(null);
  const [isModal, setModal] = useState(false);
  const {loading, refetch} = useQuery(GET_USER, {
    variables: {id: userId},
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      setUserData(data);
      if (data && !data.getUser.homeCopilot) {
        // setModal(true);
        start();
      }
    },
    skip: !userId,
  });
  const {data: levelData, loading: loadingLvl} = useQuery(GET_LEVELSBYRANKID, {
    variables: {rankId: userData && userData.getUser.rankId},
    fetchPolicy: 'network-only',
    // skip: !userId,
  });
  const levelsArr =
    levelData &&
    levelData.levelsByRankId.items.map((i) => {
      return Number(i.id);
    });

  const maxLvl = levelsArr ? Math.max(...levelsArr) : 0;

  const calculatedRank =
    userData && parseInt(userData.getUser.levelId) / maxLvl;
  const {data: concentricData, refetch: concentricDataRefetch} = useQuery(
    GET_CONCENTRICCALCULATION,
    {
      variables: {
        userLevelId: userData && userData.getUser.levelId,
        taskLength: userData && userData.getUser.tasks.items.length,
      },
      fetchPolicy: 'cache-and-network',
      skip: !userData,
    },
  );

  const maxConcentricCoins =
    (concentricData && concentricData.concentricCalculation.socioCoins) || 1;

  const maxConcentricXps =
    (concentricData && concentricData.concentricCalculation.xps) || 1;

  const maxConcentricTasks =
    (userData && userData.getUser.tasks.items.length) || 1;

  const dateNow = new Date();

  const startDate = startOfDay(dateNow);
  const endDate = endOfDay(dateNow);
  const {refetch: activityRefetch} = useQuery(USER_ACTIVITY_BY_USERID, {
    variables: {
      userId: userId,
      createdAt: {between: [startDate, endDate]},
    },
    onCompleted: (data) => {
      let earnedSocioCoins = 0;
      let earnedXps = 0;
      let taskDone = 0;
      for (let i of data.UserActivityByUserId.items) {
        if (
          i.actionId.indexOf('INTENTION_RATING') == 0 ||
          i.actionId.indexOf('MEDITATION') != -1
        ) {
          earnedSocioCoins = earnedSocioCoins + i.socioCoins;
          earnedXps = earnedXps + i.xps;
        }
        if (i.actionId.indexOf('INTENTION_RATING') == 0) {
          taskDone = taskDone + 1;
        }
      }
      setSocioCoinsEarned(earnedSocioCoins);
      setXpsEarned(earnedXps);
      setTaskDone(taskDone);
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  const concentricSocioCoins = parseInt(
    (socioCoinsEarned / maxConcentricCoins).toFixed(2),
  );
  const concentricXps = parseInt((xpsEarned / maxConcentricXps).toFixed(2));
  const concentricTasks = parseInt((taskDone / maxConcentricTasks).toFixed(2));

  const taskUnlocked = userData && userData.getUser.taskUnlocked;

  const userCreatedTask =
    userData &&
    userData.getUser.tasks.items.filter((item) => {
      if (item.taskType == 'user') {
        return item;
      }
    });
  const availableTask =
    userCreatedTask != null ? taskUnlocked - userCreatedTask.length : 0;

  async function userfunc() {
    const user = await AsyncStorage.getItem('userId');
    setuserId(user);
    copilotEvents.on('stop', () => {
      updateUser({
        variables: {
          input: {
            id: user,
            homeCopilot: true,
            metaMainCopilot: false,
          },
        },
      });
    });
  }

  useFocusEffect(
    useCallback(() => {
      refetch();
      activityRefetch();

      console.log('useFocusEffect');
      setTimeout(() => {
        refetch();
        activityRefetch();
      }, 2000); // concentricDataRefetch();
    }, []),
  );

  async function refreshUser() {
    try {
      const cognitoUser = await Auth.currentAuthenticatedUser();
      const currentSession = await Auth.currentSession();
      cognitoUser.refreshSession(
        currentSession.refreshToken,
        (err, session) => {
          console.log('session', err, session);
          const {idToken, refreshToken, accessToken} = session;
          // do whatever you want to do now :)
          if (err) {
            Auth.signOut().then(async () => {
              navigation.navigate(SCREENS.SIGNIN_ENTRY);
              try {
                const allKeysFromAS = await AsyncStorage.getAllKeys();

                // console.log('All the keys in AsyncStorage', allKeysFromAS);

                // Very very important: Must never use AsyncStorage.clear() anywhere in the app.
                // Libraries like AWS Amplify really depend on caching using AsyncStorage
                // For example, If we use AsyncStorage.clear() during sign out, AWS Pinpoint and push notifications will not work.
                // Refer https://reactnative.dev/docs/asyncstorage#clear
                // Use AsyncStorage.removeItem() or AsyncStorage.multiRemove() instead to clear only your app specific keys.
                const keysToRemoveFromAS = allKeysFromAS.filter((key) => {
                  const keyToRemove = !(
                    key.startsWith('aws-amplify-cache') ||
                    key.startsWith('push_token')
                  );
                  // console.log(keyToRemove);
                  return keyToRemove;
                });

                // console.log('keysToRemoveFromAS', keysToRemoveFromAS);

                try {
                  await AsyncStorage.multiRemove(keysToRemoveFromAS);

                  try {
                    await AsyncStorage.setItem('onBoard', 'true');
                  } catch (e) {
                    console.log("Failed to Set Item: onBoard === 'true'", e);
                  }
                } catch (e) {
                  console.log('Failed To Remove App Specific Keys From AS', e);
                }
              } catch (e) {
                console.log('Failed To Get All The Keys From AS', e);
              }
            });
          }
        },
      );
    } catch (e) {
      console.log('Unable to refresh Token', e);
      Auth.signOut().then(() => {
        navigation.navigate(SCREENS.SIGNIN_ENTRY);

        Auth.signOut().then(async () => {
          navigation.navigate(SCREENS.SIGNIN_ENTRY);
          try {
            const allKeysFromAS = await AsyncStorage.getAllKeys();

            // console.log('All the keys in AsyncStorage', allKeysFromAS);

            // Very very important: Must never use AsyncStorage.clear() anywhere in the app.
            // Libraries like AWS Amplify really depend on caching using AsyncStorage
            // For example, If we use AsyncStorage.clear() during sign out, AWS Pinpoint and push notifications will not work.
            // Refer https://reactnative.dev/docs/asyncstorage#clear
            // Use AsyncStorage.removeItem() or AsyncStorage.multiRemove() instead to clear only your app specific keys.
            const keysToRemoveFromAS = allKeysFromAS.filter((key) => {
              const keyToRemove = !(
                key.startsWith('aws-amplify-cache') ||
                key.startsWith('push_token')
              );
              // console.log(keyToRemove);
              return keyToRemove;
            });

            // console.log('keysToRemoveFromAS', keysToRemoveFromAS);

            try {
              await AsyncStorage.multiRemove(keysToRemoveFromAS);

              try {
                await AsyncStorage.setItem('onBoard', 'true');
              } catch (err) {
                console.log("Failed to Set Item: onBoard === 'true'", err);
              }
            } catch (err) {
              console.log('Failed To Remove App Specific Keys From AS', err);
            }
          } catch (err) {
            console.log('Failed To Get All The Keys From AS', err);
          }
        });
      });
    }
  }

  useEffect(() => {
    userfunc();

    const backAction = () => {
      Alert.alert('Hold on!', 'Are you sure you want to exit app?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'YES', onPress: () => BackHandler.exitApp()},
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  function showToolTip() {
    setToolTip(true);
    setTimeout(() => {
      setToolTip(false);
    }, 3000);
  }

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity
        style={styles.subContainerOne}
        onPress={() =>
          navigation.navigate(SCREENS.PROFILE_SCREEN, {
            userData,
            refetch,
            calculatedRank,
            loadingLvl,
          })
        }> */}
        {/* <View style={styles.profileContainer}> */}
          {/* <AnimatedCircularProgress
            size={90}
            rotation={0}
            width={5}
            backgroundWidth={5}
            fill={loadingLvl ? 0 : parseInt(calculatedRank * 100)}
            tintColor="#0fb6cd"
            backgroundColor="#3d5875">
            {fill => ( */}
          {/* <Image
            resizeMode="cover"
            source={
              userData && userData.getUser.url
                ? {uri: userData.getUser.url}
                : avatarImg
            }
            style={styles.avatar}
          /> */}
          {/* )}
          </AnimatedCircularProgress> */}

          {/* <Text style={styles.levelText}>
            Lvl {userData && userData.getUser.levelId}
          </Text> */}
        {/* </View> */}

        {/* <View style={styles.pointsContainer}>
          <View style={styles.points}>
            <Text style={styles.socioCoinsText}>
              {userData && userData.getUser.socioCoins}
            </Text>
            <Image source={CoinImg} style={styles.iconImg} />
          </View>
        </View> */}
      {/* </TouchableOpacity> */}
      <ScrollView style={styles.subContainerTwo}>
        <CopilotStep
          text="This is the Summary of your Today's activities."
          order={1}
          name="summary">
          <WalkthroughableView>
            <Text style={styles.summary}>List Of Consults</Text>

            <Summary
              navigation={navigation}
              userData={userData}
              concentricCircleData={[
                concentricSocioCoins,
                concentricXps,
                concentricTasks,
              ]}
            />
          </WalkthroughableView>
        </CopilotStep>
        <CopilotStep
          active={secondStepActive}
          text="This is where your Daily Intentions will be shown. You can rate yourself for each Intention after finishing. Note: Be Honest to yourself and you can see improvement on a daily basis."
          order={2}
          name="Intentionlist">
          <WalkthroughableView>
            <IntentionsList
              userId={userId}
              loading={loading}
              navigation={navigation}
              userData={userData}
              refetch={refetch}
            />
          </WalkthroughableView>
        </CopilotStep>
      </ScrollView>
      <CopilotStep
        text="This is the Create Intention button. If the button is Grey, it means you can't create any more intentions. When you Unlock Daily intentions, it turns to Blue."
        order={3}
        name="createIntention">
        <WalkthroughableView style={styles.floatingButton}>
          {availableTask <= 0 ? (
            <TouchableOpacity onPress={showToolTip}>
              <LinearGradient
                start={{x: 1, y: 0}}
                end={{x: 0, y: 0}}
                colors={['#525252', '#525252']}
                style={styles.add}>
                <AddIcon
                  name="plus"
                  color={'#181818'}
                  size={25}
                  style={styles.iconWeight}
                />
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.floatingButton}
              onPress={() =>
                navigation.navigate(SCREENS.CREATE_INTENTION, {
                  refetch,
                  userId,
                  userData,
                })
              }>
              <LinearGradient
                start={{x: 1, y: 0}}
                end={{x: 0, y: 0}}
                colors={['#06b5d2', '#3ebdb4']}
                style={styles.add}>
                <AddIcon
                  name="plus"
                  color={'#181818'}
                  size={25}
                  style={styles.iconWeight}
                />
              </LinearGradient>
            </TouchableOpacity>
          )}
        </WalkthroughableView>
      </CopilotStep>
      {toolTip ? (
        <Animatable.View animation="fadeInUp" style={styles.toolTipView}>
          <LinearGradient
            start={{x: 1, y: 0}}
            end={{x: 0, y: 0}}
            colors={['#06b5d2', '#3ebdb4']}
            style={styles.toolTip}>
            <Text style={styles.toolTipText}>
              You have to unlock daily intension to create new intensions.
            </Text>
          </LinearGradient>
        </Animatable.View>
      ) : null}
      <Modal isVisible={isModal} animationIn="zoomIn">
        <View style={styles.modalView}>
          <TouchableOpacity
            style={styles.closeButtonView}
            onPress={() => setModal(false)}>
            <Text style={styles.closeButton}>x</Text>
          </TouchableOpacity>
          <View style={styles.modalMargin}>
            <Text style={styles.modalTextTitle}>
              If you have battery optimisation on your device disable it for
              better experience.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModal(false);
                start();
              }}>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={['#06b5d2', '#3ebdb4']}
                style={styles.modalButtonTextView}>
                <Text style={styles.modalButtonText}>Ok</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingTop: 5,
  },
  verticalOffset: Platform.OS == 'ios' ? 0 : 21,
})(HomeScreenIndex);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252525',
  },
  add: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    flex: 0.4,
    backgroundColor: '#181818',
    // margin: 30,
    borderRadius: 15,
  },
  modalTextTitle: {
    fontSize: 20,
    color: '#eeeeee',
    // fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
  },
  modalButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '60%',
  },
  modalButtonText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '800',
    color: '#252525',
  },
  modalButtonTextView: {
    margin: 25,
    padding: 10,
    borderRadius: 25,
    width: '50%',
  },
  modalMargin: {
    margin: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWeight: {fontWeight: 'bold'},
  toolTip: {
    width: '80%',
    padding: 10,
    borderRadius: 10,
  },
  iconImg: {marginLeft: 5, width: 20, height: 20},
  toolTipText: {textAlign: 'center', fontSize: 14},
  toolTipView: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    width: '100%',
  },
  subContainerOne: {
    flex: 0.2,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },

  avatar: {
    width: 80,
    height: 80,
    borderColor: 'white',
    borderRadius: 100,
  },
  levelText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#0fb6cd',
    fontWeight: '900',
    fontFamily: 'SFUIDisplay-Semibold',
  },
  pointsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  points: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eeeeee',
    padding: 2,
    paddingLeft: 10,
    borderRadius: 15,
  },
  socioCoinsText: {
    fontSize: 14,
    color: '#eeeeee',
    fontWeight: '900',
    fontFamily: 'SFUIDisplay-Semibold',
  },
  iconMargin: {marginLeft: 10},
  summary: {
    marginLeft: 20,
    fontSize: 26,
    color: '#eeeeee',
    fontWeight: '900',
    fontFamily: 'SFUIDisplay-Semibold',
  },
  subContainerTwo: {
    flex: 1,
    marginTop: 35,
  },
  floatingButton: {
    position: 'absolute',
    bottom: screenHeight / 95,
    right: 2,
    width: screenWidth / 4,
    height: screenHeight / 8,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
