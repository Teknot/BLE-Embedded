import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import React, {useEffect} from 'react';
import useBLE from '../../useBLE';
import RenderDevices from '../components/RenderDevices';
import navigationString from '../utils/navigationString';
import {useIsFocused} from '@react-navigation/native';

const windowHeight = Dimensions.get('window').height;
const ConnectScreen = ({navigation}) => {
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    heartRate,
    disconnectFromDevice,
  } = useBLE();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (connectedDevice) {
      navigation.navigate(navigationString.Tabs);
    }
  }, [connectedDevice]);

  const scanForDevices = () => {
    requestPermissions(isGranted => {
      if (isGranted) {
        scanForPeripherals();
      }
    });
  };

  const handleConnect = () => {
    scanForDevices();
  };

  const scanForWifiDevices = ()=>{
    requestPermissions(isGranted => {
      if (isGranted) {
        
      }
    });
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#248EFF'} />
      {allDevices.length > 0 ? (
        <RenderDevices devices={allDevices} connectToDevice={connectToDevice} />
      ) : (
        <>
          <TouchableOpacity style={styles.btn} onPress={handleConnect}>
            <Text style={styles.btntext}>Connect</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={scanForWifiDevices}>
            <Text style={styles.btntext}>Connect To Wifi</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default ConnectScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  btn: {
    backgroundColor: '#1480F3',
    width: 125,
    height: 55,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btntext: {
    fontSize: 18,
    color: '#FFFFFF',
  },
});
