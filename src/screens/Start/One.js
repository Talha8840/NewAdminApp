import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import DotIcon from 'react-native-vector-icons/Entypo';
import DashIcon from 'react-native-vector-icons/Octicons';
import LinearGradient from 'react-native-linear-gradient';
import logoImg from '../../assets/images/logo.png';

export default function One() {
  const [isSplashScreen, setSplashScreen] = useState(true);

  function splashScreen() {
    setTimeout(() => {
      setSplashScreen(false);
    }, 2000);
  }

  useEffect(() => {
    splashScreen();
  }, []);

  return (
    <>
      {isSplashScreen ? (
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          colors={['#252525', '#252525']}
          style={styles.container}>
          <Image source={logoImg} style={styles.logo} resizeMode='contain'/>
        </LinearGradient>
      ) : (
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          colors={['#13529f', '#975bc1']}
          style={styles.container}>
          <View style={styles.dummyContainer} />
          <View style={styles.marginView}>
            <Text style={styles.text}>
              There's a redemptive power that making a choice has rather than
              feeling like you're an effect to all the things that are
              happening.
            </Text>

            <Text style={styles.textTwo}>Make a choice.</Text>
            <Text style={styles.text}>Just decide what it's gonna be,</Text>
            <Text style={styles.text}>who you're gonna be,</Text>
            <Text style={styles.text}>how you are going to do it.</Text>
            <Text style={styles.textTwo}>Just decide.</Text>
            <Text style={styles.text}>
              And from that point, the universe will get out of your way.
            </Text>
            <Text style={styles.quoteText}>-Will Smith</Text>
          </View>
          <View style={styles.row}>
            <DashIcon name="dash" color="#0fb6cd" size={30} />
            <DotIcon name="dot-single" color="#eeeeee" size={30} />
            <DotIcon name="dot-single" color="#eeeeee" size={30} />
          </View>
        </LinearGradient>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#2e2e2e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '50%',
    height: '50%',
  },
  dummyContainer: {flex: 0.5},
  marginView: {margin: 50},
  row: {flexDirection: 'row'},
  text: {
    fontSize: 18,
    color: '#eeeeee',
    textAlign: 'center',
    fontWeight: '500',
    fontFamily: 'PointDEMO-SemiBold',
    marginTop: 5,
    lineHeight: 30,
  },
  textTwo: {
    fontSize: 20,
    color: '#eeeeee',
    textAlign: 'center',
    fontWeight: '900',
    fontFamily: 'GalanoGrotesqueDEMO-Bold',
    marginTop: 5,
    lineHeight: 30,
  },
  quoteText: {
    fontSize: 22,
    marginTop: 10,
    color: '#eeeeee',
    textAlign: 'right',
    fontWeight: '900',
    fontFamily: 'GalanoGrotesqueDEMO-Bold',
  },
});
