import React, {useState, useRef, useEffect} from 'react';
import {
  PermissionsAndroid,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import ImageResizer from 'react-native-image-resizer';

export default function Camera({
  setSelectedImg,
  setTakePhoto,
  setImageError,
  setNavigation,
}) {
  const [frontCam, setFrontCam] = useState(false);
  const [data, setData] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const ref = useRef();

  useEffect(() => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
      title: 'Take photo',
      message: 'App needs access to your camera.',
    });
  });

  const takePicture = async function () {
    if (ref && ref.current) {
      const data = await ref.current.takePictureAsync();

      ImageResizer.createResizedImage(data.uri, 400, 800, 'JPEG', 100)
        .then(({uri}) => {
          console.log(uri, 'uri');
          const selectedImage = {uri: uri};
          setData(selectedImage);
          setIsModal(true);
          setImageError(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <>
      <View style={styles.container}>
        <RNCamera
          ref={ref}
          style={styles.flexBetween}
          type={
            frontCam
              ? RNCamera.Constants.Type.front
              : RNCamera.Constants.Type.back
          }
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        />
        <View style={styles.center}>
          <TouchableOpacity onPress={() => takePicture()} style={styles.camera}>
            <Icon name="camera-iris" size={50} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFrontCam(!frontCam)}
            style={styles.flip}>
            <Icon name="camera-party-mode" size={40} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
      <Modal isVisible={isModal} animationIn="zoomIn">
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            Are you sure want to save this photo?
          </Text>
          <View style={styles.column}>
            <View style={styles.rowAround}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setIsModal(false);
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
                  setNavigation(true);
                  setSelectedImg(data);
                  setTakePhoto(false);
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
            {/* <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setTakePhoto(false);
                }}>
                <LinearGradient
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  colors={['#13529f', '#975bc1']}
                  style={styles.modalButtonTextView}>
                  <Text style={styles.modalButtonText}>Go Back</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View> */}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  flexBetween: {
    flex: 1,
    justifyContent: 'space-between',
  },
  flip: {
    alignSelf: 'flex-start',
    bottom: 37,
    left: 55,
    position: 'absolute',
    padding: 5,
  },
  center: {justifyContent: 'center', alignItems: 'center'},
  closeButton: {
    textAlign: 'right',
    fontSize: 20,
    color: '#13529f',
    marginTop: 5,
    fontWeight: 'bold',
  },
  camera: {
    // alignSelf: 'flex-start',
    bottom: 37,
    position: 'absolute',
    padding: 5,
  },
  modalButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '60%',
  },
  column: {flexDirection: 'column', justifyContent: 'space-between'},
  rowAround: {flexDirection: 'row', justifyContent: 'space-around'},
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
