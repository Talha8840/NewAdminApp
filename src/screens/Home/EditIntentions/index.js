import React from 'react';
import EditAdminIntension from './EditAdminIntension';
import EditUserIntension from './EditUserIntension';
import EditMetaIntension from './EditMetaIntension';

const index = ({route, navigation}) => {
  const intention = route.params.intention;

  const editType = () => {
    switch (intention.taskType) {
      case 'admin':
        return (
          <EditAdminIntension navigation={navigation} intention={intention} />
        );
      case 'user':
        return (
          <EditUserIntension navigation={navigation} intention={intention} />
        );
      case 'meta':
        return (
          <EditMetaIntension navigation={navigation} intention={intention} />
        );
    }
  };
  return editType();
};

export default index;

