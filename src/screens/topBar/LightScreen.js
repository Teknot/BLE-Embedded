import {StyleSheet, View, Image,Text,TouchableOpacity} from 'react-native';
import React,{useContext,useState} from 'react';

import useBLE from '../../../useBLE';
import { DeviceContext } from '../../utils/context';

const LightScreen = () => {
  const [lightData, setLightData] = useState(false)
  const { deviceId } = useContext(DeviceContext);

  const {
    writeDataForLight
  } = useBLE();

  const handleLight = ()=>{
   writeDataForLight(deviceId, lightData, setLightData) 
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleLight} >
      <Image
        style={{height: 230, width: 230,}}
        resizeMode='contain'
        source={lightData ? require('../../../assets/light.png') : require('../../../assets/lightOff.png') }
      />
      </TouchableOpacity>

      <Text style={styles.text}>
        {
          lightData ? "ON" : "OFF"
        }
      </Text>
    
    </View>
  );
};

export default LightScreen;

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
