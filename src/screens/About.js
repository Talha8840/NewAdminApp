import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import SCREENS from '../../SCREENS';
import Logo from '../assets/images/logo.png';

export default function About({navigation}) {
  navigation.setOptions({
    headerStyle: {
      elevation: 0,
      backgroundColor: '#252525',
    },
    headerLeft: () => (
      <Icon
        name="ios-arrow-back"
        size={25}
        color="#0fb6cd"
        style={styles.iconMargin}
        onPress={() =>
          navigation.navigate('TabNavigator', {screen: SCREENS.MENU})
        }
      />
    ),
  });
  return (
    <View style={styles.container}>
      <View>
        <Image resizeMode="cover" source={Logo} style={styles.image} />
      </View>
      <View style={styles.marginContainer}>
        <Text style={styles.text}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s.
        </Text>
      </View>
      <View style={styles.subContainer}>
        <Text style={styles.text}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book.
        </Text>
      </View>
      <View style={styles.linksContainer}>
        <TouchableOpacity>
          <Text style={styles.links}>Terms and Conditions</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.links}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.links}>User Agreement</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.subContainer}>
        <Text style={styles.versionText}>Version</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252525',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconMargin: {padding: 20},
  image: {
    width: 200,
    height: 200,
  },
  text: {
    fontSize: 16,
    color: '#eeeeee',
  },
  marginContainer: {margin: 20},
  links: {
    fontSize: 16,
    color: '#0fb6cd',
    margin: 2,
  },
  subContainer: {
    margin: 20,
    marginTop: -5,
  },
  linksContainer: {
    margin: 20,
    marginTop: -5,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 16,
    color: '#0fb6cd',
  },
});
