import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  BackHandler,
  Alert,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import SCREENS from '../../SCREENS';
import planetImg from '../assets/images/Planet.png';
export default function MetaIntentionDescription({navigation, route}) {
  const {
    metaWorldId,
    socioCoins,
    xps,
    newLevel,
    awardData,
    levelUp,
  } = route.params;

  useEffect(() => {
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.bodyContainerOne}>
        <View style={styles.halfWidth}>
          <Image source={planetImg} style={styles.image} resizeMode="contain" />
        </View>
        <View style={styles.halfWidth}>
          <Text style={styles.bigText}>Meta Intention</Text>
        </View>
      </View>
      <View style={styles.bodyContainerTwo}>
        <View>
          <Text style={styles.text}>
            One last step to creating your Meta Life. Meta Task is directly
            connected to your Meta Life that you have created. After creating,
            your Meta Task will be added to your Home World. This Meta Task will
            be the path towards your Meta Life, so choose your task wisely. What
            is the one habit you need to form to manifest this Meta Life? Be
            specific!
          </Text>
        </View>
        <View style={styles.top}>
          <Text style={styles.text}>Example:</Text>
        </View>
        <View style={styles.top}>
          <Text style={styles.text}>
            If your Meta Life is to make 10 Million a month. Don’t keep your
            Meta Task as "I want to get a promotion" or "I want to get more
            clients. Remember this is a Habit. Keep your Meta Task as “ 
            work on so and so skill every day” This Habit should be the path to
            your Meta Life.
          </Text>
        </View>
        <View style={styles.topBottom}>
          <Text style={styles.text}>Now, let’s create!</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.btnWidth}
            onPress={() =>
              navigation.navigate(SCREENS.CREATE_METAINTENTION, {
                metaWorldId,
                metaLifeCoins: socioCoins,
                metaLifeXps: xps,
                metaNewLevel: newLevel,
                metaAwardData: awardData,
                metaLevelup: levelUp,
              })
            }>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#13529f', '#975bc1']}
              style={styles.button}>
              <Text style={styles.buttonText}>Continue</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
  },
  containerHeader: {
    flex: 0.1,
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#ffff',
  },
  backNavigationButton: {
    width: 50,
    alignItems: 'center',
    height: 50,
    padding: 20,
  },
  bodyContainerOne: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 0.6,
  },
  halfWidth: {width: '50%'},
  bigText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#2e2e2e',
    marginTop: 20,
    fontFamily: 'GalanoGrotesqueDEMO-Bold',
    fontWeight: '900',
    // width: '50%',
    // marginLeft: 20,
    // textAlign:'center'
  },
  bodyContainerTwo: {
    margin: 30,
    flex: 0.6,
    marginTop: -20,
  },
  text: {fontSize: 16, color: '#2e2e2e', fontFamily: 'PointDEMO-SemiBold'},
  top: {marginTop: 20},
  topBottom: {marginTop: 20, marginBottom: 20},
  image: {
    width: 300,
    height: 300,
    // shadowOffset: {width: 80, height: 80},
    // shadowColor: 'black',
    // shadowOpacity: 0.5,
    marginLeft: -100,
    // marginTop: 80,
  },
  bodyText: {
    fontSize: 35,
    color: '#2e2e2e',
    fontWeight: 'bold',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
  },
  btnWidth: {width: '90%'},
  button: {
    margin: 25,
    padding: 10,
    borderRadius: 25,
  },

  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    color: '#eeeeee',
  },
});
