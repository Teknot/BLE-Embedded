import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  Dimensions,
} from 'react-native';
import React, { useEffect } from 'react';
import navigationString from '../utils/navigationString';
import { colors } from '../utils/colors';


const windowHeight = Dimensions.get('window').height;
const Splash = ({ navigation }) => {

    useEffect(()=>{
        setTimeout(()=>{
            navigation.replace(navigationString.ConnectScreen)
        },2000)
    },[])
  return (
    <View style={{backgroundColor:'white'}}>
      <StatusBar backgroundColor={ colors.primary } />
      <View style={styles.container}>
        <Image source={require('../../assets/logo.png')} style={{width:150, height:180}} />
      </View>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: windowHeight,
  },
  text: {
    fontSize: 16,
    margin: 3,
    marginTop: 5,
  },
  logocontainer: {
    height: 150,
    width: 150,
    backgroundColor: '#1480F3',
    borderRadius: 25,
    flexDirection: 'row',
  },
  statusbar: {
    backgroundColor: '#1480F3',
  },
  logoupper: {
    marginTop: 20,
    marginLeft: 26,
  },
  logolower: {
    marginTop: 40,
    marginLeft: -50,
  },
});
