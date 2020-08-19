import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import LinearGradient from 'react-native-linear-gradient';
import {startOfDay, endOfDay} from 'date-fns';
import {USER_ACTIVITY_BY_USERID} from '../graphql/query';
import {useQuery} from '@apollo/client';
import useGetUser from '../hooks/useGetUser';
import SCREENS from '../../SCREENS';
import {useIsFocused} from '@react-navigation/native';

export default function Notification({navigation}) {
  const [userId, setuserId] = useState(null);
  const isFocused = useIsFocused();
  const [isMorningMeditationDone, setMorningMeditationDone] = useState(false);
  const [isEveningMeditationDone, setEveningMeditationDone] = useState(false);
  const [userActivity, setUserActivity] = useState([]);
  const dateNow = new Date();
  const startDate = startOfDay(dateNow);
  const endDate = endOfDay(dateNow);

  const userData = useGetUser(userId);

  const remainingTask =
    (userData && userData.getUser.tasks.items.length - ratedTask) || 0;

  const {refetch} = useQuery(USER_ACTIVITY_BY_USERID, {
    variables: {
      userId: userId,
      createdAt: {between: [startDate, endDate]},
    },
    onCompleted: (data) => {
      console.log('Data', data);
      setUserActivity(data.UserActivityByUserId.items);
      data.UserActivityByUserId.items.forEach((item) => {
        if (item.actionId == 'MORNING_MEDITATION') {
          setMorningMeditationDone(true);
        } else if (item.actionId == 'EVENING_MEDITATION') {
          setEveningMeditationDone(true);
        }
        // else if (item.actionId.indexOf('INTENTION_RATING') == 0) {
        //   setRatedTask(ratedTask + 1);
        // }
      });
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  async function userfunc() {
    const user = await AsyncStorage.getItem('userId');
    setuserId(user);
  }
  useEffect(() => {
    userfunc();
    refetch();
  }, [isFocused]);

  const userTasks = userData && userData.getUser.tasks.items;

  const currentTime = new Date().getTime();

  const filteredUserTask =
    userTasks &&
    userTasks.filter((item) => {
      const startDateInSeconds = new Date(item.startDate).getTime();
      const endDateInSeconds = new Date(item.endDate).getTime();
      if (currentTime > startDateInSeconds && currentTime < endDateInSeconds) {
        return true;
      }
    });

  const intentionRating = userActivity.filter(
    (item) => item.actionId.indexOf('INTENTION_RATING') == 0,
  );

  let flag = false;
  let ratedTask = 0;
  filteredUserTask &&
    filteredUserTask.forEach((userTask) => {
      const taskId = userTask.id;
      flag = intentionRating.some((item) => item.taskId === taskId);
      if (flag) {
        ratedTask = ratedTask + 1;
      }
    });

  console.log(ratedTask, 'ratedTask');

  const totalUserTask = filteredUserTask && filteredUserTask.length;

  const tasksToRate = totalUserTask - ratedTask;

  console.log(tasksToRate, 'taskToRate');

  return (
    <View style={styles.mainContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.headerText}>Notification</Text>
      </View>
      <View style={styles.container}>
        {!isMorningMeditationDone ? (
          <TouchableOpacity
            onPress={() => navigation.navigate(SCREENS.MEDITATION_ENTRY)}>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#13529f', '#975bc1']}
              style={styles.notificationText}>
              <Text style={styles.text}>
                You have to do morning meditation.
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : null}
        {!isEveningMeditationDone ? (
          <TouchableOpacity
            onPress={() => navigation.navigate(SCREENS.MEDITATION_ENTRY)}>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#13529f', '#975bc1']}
              style={styles.notificationText}>
              <Text style={styles.text}>
                You have to do evening meditation.
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : null}
        {tasksToRate > 0 ? (
          <TouchableOpacity onPress={() => navigation.navigate(SCREENS.HOME)}>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#13529f', '#975bc1']}
              style={styles.notificationText}>
              <Text style={styles.text}>
                You have {tasksToRate} task to rate.
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : null}

        {isMorningMeditationDone &&
        isEveningMeditationDone &&
        tasksToRate == 0 ? (
          <TouchableOpacity>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#eeeeee', '#eeeeee']}
              style={styles.notificationText}>
              <Text style={styles.noNotificationText}>
                You have no notifications.
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flex: 0.1,
    backgroundColor: '#252525',
    justifyContent: 'center',
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    color: '#eeeeee',
  },
  notificationText: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    borderRadius: 10,
    padding: 25,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#252525',
  },
  container: {
    flex: 1,
    backgroundColor: '#252525',
    marginTop: 10,
  },
  noNotificationText: {
    marginBottom: 10,
    borderRadius: 10,
    color: '#2e2e2e',
    fontSize: 16,
  },
  headerText: {
    fontSize: 30,
    color: '#eeeeee',
    marginLeft: 15,
    fontWeight: '900',
    fontFamily: 'SFUIDisplay-Semibold',
  },
});
