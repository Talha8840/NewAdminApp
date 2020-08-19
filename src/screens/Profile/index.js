import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  BackHandler,
  Dimensions,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import TableOne from './TableOne';
import TableTwo from './TableTwo';
import TableThree from './TableThree';
import Progress from './Progress';
import Awards from './Awards';
import {useQuery, useMutation} from '@apollo/client';
import {LIST_AWARDS, GET_USERAWARDSBYUSERID} from '../../graphql/query';
import {Flow} from 'react-native-animated-spinkit';
import SCREENS from '../../../SCREENS';
import {copilot, walkthroughable, CopilotStep} from 'react-native-copilot';
import {UPDATE_USER} from '../../graphql/mutation';
import avatarImg from '../../assets/images/avatar.png';

const WalkthroughableView = walkthroughable(View);

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

function ProfileIndex({navigation, route, start, copilotEvents}) {
  
  navigation.setOptions({
    headerStyle: {
      elevation: 0,
      backgroundColor: 'transparent',
    },
    headerLeft: () => (
      <TouchableOpacity
        style={styles.iconPadding}
        onPress={() => navigation.navigate(SCREENS.HOME)}>
        <Icon
          name="ios-arrow-back"
          size={30}
          color="#0fb6cd"
          style={styles.iconMargin}
        />
      </TouchableOpacity>
    ),
  });

  const {userData, refetch, calculatedRank, loadingLvl} = route.params;
  console.warn(userData, 'userData from profile index page');
  const [userId, setuserId] = useState(null);
  const [secondStepActive] = useState(true);
  const [isCopilotFinish, setCopilotFinish] = useState(true);
  const {loading, data, refetch: refetchAwards} = useQuery(LIST_AWARDS, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });
  const [updateUser] = useMutation(UPDATE_USER);
  const scrollViewRef = useRef();
  const {data: userAwards, error} = useQuery(GET_USERAWARDSBYUSERID, {
    variables: {userId: userId},
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });
  console.warn('data=>', userAwards);
  console.log('screeeeeeen', screenHeight / 33);

  async function userfunc() {
    const user = await AsyncStorage.getItem('userId');
    setuserId(user);
    copilotEvents.on('stop', () => {
      setCopilotFinish(true);
      updateUser({
        variables: {
          input: {
            id: user,
            profileCopilot: true,
          },
        },
      });
    });
  }

  useEffect(() => {
    const backAction = () => {
      navigation.navigate(SCREENS.HOME);
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);
  const isCopilot = userData && !userData.getUser.profileCopilot;

  useEffect(() => {
    console.log('if block');
    if (userData && !userData.getUser.profileCopilot) {
      console.log('if block');
      setCopilotFinish(false);
      start();
    }

    // copilotEvents.on('stepChange', (data) => {
    //   console.log('data?', data);
    //   if (data.name == 'Awards') {
    //     console.log('inside scroll?');
    //     setTimeout(() => {
    //       scrollViewRef.current.scrollTo({
    //         y: screenHeight,
    //         animated: true,

    //       });

    //     }, 1000);
    //   }

    // });
    userfunc();
    refetch();
  }, [isCopilot]);

  return (
    <ScrollView ref={scrollViewRef} style={styles.container}>
      {Platform.OS == 'ios' ? 
      <View style={styles.containerHeader}>
        <TouchableOpacity
          style={styles.iconPadding}
          onPress={() => navigation.navigate(SCREENS.HOME)}>
          <Icon
            name="ios-arrow-back"
            size={30}
            color="#0fb6cd"
            style={styles.iconMargin}
          />
        </TouchableOpacity>
      </View>
      :null}
      <TouchableOpacity
        onPress={() => {
          isCopilotFinish ? navigation.navigate(SCREENS.PROFILE) : null;
        }}
        style={styles.subContainer}>
        <CopilotStep
          text="This is where your and your friends can view your profile."
          order={4}
          name="Profile">
          <WalkthroughableView style={styles.centerView}>
            {/* <AnimatedCircularProgress
              size={90}
              width={5}
              rotation={0}
              backgroundWidth={5}
              fill={loadingLvl ? 0 : parseInt(calculatedRank * 100)}
              tintColor="#0fb6cd"
              backgroundColor="#3d5875">
              {fill => ( */}
            <Image
              resizeMode="cover"
              source={
                userData && userData.getUser.url
                  ? {uri: userData.getUser.url}
                  : avatarImg
              }
              style={styles.avatar}
            />
            {/* )}
            </AnimatedCircularProgress> */}
            <View style={styles.center}>
              <Text
                style={{
                  fontSize: isCopilot ? 16 : 22,
                  color: '#eeeeee',
                  fontWeight: 'bold',
                  textTransform: 'capitalize',
                  textAlign: 'center',
                }}>
                {userData && userData.getUser.name}
              </Text>
              <Text
                style={{
                  fontSize: isCopilot ? 14 : 18,
                  color: '#0fb6cd',
                  fontWeight: '900',
                }}>
                {userData && userData.getUser.rank.name}
              </Text>
            </View>
          </WalkthroughableView>
        </CopilotStep>
      </TouchableOpacity>
      <CopilotStep
        active={secondStepActive}
        text=" This shows which Level you are currently in, current amount of Socius Coins you have and total amount of XP's you have earned till now."
        order={5}
        name="TableOne">
        <WalkthroughableView style={{height: screenHeight / 9}}>
          <TableOne userData={userData} isCopilot={isCopilot} />
        </WalkthroughableView>
      </CopilotStep>
      <CopilotStep
        active={secondStepActive}
        text="Meta Life - When you create your Meta Life, the number gets updated here. Daily Intention - Intentions you have set in total. Awards - Awards are given when you complete a specific set of actions."
        order={6}
        name="TableTwo">
        <WalkthroughableView style={{height: screenHeight / 9}}>
          <TableTwo userData={userData} isCopilot={isCopilot} />
        </WalkthroughableView>
      </CopilotStep>
      <CopilotStep
        active={secondStepActive}
        text="Meditated for - This is the total time you have spent meditating. The Friends and Clans feature will be coming in the next update."
        order={7}
        name="TableThree">
        <WalkthroughableView style={{height: screenHeight / 9}}>
          <TableThree userData={userData} isCopilot={isCopilot} />
        </WalkthroughableView>
      </CopilotStep>
      <CopilotStep
        active={secondStepActive}
        text="This Bar represents the number of XP's you need to get to the next level."
        order={8}
        name="Progress">
        <WalkthroughableView>
          <Progress userData={userData} />
        </WalkthroughableView>
      </CopilotStep>
      <View style={styles.divider} />
      {/* <View style={styles.marginViewTwo}>
        <Text style={{fontSize: 25, color: '#eeeeee'}}>Rewards at Lvl 1</Text>
      </View>
      <Rewards /> */}
      <CopilotStep
        active={secondStepActive}
        text="These are the Awards that you can get. You can have a look around after we leave you."
        order={9}
        name="Awards">
        <WalkthroughableView>
          <View style={styles.marginViewTwo}>
            <View>
              <Text style={styles.awardText}>Awards</Text>
            </View>
            <View style={styles.top}>
              <Text style={styles.levelText}>Levels</Text>
            </View>
          </View>
          {loading ? (
            <View style={styles.center}>
              <Text style={styles.loadingText}>Getting your awards...</Text>
              <View style={styles.top}>
                <Flow size={48} color="#0fb6cd" />
              </View>
            </View>
          ) : (
            <>
              <Awards data={data} userAwards={userAwards} />
            </>
          )}
        </WalkthroughableView>
      </CopilotStep>
      {/* <CopilotStep
        active={secondStepActive}
        text="Now... Lets Complete your profile."
        order={10}
        name="dummy">
        <WalkthroughableView>
          </WalkthroughableView>
          </CopilotStep> */}
      <View style={{height: screenHeight / 5}} />
    </ScrollView>
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
  verticalOffset: Platform.OS == 'ios' ? 0 : screenHeight / 33,
})(ProfileIndex);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252525',
    marginTop: -60,
  },
  iconPadding: {padding: 10},
  iconMargin: {marginLeft: 10},
  // marginView: {margin: 20, height: screenHeight / 7},
  subContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  containerHeader: {
    // flex: 0.1,
    marginTop: 80,
    // justifyContent: 'center',
    width: '100%',
    backgroundColor: '#252525',
  },
  avatar: {
    width: 80,
    height: 80,
    borderColor: 'white',
    borderRadius: 100,
  },
  userName: {
    fontSize: 22,
    color: '#eeeeee',
    fontWeight: 'bold',
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  rank: {fontSize: 18, color: '#0fb6cd', fontWeight: '900'},
  marginView: {margin: 15},
  marginViewTwo: {margin: 20, marginTop: -10},
  awardText: {fontSize: 25, color: '#eeeeee', marginTop: 5},
  levelText: {fontSize: 23, color: '#eeeeee', marginBottom: 20},
  center: {justifyContent: 'center', alignItems: 'center', marginBottom: 10},
  loadingText: {textAlign: 'center', color: '#eeeeee'},
  top: {marginTop: 10},
  bodyText: {
    flexDirection: 'row',
    // margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  centerView: {
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom: 10,
    // marginTop: 15,
    height: screenHeight / 5,
  },
  progressBar: {
    height: 10,
    width: '100%',
    backgroundColor: 'white',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
  },
  divider: {
    borderWidth: 0.2,
    borderBottomColor: '#eeeeee',
    margin: 20,
    marginTop: -5,
  },
});
