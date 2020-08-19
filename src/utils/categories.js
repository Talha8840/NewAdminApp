import React from 'react';
import HealthIcon from 'react-native-vector-icons/MaterialIcons';
import LeisureIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import CareerIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MetaLifeIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FinanceIcon from 'react-native-vector-icons/FontAwesome';
import ContributeIcon from 'react-native-vector-icons/FontAwesome5';
import OppurtunityIcon from 'react-native-vector-icons/FontAwesome5';
import LearningIcon from 'react-native-vector-icons/FontAwesome5';
import BusinessIcon from 'react-native-vector-icons/Entypo';
import ProjectIcon from 'react-native-vector-icons/Ionicons';
import RelationshipIcon from 'react-native-vector-icons/FontAwesome';
import PetsIcon from 'react-native-vector-icons/MaterialIcons';
import SpiritualIcon from 'react-native-vector-icons/FontAwesome5';
import SelfCareIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import OthersIcon from 'react-native-vector-icons/Entypo';
import VacationIcon from 'react-native-vector-icons/AntDesign';
import HouseIcon from 'react-native-vector-icons/FontAwesome';
import MysticalIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ThingsIcon from 'react-native-vector-icons/Entypo';

export const categories = {
  BUSINESS: {
    color: '#2b6fec',
    icon: <BusinessIcon name="suitcase" color="#2b6fec" size={20} />,
  },
  CONTRIBUTION: {
    color: '#16dcd5',
    icon: (
      <ContributeIcon name="hand-holding-heart" color="#16dcd5" size={20} />
    ),
  },
  FINANCE: {
    color: '#68b42e',
    icon: <FinanceIcon name="rupee" color="#68b42e" size={20} />,
  },
  HEALTH: {
    color: '#e04646',
    icon: <HealthIcon name="directions-run" color="#e04646" size={20} />,
  },
  LEARNING: {
    color: '#59a1f6',
    icon: <LearningIcon name="graduation-cap" color="#59a1f6" size={20} />,
  },
  LEISURE: {
    color: '#ffeb0f',
    icon: <LeisureIcon name="sofa" color="#ffeb0f" size={20} />,
  },
  PROJECTS: {
    color: '#d9975c',
    icon: <ProjectIcon name="ios-document" color="#d9975c" size={20} />,
  },
  RELATIONSHIPS: {
    color: '#fd89b5',
    icon: <RelationshipIcon name="heart" color="#fd89b5" size={20} />,
  },
  SPIRITUAL: {
    color: '#af6ac9',
    icon: <SpiritualIcon name="star-of-david" color="#af6ac9" size={20} />,
  },
  SELF_CARE: {
    color: '#cf4572',
    icon: <SelfCareIcon name="human-male" color="#cf4572" size={20} />,
  },
  OTHERS: {
    color: '#daff0f',
    icon: <OthersIcon name="circle" color="#daff0f" size={20} />,
  },
  PETS: {
    color: '#99722e',
    icon: <PetsIcon name="pets" color="#99722e" size={20} />,
  },
  CAREER: {
    color: '#097fa5',
    icon: <CareerIcon name="human-male" color="#097fa5" size={20} />,
  },
  OPPURTUNITIES: {
    color: '#14f068',
    icon: <OppurtunityIcon name="binoculars" color="#14f068" size={20} />,
  },
  VACATION: {
    color: '#ffa210',
    icon: <VacationIcon name="car" color="#ffa210" size={20} />,
  },
  THINGS: {
    color: '#29af1b',
    icon: <ThingsIcon name="trophy" color="#29af1b" size={20} />,
  },
  HOUSE: {
    color: '#437fd8',
    icon: <HouseIcon name="home" color="#437fd8" size={20} />,
  },
  MYSTICAL_EXPERIENCE: {
    color: '#a340c3',
    icon: <MysticalIcon name="ethereum" color="#a340c3" size={20} />,
  },
  METALIFE: {
    color: '#ad36d9',
    icon: <MetaLifeIcon name="account-heart" color="#ad36d9" size={20} />,
  },
};
