import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {Image, Platform, PermissionsAndroid, Dimensions} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import ImageResizer from 'react-native-image-resizer';
import FastImage from 'react-native-fast-image';

const window = Dimensions.get('window');
export default class LocalImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edges: [],
      largePicIndex: 0,
      loadNoOfImg: 50,
      userId: '',
      hasCameraPermission: false,
      location: '',
      endCursor: '',
      hasNextPage: true,
      videoContainer: 'contain',
      isBottomSheetOpen: false,
      isModal: false,
    };
  }

  componentWillMount = () => {
    if (Platform.OS === 'android') {
      this.askPermissionToAndroid();
    } else {
      this.getPhotos();
    }
  };
  componentDidMount = () => {
    this.setState({hasCameraPermission: true});
  };
  askPermissionToAndroid = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Gallery Permission',
          message: 'LITT needs access to your gallery.',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.setState({hasCameraPermission: true});
        this.getPhotos();
      } else {
        this.setState({hasCameraPermission: false});
      }
    } catch (err) {
      console.warn('Error ', err);
    }
  };
  getPhotos = () => {
    let fetchParams = {
      first: 50,
      assetType: 'Photos',
    };
    if (this.state.endCursor) {
      fetchParams.after = this.state.endCursor;
    }
    CameraRoll.getPhotos(fetchParams)
      .then((e) => {
        if (this.state.hasNextPage) {
          const filterThumbnails = e.edges.filter(
            (item) => item.node.group_name !== '.thumbnails',
          );

          console.log(filterThumbnails, 'filterThumbnails');

          console.log(e.edges[10].node.group_name, 'e.edges  ');
          this.setState({
            edges: [...this.state.edges, ...filterThumbnails],
            endCursor: e.page_info.end_cursor,
            hasNextPage: e.page_info.has_next_page,
          });
        }
      })
      .catch((err) => {
        console.log('Fetch error ', err);
      });
  };
  galleryHeaderComponent = () => {
    return (
      <View>
        {this.state.edges.length > 0 ? (
          <FastImage
            style={styles.image}
            resizeMode={FastImage.resizeMode.cover}
            source={{
              uri:
                this.state.edges.length > 0
                  ? this.state.edges[this.state.largePicIndex].node.image.uri
                  : null,
              priority: FastImage.priority.normal,
            }}
          />
        ) : null}
      </View>
    );
  };
  async uploadPicture(edges, index) {
    console.log(this.state.edges[this.state.largePicIndex].node.image.filename);
    await fetch(
      'https://815xg4up3i.execute-api.ap-south-1.amazonaws.com/dev/demo-RoundTwo',
      {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({
          key: `nithan/${
            this.state.edges[this.state.largePicIndex].node.image.filename
          }`,
        }),
      },
    )
      .then((res) => res.json())
      .then((response) => {
        console.log(response);
        fetch(response.Url, {
          method: 'PUT',
          mode: 'cors',
          body: this.state.edges[this.state.largePicIndex].node.image,
        })
          .then((res) => {
            // console.log(res)
            alert('Picture uploaded successfully...');
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }

  renderGalleryImages = ({item, index}) => {
    return (
      <View key={String(Math.random() + index)} style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            console.warn(item.node.image.uri, 'item');
            this.refs.listRef.scrollToOffset({x: 0, y: 0, animated: true});
            this.setState({
              largePicIndex: index,
            });
          }}>
          <FastImage
            resizeMode={FastImage.resizeMode.cover}
            source={{
              uri: item.node.image.uri,
              priority: FastImage.priority.normal,
            }}
            style={styles.imageSelect}
          />
        </TouchableOpacity>
      </View>
    );
  };
  render() {
    if (this.state.edges.length < 0) {
      return (
        <View>
          <Text>Loading</Text>
        </View>
      );
    }
    return (
      <SafeAreaView style={styles.safeArea}>
        {this.state.hasCameraPermission ? (
          <View style={styles.mainContainer}>
            <View>
              <FlatList
                contentContainerStyle={styles.containerWidth}
                columnWrapperStyle={styles.center}
                numColumns={3}
                ref="listRef"
                ListHeaderComponent={this.galleryHeaderComponent}
                ListFooterComponent={
                  <View style={styles.bodyContainer}>
                    <Text>That's all ...</Text>
                  </View>
                }
                ListEmptyComponent={
                  <View style={styles.empty}>
                    <Text>Gallery is Empty.</Text>
                  </View>
                }
                data={this.state.edges}
                extraData={this.state}
                renderItem={this.renderGalleryImages}
                keyExtractor={(item, index) => item.node.image.uri + index}
                onEndReached={this.getPhotos}
                onEndReachedThreshold={0.5}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                this.setState({isModal: true});
              }}
              style={styles.select}>
              <Text style={styles.done}>Done</Text>
              <Icon name="check-all" size={25} color="#00B33C" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.askPermission}>
            <TouchableOpacity
              onPress={this.askPermissionToAndroid}
              style={styles.top}>
              <Text>Click here to allow the app to access the gallery</Text>
            </TouchableOpacity>
          </View>
        )}

        <Modal isVisible={this.state.isModal} animationIn="zoomIn">
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Are you sure want to upload this photo?
            </Text>
            <View style={styles.rowEvenly}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  this.setState({isModal: false});
                }}>
                <LinearGradient
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  colors={['#13529f', '#975bc1']}
                  style={styles.modalButtonTextView}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  this.props.setNavigation({isNavigation: true});
                  const selectedImage = this.state.edges[
                    this.state.largePicIndex
                  ].node.image;
                  console.warn(selectedImage, 'selectedImage');
                  ImageResizer.createResizedImage(
                    selectedImage.uri,
                    400,
                    800,
                    'JPEG',
                    100,
                  )
                    .then(({uri}) => {
                      console.log(uri, 'uri');
                      const selectedImg = {uri: uri};
                      this.props.setSelectedImg(selectedImg);
                      this.props.setImageError(false);
                      this.props.setShowImageUpload(false);
                      this.props.setModal(false);
                      this.setState({isModal: false});
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }}>
                <LinearGradient
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  colors={['#13529f', '#975bc1']}
                  style={styles.modalButtonTextView}>
                  <Text style={styles.modalButtonText}>Yes</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  select: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    bottom: 5,
    right: 10,
    position: 'absolute',
    padding: 5,
    flexDirection: 'row',
    backgroundColor: '#975bc1',
    borderRadius: 10,
  },
  done: {fontSize: 25, color: '#eeeeee', margin: 5},
  askPermission: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  top: {marginTop: 6},
  safeArea: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {height: '100%', width: '100%'},
  containerWidth: {
    width: '100%',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderTopColor: '#eee',
    borderTopWidth: 1,
  },
  empty: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    height: 400,
    width: '100%',
    borderRadius: 3,
    paddingBottom: 5,
  },
  container: {margin: StyleSheet.hairlineWidth, alignSelf: 'center'},
  rowEvenly: {flexDirection: 'row', justifyContent: 'space-evenly'},
  modalButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '60%',
  },
  imageSelect: {
    borderRadius: 6,
    width: window.width / 3,
    height: window.width / 4,
  },
  modalButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    color: '#eeeeee',
  },
  modalButtonTextView: {
    margin: 25,
    padding: 10,
    borderRadius: 25,
    width: '50%',
  },
  modalText: {
    fontSize: 20,
    color: '#252525',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
  },
  modalView: {
    flex: 0.5,
    backgroundColor: '#ffff',
    margin: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
