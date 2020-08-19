import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import ActivityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ProgressChart} from 'react-native-chart-kit';
import CoinImg from '../../assets/images/SociusCoins.png';
import XpImg from '../../assets/images/XP.png';

export default function Summary({userData, concentricCircleData}) {
  const data = {
    data: concentricCircleData,
  };
  const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#1d1d1d',
    backgroundGradientToOpacity: 0.1,
    color: (opacity = 0.1, index) => {
      console.warn('index ??', index);
      const circlesColorArr = [
        `rgb(229,164,69, ${opacity})`,
        `rgb(255,120,33, ${opacity})`,
        `rgb(201,0,0, ${opacity})`,
      ];
      return circlesColorArr[index];
    },
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  return (
    <TouchableOpacity
      style={styles.container}
      // onPress={() => navigation.navigate('ActivityScreen')}
    >
      <View style={styles.containerHeader}>
        <View style={styles.title}>
          <ActivityIcon name="pulse" color={'#0fb6cd'} size={25} />
          <Text style={styles.titleText}>Today's Activity</Text>
        </View>
        {/* <View style={{margin: 5, marginTop: 10}}>
          <ActivityIcon name="greater-than" color={'#0fb6cd'} size={15} />
        </View> */}
      </View>

      <View style={styles.containerBody}>
        <View style={styles.subContainerBody}>
          <Text style={styles.coinText}>Coins</Text>
          <View style={styles.bodyText}>
            <Text style={styles.coinTextTwo}>
              {' '}
              {userData && userData.getUser.socioCoins}
            </Text>
            <Image
              source={CoinImg}
              style={styles.iconMargin}
              resizeMode="contain"
            />
          </View>
        </View>
        <View style={styles.subContainerBody}>
          <Text style={styles.xpsText}>Xp's</Text>
          <View style={styles.bodyText}>
            <Text style={styles.bodyTextTwo}>
              {' '}
              {userData && userData.getUser.Xps}
            </Text>
            <Image
              source={XpImg}
              style={styles.iconMargin}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={styles.subContainerBody}>
          <Text style={styles.intentionText}>Intentions</Text>
          <View style={styles.bodyText}>
            <Text style={styles.bodyTextTwo}>
              {userData && userData.getUser.tasks.items.length}
            </Text>
          </View>
        </View>

        {/* <View style={styles.subContainerBody}>
          <ProgressChart
            data={data}
            width={100}
            height={100}
            strokeWidth={5}
            radius={10}
            chartConfig={chartConfig}
            hideLegend={true}
            style={styles.progressChart}
          />
        </View> */}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1d1d1d',
    margin: 20,
    borderRadius: 10,
  },
  coinText: {
    fontSize: 14,
    color: '#e5a445',
    fontWeight: '900',
    fontFamily: 'SFUIDisplay-Semibold',
  },
  coinTextTwo: {
    fontSize: 16,
    color: '#eeeeee',
    fontWeight: '900',
    fontFamily: 'SFUIDisplay-Semibold',
  },
  iconMargin: {marginLeft: 5, width: 20, height: 20},
  avatar: {
    width: 70,
    height: 70,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 100,
  },
  containerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    flexDirection: 'row',
    margin: 5,
    marginTop: 15,
  },
  titleText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#eeeeee',
    fontWeight: '900',
    fontFamily: 'SFUIDisplay-Semibold',
  },
  containerBody: {
    flexDirection: 'row',
    margin: 10,
    justifyContent: 'space-evenly',
  },
  subContainerBody: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#eeeeee',
  },
  progressChart: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -60,
    marginLeft: 10,
  },
  intentionText: {
    fontSize: 14,
    color: '#c90000',
    fontWeight: '900',
    fontFamily: 'SFUIDisplay-Semibold',
  },
  xpsText: {
    fontSize: 14,
    color: '#ff7821',
    fontWeight: '900',
    fontFamily: 'SFUIDisplay-Semibold',
  },
  xpsTextTwo: {
    fontSize: 16,
    color: '#ff7821',
    fontWeight: '900',
    fontFamily: 'SFUIDisplay-Semibold',
  },
  bodyText: {
    flexDirection: 'row',
    // margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    fontWeight: '900',
    fontFamily: 'SFUIDisplay-Semibold',
  },
  bodyTextTwo: {
    fontSize: 16,
    color: '#eeeeee',
    fontWeight: '900',
    fontFamily: 'SFUIDisplay-Semibold',
  },
});
