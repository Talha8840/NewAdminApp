import React from 'react';
import {Text, StyleSheet, Image, Dimensions, View} from 'react-native';
import DotIcon from 'react-native-vector-icons/Entypo';
import DashIcon from 'react-native-vector-icons/Octicons';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import onBoardImg from '../../assets/images/Onboarding_img1.png';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Two({index}) {
  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 0, y: 1}}
      colors={['#13529f', '#975bc1']}
      style={styles.container}>
      {index === 1 ? (
        <>
          <Animatable.View animation="fadeInDown" style={styles.containerOne}>
            <Image
              resizeMode="contain"
              source={onBoardImg}
              style={styles.image}
            />
          </Animatable.View>

          <Animatable.View animation="fadeIn" style={styles.marginView}>
            <Text style={styles.text}>Our dream is to</Text>
            <Text style={styles.textTwo}>
              Awaken Humanity's True Potential.
            </Text>
            <Text style={styles.text}>
              Let's work on ourselves so that the world works itself out!
            </Text>
          </Animatable.View>
          <Animatable.View animation="fadeIn" style={styles.row}>
            <DotIcon name="dot-single" color="#eeeeee" size={30} />
            <DashIcon name="dash" color="#0fb6cd" size={30} />
            <DotIcon name="dot-single" color="#eeeeee" size={30} />
          </Animatable.View>
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
    fontSize: 18,
    color: '#eeeeee',
    textAlign: 'center',
    fontWeight: '900',
    fontFamily: 'GalanoGrotesqueDEMO-Bold',
    lineHeight: 30,
  },
  row: {flexDirection: 'row'},
  image: {
    width: windowWidth / 1.5,
    height: windowHeight / 2.5,
  },
  marginView: {margin: 50},
});
