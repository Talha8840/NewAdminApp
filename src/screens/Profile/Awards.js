import React from 'react';
import {View, StyleSheet, Image, Text, FlatList} from 'react-native';
import FastImage from 'react-native-fast-image';

export default function Awards({data, userAwards}) {
  const findImg = (item) => {
    const userAwardArr =
      userAwards &&
      userAwards.userAwardByUserId.items.filter((i) => i.awardId == item.id);
    if (userAwardArr && userAwardArr.length !== 0) {
      return item.url;
    } else {
      return item.blurredImageUrl;
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.flatListContainer}
        data={data && data.listAwards.items}
        numColumns={3}
        renderItem={({item}) => {
          return (
            <View style={styles.awards}>
              <FastImage
                style={styles.image}
                resizeMode={FastImage.resizeMode.contain}
                source={{
                  uri: findImg(item),
                  priority: FastImage.priority.normal,
                }}
              />
              {/* <Image
                source={{uri: findImg(item)}}
                style={styles.image}
                resizeMode="contain"
              /> */}
              <Text style={styles.text}>{item.name}</Text>
            </View>
          );
        }}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: -30,
    marginBottom: 30,
  },
  flatListContainer: {
    flex: 1,
    flexDirection: 'column',
    margin: 5,
  },
  image: {
    width: 80,
    height: 80,
  },
  text: {
    fontSize: 13,
    color: '#eeeeee',
    textAlign: 'center',
  },
  awards: {
    width: '33.3%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
});
