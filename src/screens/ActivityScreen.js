import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CircleIcon from 'react-native-vector-icons/FontAwesome';
import {ProgressChart} from 'react-native-chart-kit';
import ActivityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ProgressBar} from 'react-native-paper';
import HealthIcon from 'react-native-vector-icons/MaterialIcons';
import SCREENS from '../../SCREENS';

export default function ActivityScreen({navigation}) {
  navigation.setOptions({
    headerStyle: {
      elevation: 0,
      backgroundColor: 'transparent',
    },
    headerLeft: () => (
      <Icon
        name="ios-arrow-back"
        size={25}
        color="#0fb6cd"
        style={{marginLeft: 10}}
        onPress={() =>
          navigation.navigate('TabNavigator', {screen: SCREENS.HOME})
        }
      />
    ),
  });

  const [isClicked, setClicked] = useState(false);

  const data = {
    data: [0.4, 0.5, 0.9],
  };
  const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#1d1d1d',
    backgroundGradientToOpacity: 0.1,
    color: (opacity = 0.1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  const intentions = [
    {
      intentionName: 'Health',
      intentionDescription: 'Drink 6 litres of water daily.',
      intentionColor: '#db3214',
      progress: 0.7,
      coins: 180,
      xps: 200,
      credits: 'Good',
    },
    {
      intentionName: 'Finance',
      intentionDescription: 'Daily expeenses shouldnt exceed more than Rs.800.',
      intentionColor: '#33b05d',
      progress: 0.4,
      coins: 80,
      xps: 100,
      credits: 'Better',
    },
    {
      intentionName: 'Learning',
      intentionDescription: 'Learn photoshop course for 2 hours daily.',
      intentionColor: '#0081d1',
      progress: 0.5,
      coins: 130,
      xps: 170,
      credits: 'Better',
    },
    {
      intentionName: 'Leisure',
      intentionDescription: 'Go for a ride.',
      intentionColor: '#e6e200',
      progress: 0.6,
      coins: 200,
      xps: 220,
      credits: 'Best',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.containerHeader}>
        <View style={styles.title}>
          <ActivityIcon name="pulse" color={'#0fb6cd'} size={25} />
          <Text style={styles.titleText}>Today's Activity</Text>
        </View>
      </View>
      <ScrollView>
        <View style={styles.table}>
          <View style={styles.containerBody}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <View style={isClicked ? styles.highLight : null}>
                <Text style={{color: '#eeeeee'}}>M</Text>
              </View>
              <TouchableOpacity onPress={() => setClicked(!isClicked)}>
                <ProgressChart
                  data={data}
                  width={85}
                  height={85}
                  strokeWidth={5}
                  radius={10}
                  chartConfig={chartConfig}
                  hideLegend={true}
                  style={styles.progressChart}
                />
              </TouchableOpacity>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{color: '#eeeeee'}}>T</Text>
              <ProgressChart
                data={data}
                width={85}
                height={85}
                strokeWidth={5}
                radius={10}
                chartConfig={chartConfig}
                hideLegend={true}
                style={styles.progressChart}
              />
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{color: '#eeeeee'}}>W</Text>
              <ProgressChart
                data={data}
                width={85}
                height={85}
                strokeWidth={5}
                radius={10}
                chartConfig={chartConfig}
                hideLegend={true}
                style={styles.progressChart}
              />
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{color: '#eeeeee'}}>T</Text>
              <ProgressChart
                data={data}
                width={85}
                height={85}
                strokeWidth={5}
                radius={10}
                chartConfig={chartConfig}
                hideLegend={true}
                style={styles.progressChart}
              />
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{color: '#eeeeee'}}>F</Text>
              <ProgressChart
                data={data}
                width={85}
                height={85}
                strokeWidth={5}
                radius={10}
                chartConfig={chartConfig}
                hideLegend={true}
                style={styles.progressChart}
              />
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{color: '#eeeeee'}}>S</Text>
              <ProgressChart
                data={data}
                width={85}
                height={85}
                strokeWidth={5}
                radius={10}
                chartConfig={chartConfig}
                hideLegend={true}
                style={styles.progressChart}
              />
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{color: '#eeeeee'}}>S</Text>
              <ProgressChart
                data={data}
                width={85}
                height={85}
                strokeWidth={5}
                radius={10}
                chartConfig={chartConfig}
                hideLegend={true}
                style={styles.progressChart}
              />
            </View>
          </View>
          {isClicked ? (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: -40,
              }}>
              <ProgressChart
                data={data}
                width={200}
                height={200}
                strokeWidth={10}
                radius={10}
                chartConfig={chartConfig}
                hideLegend={true}
                style={styles.progressChart}
              />
            </View>
          ) : null}
          <View style={styles.divider} />
          <View style={{marginBottom: 30}}>
            <View
              style={{
                margin: 20,
              }}>
              <Text style={styles.remaining}>Socius coins</Text>
              <Text style={styles.coinTitle}>350 / 800</Text>
            </View>
            <View style={styles.tableBody}>
              <ProgressBar
                progress={0.3}
                color={'#e5a445'}
                style={styles.progressBar}
              />
            </View>

            <View style={{margin: 20}}>
              <Text style={styles.remaining}>Xps</Text>
              <Text style={styles.xpTitle}>390 / 900</Text>
            </View>
            <View style={styles.tableBody}>
              <ProgressBar
                progress={0.2}
                color={'#ff7821'}
                style={styles.progressBar}
              />
            </View>
            <View style={{margin: 20}}>
              <Text style={styles.remaining}>intentions</Text>
              <Text style={styles.intentionTitle}>3 / 5</Text>
            </View>
            <View style={styles.tableBody}>
              <ProgressBar
                progress={0.7}
                color={'#c90000'}
                style={styles.progressBar}
              />
            </View>
          </View>
        </View>

        <View style={{marginTop: -5}}>
          {intentions.map((intention) => (
            <TouchableOpacity style={styles.listContainer}>
              <View style={styles.listContainerHeader}>
                <View style={styles.header}>
                  <HealthIcon
                    name="directions-run"
                    color={intention.intentionColor}
                    size={20}
                  />
                  <Text
                    style={{
                      marginLeft: 10,
                      fontSize: 16,
                      color: intention.intentionColor,
                    }}>
                    {intention.intentionName}
                  </Text>
                </View>
              </View>
              <View style={styles.descriptionContainer}>
                <ProgressBar
                  progress={intention.progress}
                  color={intention.intentionColor}
                  style={styles.progressBar}
                />
              </View>
              <View style={styles.list}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View style={styles.row}>
                    <CircleIcon
                      name="circle"
                      color={'#e5a445'}
                      size={20}
                      style={{marginLeft: 5}}
                    />
                    <Text style={styles.listBodyText}>{intention.coins}</Text>
                  </View>
                  <View style={{flexDirection: 'row', marginLeft: 10}}>
                    <Text
                      style={{fontSize: 16, color: '#ff7821', marginLeft: 5}}>
                      XP
                    </Text>
                    <Text style={styles.listBodyText}>{intention.xps}</Text>
                  </View>
                </View>
                <View>
                  <Text style={{fontSize: 16, color: '#eeeeee'}}>
                    {intention.credits}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252525',
    marginTop: -60,
  },
  containerHeader: {
    flexDirection: 'row',
    marginLeft: 30,
    margin: 5,
  },
  remaining: {
    fontSize: 14,
    color: '#eeeeee',
  },
  highLight: {
    backgroundColor: 'red',
    width: 30,
    height: 30,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {flexDirection: 'row'},
  list: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
    marginTop: -10,
  },
  listBodyText: {
    fontSize: 16,
    color: '#eeeeee',
    marginLeft: 2,
  },
  xpTitle: {
    fontSize: 20,
    color: '#ff7821',
  },
  intentionTitle: {
    fontSize: 20,
    color: '#c90000',
  },
  tableBody: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flexDirection: 'row',
    margin: 5,
    marginTop: 15,
  },
  titleText: {
    marginLeft: 10,
    fontSize: 20,
    color: '#eeeeee',
  },
  progressChart: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -60,
    marginLeft: 10,
  },
  coinTitle: {
    fontSize: 20,
    color: '#e5a445',
  },
  table: {
    backgroundColor: '#1d1d1d',
    margin: 20,
    borderRadius: 10,
  },
  divider: {
    borderWidth: 0.2,
    borderBottomColor: '#eeeeee',
    margin: 20,
    marginTop: -10,
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
  bodyText: {
    flexDirection: 'row',
    // margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  bodyTextTwo: {
    fontSize: 16,
    color: '#eeeeee',
  },
  progressBar: {
    backgroundColor: '#2d2d2d',
    height: 5,
    width: 300,
  },

  listContainer: {
    backgroundColor: '#1d1d1d',
    borderRadius: 10,
    marginTop: -2,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
  },
  listContainerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    margin: 10,
  },
  descriptionContainer: {
    margin: 5,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    marginLeft: 10,
    fontSize: 16,
    color: '#eeeeee',
  },
  nextIcon: {
    margin: 5,
    marginTop: 10,
  },
});
