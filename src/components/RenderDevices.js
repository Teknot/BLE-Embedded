import {StyleSheet, Text, View, FlatList, TouchableOpacity,Image} from 'react-native';
import React, {useCallback, useContext, useEffect} from 'react';
import {colors} from '../utils/colors';
import { DeviceContext } from '../utils/context';
const RenderDevices = ({devices, connectToDevice}) => {
  const {setDeviceId} = useContext(DeviceContext);

  const renderDeviceModalListItem = useCallback(
    item => {
      const component = item?.item?.name ? (
        <TouchableOpacity
          onPress={() => {
            connectToDevice(item.item,setDeviceId);
            setDeviceId(item.item);
          }}
          style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>{item.item.name}</Text>
        </TouchableOpacity>
      ) : (
        <></>
      );

      return component;
    },
    [connectToDevice],
  );
  return (
    <View style={{width: '100%', flexGrow: 1, padding: 20}}>
      <View style={styles.container}>
        <Image
          source={require('../../assets/logo.png')}
          style={{width: 100, height: 100,alignSelf:'center'}}
          resizeMode='contain'
        />
      </View>
      <Text style={styles.title}>Tap on a device to connect</Text>
      <FlatList
        contentContainerStyle={styles.modalFlatlistContiner}
        data={devices}
        renderItem={renderDeviceModalListItem}
      />
    </View>
  );
};

export default RenderDevices;

const styles = StyleSheet.create({
  modalFlatlistContiner: {
    width: '100%',
    flexGrow: 1,
  },
  ctaButton: {
    backgroundColor: colors.primary,
    width: '100%',
    marginTop: 10,
    padding: 16,
    borderRadius: 10,
    elevation: 3,
  },
  ctaButtonText: {
    color: 'white',
    fontSize: 16,
  },
  title: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
