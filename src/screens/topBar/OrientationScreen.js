import {StyleSheet, View, Image, Text} from 'react-native';
import React, {useContext, useEffect} from 'react';
import {DeviceContext} from '../../utils/context';
import useBLE from '../../../useBLE';
import {useIsFocused} from '@react-navigation/native';

const OrientationScreen = () => {
  const {deviceId} = useContext(DeviceContext);
  const isFocused = useIsFocused();

  const {orientationRate, startStreamingOrientation} = useBLE();

  useEffect(() => {
    if (isFocused) {
      console.log('Orientation');
      startStreamingOrientation(deviceId);
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <Image
        style={{width: 200, height: 200}}
        source={require('../../../assets/orientation.png')}
      />
      <Text style={styles.text}>{orientationRate}</Text>
    </View>
  );
};

export default OrientationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 30,
    marginTop: 20,
    fontWeight: 'bold',
  },
});
