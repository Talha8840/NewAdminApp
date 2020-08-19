import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import CoinImg from '../../assets/images/SociusCoins.png';
import XpImg from '../../assets/images/XP.png';

export default function TableOne({userData, isCopilot}) {
  const spentCoins = userData && userData.getUser.spentCoins;
  const socioCoins = userData && userData.getUser.socioCoins;
  const totalCoins = spentCoins + socioCoins;

  return (
    <View style={styles.containerBody}>
      <View style={styles.subContainerBody}>
        <Text
          style={{
            fontSize: isCopilot ? 14 : 16,
            color: '#0fb6cd',
            fontWeight: '900',
            textAlign: 'center',
          }}>
          Level
        </Text>
        <View style={styles.bodyText}>
          <Text
            style={{
              fontSize: isCopilot ? 14 : 16,
              color: '#eeeeee',
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            {userData && userData.getUser.levelId}
          </Text>
        </View>
      </View>
      <View style={styles.subContainerBody}>
        <Text
          style={{
            fontSize: isCopilot ? 14 : 16,
            color: '#0fb6cd',
            fontWeight: '900',
            textAlign: 'center',
          }}>
          Socius coins
        </Text>
        <View style={styles.bodyText}>
          <Text
            style={{
              fontSize: isCopilot ? 14 : 16,
              color: '#eeeeee',
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            {totalCoins}
          </Text>
          <Image source={CoinImg} style={styles.iconImg} resizeMode="contain" />
        </View>
      </View>
      <View style={styles.subContainerBody}>
        <Text
          style={{
            fontSize: isCopilot ? 14 : 16,
            color: '#0fb6cd',
            fontWeight: '900',
            textAlign: 'center',
          }}>
          Xp
        </Text>
        <View style={styles.bodyText}>
          <Text
            style={{
              fontSize: isCopilot ? 14 : 16,
              color: '#eeeeee',
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            {userData && userData.getUser.Xps}
          </Text>
          <Image source={XpImg} style={styles.iconImg} resizeMode="contain" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerBody: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-around',
  },
  subContainerBody: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#eeeeee',
    width: '30%',
  },
  iconImg: {marginLeft: 5, width: 20, height: 20},
  bodyText: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  bodyTextOne: {
    fontSize: 16,
    color: '#0fb6cd',
    fontWeight: '900',
    textAlign: 'center',
  },
  bodyTextTwo: {
    fontSize: 16,
    color: '#eeeeee',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  xpText: {fontSize: 16, color: '#ff7821', marginLeft: 5},
  iconMargin: {marginLeft: 5},
});
