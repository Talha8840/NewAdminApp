import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import DotIcon from 'react-native-vector-icons/Entypo';
import DashIcon from 'react-native-vector-icons/Octicons';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import onBoardImg from '../../assets/images/Onboarding_img2.png';

import SCREENS from '../../../SCREENS';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function Three({navigation, index}) {
  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 0, y: 1}}
      colors={['#13529f', '#975bc1']}
      style={styles.container}>
      {index === 2 ? (
        <>
          <Animatable.View animation="fadeInDown" style={styles.containerOne}>
            <Image
              resizeMode="contain"
              source={onBoardImg}
              style={styles.image}
            />
          </Animatable.View>
          <Animatable.View animation="fadeIn" style={styles.marginView}>
            <Text style={styles.text}>
              This App is built on the concepts already
              <Text style={styles.textTwo}> proven by Quantum Physics</Text>
            </Text>
          </Animatable.View>
          <Animatable.View animation="fadeIn" style={styles.row}>
            <DotIcon name="dot-single" color="#eeeeee" size={30} />
            <DotIcon name="dot-single" color="#eeeeee" size={30} />
            <DashIcon name="dash" color="#0fb6cd" size={30} />
          </Animatable.View>
          <TouchableOpacity
            onPress={async () => {
              await AsyncStorage.setItem('onBoard', 'true');
              navigation.navigate(SCREENS.SIGNIN_ENTRY);
            }}
            style={styles.center}>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#0fb6cd', '#0fb6cd']}
              style={styles.button}>
              <Text style={styles.buttonText}>Enter</Text>
            </LinearGradient>
          </TouchableOpacity>
        </>
      ) : null}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerOne: {flex: 0.5},
  text: {
    fontSize: 18,
    color: '#eeeeee',
    textAlign: 'center',
    fontWeight: '900',
    fontFamily: 'PointDEMO-SemiBold',
    lineHeight: 30,
  },
  textTwo: {
    fontWeight: '900',
    fontFamily: 'GalanoGrotesqueDEMO-Bold',
  },
  row: {flexDirection: 'row'},
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
    color: '#2e2e2e',
    fontFamily: 'SFUIDisplay-Medium',
  },
  center: {justifyContent: 'center', alignItems: 'center'},
  image: {
    width: screenWidth / 1.5,
    height: screenHeight / 3,
  },
  marginView: {margin: 50},
});
