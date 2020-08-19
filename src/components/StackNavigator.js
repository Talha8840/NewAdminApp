import React from 'react';
import {Platform} from 'react-native';
import SCREENS from '../../SCREENS';
import TabNavigator from '../components/TabNavigator';
import Login from '../screens/Login';
import SignInOtp from '../screens/SignInOtp';
import SignUPOtp from '../screens/SignUp/SignUpOtp';
import Welcome from '../screens/Welcome';
import SignInEntry from '../screens/SignInEntry';
import SignUp from '../screens/SignUp';
import CreateIntention from '../screens/CreateIntention';
import RateIntention from '../screens/RateIntention';
import Congratulation from '../components/Congratulation';
import MeditationRoom from '../screens/MeditationRoom';
import MetaWorldMain from '../screens/MetaWorldMain';
import CreateMetaWorld from '../screens/CreateMetaWorld';
import MetaWorldCongratulation from '../screens/CreateMetaIntention/MetaWorldCongratulation';
import MetaIntentionDescription from '../screens/MetaIntentionDescription';
import CreateMetaIntention from '../screens/CreateMetaIntention';
import EditMetaWorld from '../screens/EditMetaWorld';
import Finish from '../screens/EditMetaWorld/Finish';
import Profile from '../screens/Profile';
import About from '../screens/About';
import MasterCongrats from '../screens/MasterCongrats';
import EditProfile from '../screens/EditProfile';
import ActivityScreen from '../screens/ActivityScreen';
import Start from '../screens/Start';
import EditIntentions from '../screens/Home/EditIntentions';
import MetaWorldSlides from '../screens/MetaWorldSlides';
import {createStackNavigator} from '@react-navigation/stack';
import Milestone from '../screens/MasterCongrats/Milestone';
import LevelUpCongrats from '../screens/MasterCongrats/LevelUpCongrats';
import AwardCongrats from '../screens/MasterCongrats/AwardCongrats';

const Stack = createStackNavigator();

export default function StackNavigator({user}) {
  return (
    <Stack.Navigator
      initialRouteName={user == null ? SCREENS.START : SCREENS.WELCOME}>
      <Stack.Screen
        name={SCREENS.WELCOME}
        component={Welcome}
        initialParams={{user}}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SCREENS.START}
        component={Start}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TabNavigator"
        component={TabNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SCREENS.CREATE_METAWORLD}
        component={CreateMetaWorld}
        options={{
          headerShown: Platform.OS == 'ios' ? false : true,
          headerTitleStyle: {color: '#2e2e2e', fontSize: 25},
        }}
      />
      <Stack.Screen
        name={SCREENS.LOGIN}
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SCREENS.SIGNUP}
        component={SignUp}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SCREENS.SIGNIN_ENTRY}
        component={SignInEntry}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SCREENS.MEDITATION_ROOM}
        component={MeditationRoom}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SCREENS.CREATE_INTENTION}
        component={CreateIntention}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SCREENS.RATE_INTENTION}
        component={RateIntention}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SCREENS.METAWORLD_MAIN}
        component={MetaWorldMain}
        options={{
          headerShown: Platform.OS == 'ios' ? false : true,
          headerTitle: false,
        }}
      />
      <Stack.Screen
        name={SCREENS.SIGNIN_OTP}
        component={SignInOtp}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SCREENS.SIGNUP_OTP}
        component={SignUPOtp}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SCREENS.CONGRATULATION}
        component={Congratulation}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SCREENS.ACTIVITY_SCREEN}
        component={ActivityScreen}
        options={{headerTitle: false}}
      />
      <Stack.Screen
        name={SCREENS.METAWORLD_CONGRATULATION}
        component={MetaWorldCongratulation}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SCREENS.METAINTENTION_DESCRIPTION}
        component={MetaIntentionDescription}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SCREENS.CREATE_METAINTENTION}
        component={CreateMetaIntention}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SCREENS.EDIT_METAWORLD}
        component={EditMetaWorld}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SCREENS.FINISH}
        component={Finish}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SCREENS.PROFILE_SCREEN}
        component={Profile}
        options={{
          headerShown: Platform.OS == 'ios' ? false : true,
          headerTitle: false,
        }}
      />
      <Stack.Screen
        name={SCREENS.ABOUT}
        component={About}
        options={{headerTitleStyle: {color: '#eeeeee', fontSize: 25}}}
      />
      <Stack.Screen
        name={SCREENS.PROFILE}
        component={EditProfile}
        options={{headerTitleStyle: {color: '#eeeeee', fontSize: 25}}}
      />
      <Stack.Screen
        name={SCREENS.EDIT_INTENTION}
        component={EditIntentions}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SCREENS.METAWORLD_SLIDES}
        component={MetaWorldSlides}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SCREENS.MILESTONE}
        component={Milestone}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SCREENS.LEVELUP_CONGRATS}
        component={LevelUpCongrats}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SCREENS.AWARD_CONGRATS}
        component={AwardCongrats}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
