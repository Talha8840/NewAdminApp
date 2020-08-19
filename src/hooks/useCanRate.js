import {useState} from 'react';
import {useQuery, useMutation, from} from '@apollo/client';
import {startOfDay, endOfDay} from 'date-fns';
import {USER_ACTIVITY_BY_USERID} from '../graphql/query';

export default function useCanRate(userId, intention) {
  const [canRate, setCanRate] = useState(true);

  const dateNow = new Date();

  const startDate = startOfDay(dateNow);
  const endDate = endOfDay(dateNow);

  useQuery(USER_ACTIVITY_BY_USERID, {
    variables: {
      userId: userId,
      createdAt: {between: [startDate, endDate]},
    },
    skip: !userId,
    onCompleted: (data) => {
      console.warn(data.UserActivityByUserId.items, 'userData hello');
      data.UserActivityByUserId.items.forEach((item) => {
        if (item.taskId === intention.id) {
          setCanRate(false);
          return item;
        }
      });
    },
    fetchPolicy: 'network-only',
  });
  return canRate;
}
