import {StyleSheet, View,Text, Image} from 'react-native';
import React, { useEffect,useContext } from 'react';

import useBLE from '../../../useBLE';
import { DeviceContext } from '../../utils/context';
import {useIsFocused} from '@react-navigation/native';

const BatteryScreen = () => {
  const { deviceId } = useContext(DeviceContext);
  const isFocused = useIsFocused();

  const {
    batteryRate,
    startStreamingBattery,
  } = useBLE();

  useEffect(() => {
    if(isFocused){
    console.log('Battery')
    startStreamingBattery(deviceId)
  }
  }, [isFocused])
  


  return (
    <View style={styles.container}>
      <Image
        style={{width: 200, height: 200}}
        source={require('../../../assets/battery.png')}
      />
      <Text style={styles.text}>{batteryRate}%</Text>
    </View>
  );
};

export default BatteryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'white'

  },
  text:{
    fontSize:30,
    marginTop:20,
    fontWeight:'bold'
  }
});
