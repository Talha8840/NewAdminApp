import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import {Animated} from 'react-native';
import SCREENS from '../../SCREENS';
import {copilot, walkthroughable, CopilotStep} from 'react-native-copilot';
import {UPDATE_USER} from '../graphql/mutation';
import {GET_USER} from '../graphql/query';
import {useQuery, useMutation} from '@apollo/client';
import planetImg from '../assets/images/Planet.png';
import {useIsFocused} from '@react-navigation/native';

const WalkthroughableView = walkthroughable(View);
const screenHeight = Math.round(Dimensions.get('window').height);

function MetaWorldEntry({navigation, start: copilotStart, copilotEvents}) {
  const [data, setData] = useState(null);
  const [userId, setuserId] = useState(null);
  const [progress, setProgress] = useState(new Animated.Value(0));
  const [updateUser] = useMutation(UPDATE_USER);
  const {data: userData} = useQuery(GET_USER, {
    variables: {id: userId},
    onCompleted: (data) => {
      setData(data);
    },
  });
  async function userfunc() {
    const user = await AsyncStorage.getItem('userId');
    setuserId(user);
    copilotEvents.on('stop', () => {
      updateUser({
        variables: {
          input: {
            id: user,
            metaEntryCopilot: true,
          },
        },
      });
    });
  }

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 3000,
    }).start();
    userfunc();
    setTimeout(() => {
      // if (
      //   data &&
      //   !data.getUser.metaEntryCopilot &&
      //   !data.getUser.metaMainCopilot
      // ) {
        copilotStart();
      // }
    }, 2000);
    console.log('progress', progress);
  }, [data]);

  return (
    <>
      {/* {!end ? (
          <LottieView
            source={require('../assets/animations/metaworld.json')}
            progress={progress}
            autoPlay={true}
            loop={false}
            onAnimationFinish={() => setEnd(true)}
            style={styles.container}
          />
      ) : ( */}
      <LinearGradient colors={['#13529f', '#975bc1']} style={styles.container}>
        <View style={styles.titleContainer}>
          <Animatable.Text animation="fadeInDown" style={styles.titleText}>
            Welcome
          </Animatable.Text>
          <Animatable.Text animation="fadeInDown" style={styles.titleText}>
            to
          </Animatable.Text>
        </View>
        <View style={styles.cardContainer}>
          <View style={styles.top}>
            <Image
              source={planetImg}
              style={styles.image}
              resizeMode="contain"
            />

            <View style={styles.textContainer}>
              <Animatable.Text animation="fadeInDown" style={styles.bodyText}>
                Meta World
              </Animatable.Text>
              <Animatable.Text animation="fadeInDown" style={styles.title}>
                Create your future
              </Animatable.Text>
            </View>
            <CopilotStep
              text="We now enter the most important part. Your Meta World.The quantum physics model of reality tells us that mind and matter are not separate elements. In fact, a subjective mind has a true effect on the external objective world. "
              order={1}
              name="openApp">
              <WalkthroughableView style={styles.button}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => navigation.replace(SCREENS.METAWORLD_MAIN)}>
                  <Animatable.View
                    animation="fadeInUp"
                    style={styles.rowCenter}>
                    <Text style={styles.buttonText}>Know more</Text>
                    <Icon
                      name="long-arrow-right"
                      size={30}
                      color={'#975bc1'}
                      style={styles.iconMargin}
                    />
                  </Animatable.View>
                </TouchableOpacity>
              </WalkthroughableView>
            </CopilotStep>
          </View>
        </View>
      </LinearGradient>
      {/* )} */}
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
    borderRadius: 5,
    // paddingTop: 5,
    // marginTop: 5,
    // marginBottom: 5,
    bottom:50
  },
  verticalOffset: Platform.OS == 'ios' ? 0 : screenHeight / 22.66,
})(MetaWorldEntry);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  rowCenter: {
    // justifyContent:'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 30,
  },
  titleContainer: {
    flex: 0.2,
    justifyContent: 'flex-start',
  },
  titleText: {
    fontSize: 35,
    color: '#eeeeee',
    textAlign: 'left',
    margin: 20,
    fontWeight: '900',
    fontFamily: 'GalanoGrotesqueDEMO-Bold',
    marginTop: -15,
  },
  textContainer: {
    margin: 10,
    marginTop: -20,
  },
  button: {
    justifyContent: 'flex-end',
    // marginTop: 30,
    margin: 5,
  },
  title: {
    fontSize: 20,
    color: '#2e2e2e',
    fontWeight: '900',
    fontFamily: 'PointDEMO-SemiBold',
    marginTop: 5,
  },
  top: {marginTop: -140},
  cardContainer: {
    flex: 0.6,
    margin: 20,
    marginTop: 30,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#975bc1',
    fontWeight: '900',
    fontFamily: 'PointDEMO-SemiBold',
  },
  iconMargin: {marginLeft: 5, marginTop: 2},
  bodyText: {
    fontSize: 35,
    color: '#2e2e2e',
    fontWeight: '900',
    fontFamily: 'GalanoGrotesqueDEMO-Bold',
  },
});
