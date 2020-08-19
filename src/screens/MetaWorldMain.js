import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  BackHandler,
  Dimensions,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import LockIcon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import {GET_METAWORLDBYUSERID} from '../graphql/query';
import {CREATE_ACTIVITY, UPDATE_USER} from '../graphql/mutation';
import {useQuery, useMutation} from '@apollo/client';
import {useFocusEffect} from '@react-navigation/native';
import useEstimateRewards from '../hooks/useEstimateRewards';
import Sound from 'react-native-sound';
import SCREENS from '../../SCREENS';
import {copilot, walkthroughable, CopilotStep} from 'react-native-copilot';
import planetImg from '../assets/images/Planet.png';
import FastImage from 'react-native-fast-image';

const SOUNDBUNDLE = Platform.OS == 'ios' ? '' : Sound.MAIN_BUNDLE

const MUSIC_URL =
  'https://littimages.s3.ap-south-1.amazonaws.com/music/1000+SOCIUS+COINS+PAID+BY+THE+USER.mp3';

let sound = new Sound(MUSIC_URL, SOUNDBUNDLE, () => {});

const WalkthroughableView = walkthroughable(View);
const WalkthroughableText = walkthroughable(Text);
const screenHeight = Math.round(Dimensions.get('window').height);

function MetaWorldMain({navigation, start, copilotEvents}) {
  navigation.setOptions({
    headerStyle: {
      elevation: 0,
      backgroundColor: 'transparent',
    },
    headerLeft: () => (
      <TouchableOpacity
        style={styles.iconPadding}
        onPress={() =>
          navigation.navigate('TabNavigator', {screen: SCREENS.METAWORLD_ENTRY})
        }>
        <Icon name="ios-arrow-back" size={30} color="#975bc1" />
      </TouchableOpacity>
    ),
  });
  const [isModal, setModal] = useState(false);
  const [isRememberModal, setRememberModal] = useState(false);
  const [createActivity] = useMutation(CREATE_ACTIVITY);
  const [userId, setuserId] = useState(null);
  const rewards = useEstimateRewards('VIEW_FUTURE', userId);
  const {socioCoins, xps, userData} = rewards;
  const [secondStepActive] = useState(true);
  const [updateUser] = useMutation(UPDATE_USER);
  const {data: metaWorld, refetch} = useQuery(GET_METAWORLDBYUSERID, {
    variables: {userId: userId},
    fetchPolicy: 'network-only',
  });
  const scrollViewRef = useRef();
  console.log('isRememberModal===>?', isRememberModal);
  async function userfunc() {
    const user = await AsyncStorage.getItem('userId');
    setuserId(user);
    copilotEvents.on('stop', () => {
      updateUser({
        variables: {
          input: {
            id: user,
            metaMainCopilot: true,
          },
        },
      });
    });
  }
  function playSound() {
    sound.play();
  }
  useFocusEffect(
    useCallback(() => {
      console.warn('focus metaworld');
      userfunc();
      if (userId) {
        refetch();
      }
      setTimeout(() => {
        console.warn('focus metaworld timeout');
        if (userId) {
          refetch();
        }
      }, 500);
    }, []),
  );
  useEffect(() => {
    sound.stop();

    if (userData && !userData.getUser.metaMainCopilot) {
      start();
    }

    copilotEvents.on('stepChange', (data) => {
      console.log('data?', data);
      if (data.name == 'step5') {
        console.log('inside scroll?');
        setTimeout(() => {
          scrollViewRef.current.scrollTo({
            y: 17,
            animated: true,
          });
        }, 1000);
      }
    });
  }, [userData]);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('TabNavigator', {screen: SCREENS.METAWORLD_ENTRY});
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  const createUserActivity = () => {
    createActivity({
      variables: {
        input: {
          userId: userId,
          actionId: 'VIEW_FUTURE',
          socioCoins,
          xps,
        },
      },
    })
      .then((data) => {
        navigation.navigate(SCREENS.METAWORLD_SLIDES, {metaWorld, rewards});
      })
      .catch((err) => console.warn(err));
  };

  const isCopilot = userData && !userData.getUser.metaMainCopilot;

  return (
    <>
      {Platform.OS == 'ios' ? (
        <View style={styles.containerHeader}>
          <TouchableOpacity
            style={styles.iconPadding}
            onPress={() =>
              navigation.navigate('TabNavigator', {
                screen: SCREENS.METAWORLD_ENTRY,
              })
            }>
            <Icon name="ios-arrow-back" size={30} color="#975bc1" />
          </TouchableOpacity>
        </View>
      ) : null}
      <ScrollView ref={scrollViewRef} style={styles.container}>
        <View style={styles.bodyContainerOne}>
          <Image source={planetImg} style={styles.image} resizeMode="contain" />
          <CopilotStep
            text="Meta Life - When you create your Meta Life, the number gets updated here."
            order={1}
            name="openApp">
            <WalkthroughableText style={styles.bigText}>
              {metaWorld && metaWorld.metaWorldByUserId.items.length
                ? metaWorld.metaWorldByUserId.items.length
                : 0}
            </WalkthroughableText>
          </CopilotStep>
        </View>
        <View style={styles.bodyContainerTwo}>
          <View style={styles.bottom}>
            <View style={{width: '100%'}}>
              <Text style={styles.bodyText}>Meta World</Text>
              <Text style={styles.titleText}>Create your future</Text>
            </View>
          </View>
        </View>
        <View>
          <CopilotStep
            text=" Your Meta World contains two strong elements - Intention and Visualisation. You are telling the Universe what you want with High Clarity and Intention."
            order={2}
            active={secondStepActive}
            name="step3">
            <WalkthroughableView style={styles.orderThree}>
              <Text
                style={{
                  fontSize: isCopilot ? 14 : 16,
                  color: '#2e2e2e',
                  fontWeight: '900',
                  fontFamily: 'PointDEMO-SemiBold',
                }}>
                Meta World is the realm that exists beyond space and time, there
                is no seperation and everything material is interconnected in
                oneness. So whatever you create here, already exists in your
                life. You are setting clear intention to bring it in to your
                life now.
              </Text>
            </WalkthroughableView>
          </CopilotStep>
        </View>

        <CopilotStep
          text=" You have to pay 1000 Socius Coins to create a Meta Life. This shows your strong Intention to the Meta World. Consider this 1000 Socius Coins as an Entrance Fee you are paying to the Meta World.
            Remember... We are connected with each other, the actions that you do affect others and in turn the whole world."
          order={3}
          active={secondStepActive}
          name="step6">
          <WalkthroughableView>
            <TouchableOpacity
              style={styles.btnWidth}
              onPress={() => {
                if (userData && userData.getUser.metaMainCopilot) {
                  setModal(!isModal);
                }
              }}>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={['#13529f', '#975bc1']}
                style={styles.button}>
                <Text style={styles.buttonText}>Create Meta life</Text>
              </LinearGradient>
            </TouchableOpacity>
          </WalkthroughableView>
        </CopilotStep>

        {metaWorld && metaWorld.metaWorldByUserId.items.length != 0 ? (
          <TouchableOpacity
            style={styles.rememberBtn}
            onPress={() => createUserActivity()}>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#13529f', '#975bc1']}
              style={styles.button}>
              <Text style={styles.buttonText}>Remember your Meta life</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <CopilotStep
            text="This is where you will Remember your Future. The Meta Life's you have created will play as a Video for you. You can come and see this at any time of the Day."
            order={4}
            active={secondStepActive}
            name="step5">
            <WalkthroughableView>
              <View style={styles.inActiveRememberBtn}>
                <LinearGradient
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  colors={['#cfcfcf', '#cfcfcf']}
                  style={styles.inActiveButton}>
                  <Text style={styles.buttonText}>Remember your Meta life</Text>
                  <LockIcon
                    name="lock"
                    size={20}
                    color="#ededed"
                    style={styles.iconMargin}
                  />
                </LinearGradient>
              </View>
              <View style={{height: 100}} />
            </WalkthroughableView>
          </CopilotStep>
        )}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.marginContainerTwo}>
          {metaWorld &&
            metaWorld.metaWorldByUserId.items.map((item) => (
              <TouchableOpacity
                style={styles.marginContainer}
                onPress={() =>
                  navigation.navigate(SCREENS.EDIT_METAWORLD, {
                    item,
                    userId,
                  })
                }>
                <FastImage
                  style={styles.wishImage}
                  resizeMode={FastImage.resizeMode.cover}
                  source={{
                    uri: item.url,
                    priority: FastImage.priority.normal,
                  }}
                />
                {/* <Image source={{uri: item.url}} style={styles.wishImage} /> */}
                <Text style={styles.wishText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
        </ScrollView>

        <Modal isVisible={isModal} animationIn="zoomIn">
          <View style={styles.modal}>
            <View style={styles.marginContainer}>
              <Text style={styles.modalTitle}>Welcome to your new life</Text>
              <Text style={styles.modalTextOne}>
                If you want to enter the Meta world to make a new creation, you
                have to pay 1000 Socius coins.
              </Text>
            </View>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                onPress={() => {
                  setModal(!isModal);
                  if (
                    userData &&
                    parseInt(userData.getUser.socioCoins) < 1000
                  ) {
                    setTimeout(() => {
                      setRememberModal(!isRememberModal);
                    }, 200);
                  } else {
                    playSound();
                    setTimeout(() => {
                      navigation.navigate(SCREENS.CREATE_METAWORLD);
                    }, 400);
                  }
                }}>
                <LinearGradient
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  colors={['#13529f', '#975bc1']}
                  style={styles.modalButton}>
                  <Text style={styles.modalButtonOne}>Enter</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModal(!isModal)}>
                <LinearGradient
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  colors={['#13529f', '#975bc1']}
                  style={styles.modalButton}>
                  <Text style={styles.modalButtonOne}>Not yet</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal isVisible={isRememberModal} animationIn="zoomIn">
          <View style={styles.modal}>
            <View style={styles.marginContainer}>
              <Text style={styles.modalTitle}>Insufficient Socius coins</Text>
              <Text style={styles.modalTextOne}>
                Unfortunately you didn't have 1000 or more Socius coins to
                create your future.
              </Text>
              <Text style={styles.modalTextFour}>
                Do your Intentions, reward yourself so that you can create your
                future.
              </Text>
            </View>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                onPress={() => {
                  setRememberModal(!isRememberModal);
                }}>
                <LinearGradient
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  colors={['#13529f', '#975bc1']}
                  style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Ok</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
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
  backdropColor: '#000000c4',
  tooltipStyle: {
    borderRadius: 10,
    paddingTop: 10,
  },
  verticalOffset: Platform.OS == 'ios' ? 0 : 24,
})(MetaWorldMain);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
    marginTop: -60,
  },
  containerHeader: {
    flex: 0.15,
    flexDirection: 'row',
    // margin: 20,
    width: '100%',
    backgroundColor: '#ffff',
  },
  backNavigationButton: {
    width: 50,
    alignItems: 'center',
    height: 50,
    marginLeft: -20,
  },
  modal: {
    flex: 0.6,
    backgroundColor: 'white',
    margin: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  marginContainer: {margin: screenHeight / 80},
  marginContainerTwo: {margin: 20},
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButtonOne: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    color: '#eeeeee',
  },
  modalButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    color: '#eeeeee',
  },
  modal: {
    flex: 0.6,
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wishImage: {
    width: 200,
    height: 200,
    borderRadius: 30,
  },
  bodyContainerOne: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 0.35,
    margin: 70,
    marginTop: -65,
  },
  bigText: {
    fontSize: 150,
    fontWeight: 'bold',
    color: '#eeeeee',
    marginTop: screenHeight / 11,
    marginLeft: -7,
  },
  bodyContainerTwo: {
    margin: 25,
    flex: 0.6,
    marginTop: -80,
  },
  iconPadding: {padding: 20},
  bottom: {marginBottom: 20},
  image: {
    width: 250,
    height: 250,
    marginLeft: -130,
    marginTop: 80,
    marginBottom: 20,
  },
  bodyText: {
    fontSize: 35,
    color: '#2e2e2e',
    fontWeight: '900',
    fontFamily: 'GalanoGrotesqueDEMO-Bold',
  },
  titleText: {
    fontSize: 20,
    color: '#2e2e2e',
    fontWeight: '800',
    fontFamily: 'PointDEMO-SemiBold',
    marginTop:10
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
  },
  btnWidth: {width: '100%', margin: 'auto'},
  // textTwo: {
  //   fontSize: userData && !userData.getUser.metaMainCopilot ? 14 : 16,
  //   color: '#2e2e2e',
  //   fontWeight: '900',
  //   fontFamily: 'PointDEMO-SemiBold',
  // },
  orderThree: {
    // width: '100%',
    // paddingBottom: '10%',
    margin: screenHeight / 30,
    marginTop: -30,
    height: screenHeight / 5,
    justifyContent: 'center',
  },
  button: {
    margin: 25,
    padding: 10,
    borderRadius: 25,
  },
  metaWalkthrough: {
    width: '90%',
    paddingBottom: '7.5%',
    height: screenHeight / 6,
    alignItems: 'center',
  },
  inActiveButton: {
    margin: 25,
    padding: 10,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    // height: screenHeight / 16,
  },
  modalButton: {
    margin: screenHeight / 31.5,
    padding: 10,
    borderRadius: 25,
    width: 100,
    fontWeight: '900',
    fontFamily: 'SFUIDisplay-Medium',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    color: '#eeeeee',
    fontFamily: 'SFUIDisplay-Semibold',

    justifyContent: 'center',
    alignItems: 'center',
  },
  iconMargin: {marginLeft: 10},
  inActiveRememberBtn: {width: '100%', justifyContent: 'center'},
  rememberBtn: {width: '100%', marginTop: -25},
  wishText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2e2e2e',
    textAlign: 'center',
  },
  rememberWalkthrough: {
    width: '100%',
    // paddingBottom: '10%',
    paddingLeft: '10%',
    marginTop: -20,
  },
  modalTitle: {
    marginLeft: 10,
    fontSize: screenHeight / 27,
    textAlign: 'center',
    margin: 10,
    fontWeight: '900',
    fontFamily: 'GalanoGrotesqueDEMO-Bold',
  },
  modalTextOne: {
    marginLeft: 10,
    fontSize: 16,
    textAlign: 'center',
    margin: 10,
    fontWeight: '900',
    fontFamily: 'PointDEMO-SemiBold',
  },
  modalTextFour: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
    fontFamily: 'Point-Regular',
  },
  modalTextTwo: {
    fontSize: 18,
    color: '#0fb6cd',
    fontWeight: '900',
    textAlign: 'center',
    fontFamily: 'Point-Regular',
  },
  modalTextThree: {
    fontSize: 18,
    color: '#ff7821',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
