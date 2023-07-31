/* eslint-disable no-bitwise */
import {useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
} from 'react-native-ble-plx';
import {PERMISSIONS, requestMultiple} from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';

import {atob, btoa} from 'react-native-quick-base64';

const HEART_RATE_UUID = '0000180d-0000-1000-8000-00805f9b34fb';
const HEART_RATE_CHARACTERISTIC = '00002a37-0000-1000-8000-00805f9b34fa';
const Battery_RATE_CHARACTERISTIC = '00002a37-0000-1000-8000-00805f9b34fb';
const Light_RATE_CHARACTERISTIC = '00002a38-0000-1000-8000-00805f9b34fb';
const Orientation_RATE_CHARACTERISTIC = '00002a39-0000-1000-8000-00805f9b34fb';

const bleManager = new BleManager();

type VoidCallback = (result: boolean) => void;

interface BluetoothLowEnergyApi {
  requestPermissions(cb: VoidCallback): Promise<void>;
  scanForPeripherals(): void;
  connectToDevice: (deviceId: Device, setDeviceId: any) => Promise<void>;
  disconnectFromDevice: () => void;
  connectedDevice: Device | null;
  allDevices: Device[];
  heartRate: number;
  batteryRate: number;
  startStreamingBattery: any;
  orientationRate: number;
  startStreamingOrientation: any;
  writeDataForLight: any;
}

function useBLE(): BluetoothLowEnergyApi {
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [heartRate, setHeartRate] = useState<number>(0);
  const [batteryRate, setBatteryRate] = useState<number>(0);
  const [orientationRate, setOrientationRate] = useState<any>(0);
  const desiredMTUSize = 128;

  const requestPermissions = async (cb: VoidCallback) => {
    if (Platform.OS === 'android') {
      const apiLevel = await DeviceInfo.getApiLevel();

      if (apiLevel < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Bluetooth Low Energy requires Location',
            buttonNeutral: 'Ask Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        cb(granted === PermissionsAndroid.RESULTS.GRANTED);
      } else {
        const result = await requestMultiple([
          PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
          PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ]);

        const isGranted =
          result['android.permission.BLUETOOTH_CONNECT'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          result['android.permission.BLUETOOTH_SCAN'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          result['android.permission.ACCESS_FINE_LOCATION'] ===
            PermissionsAndroid.RESULTS.GRANTED;

        cb(isGranted);
      }
    } else {
      cb(true);
    }
  };

  const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex(device => nextDevice.id === device.id) > -1;

  const scanForPeripherals = () =>
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
      }
      // if (device && device.name?.includes('CorSense')) {
      if (device) {
        setAllDevices((prevState: Device[]) => {
          if (!isDuplicteDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });

  const connectToDevice = async (device: Device, setDeviceId: any) => {
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevice(deviceConnection);
      setMTU(device.id);
      console.log('deviceConnection', deviceConnection);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      bleManager.stopDeviceScan();
      setDeviceId(deviceConnection);
      // startStreamingData(deviceConnection);
      // return deviceConnection;
      // startStreamingBattery(deviceConnection);
      // startStreamingOrientation(deviceConnection)
    } catch (e) {
      console.log('FAILED TO CONNECT', e);
    }
  };
  const setMTU = async (deviceId: any) => {
    try {
      await bleManager.requestMTUForDevice(deviceId, desiredMTUSize);
    } catch (error) {
      console.log('Set MTU error:', error);
    }
  };

  const disconnectFromDevice = () => {
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
      setHeartRate(0);
    }
  };

  const onHeartRateUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null,
  ) => {
    if (error) {
      console.log(error);
      return -1;
    } else if (!characteristic?.value) {
      console.log('No Data was recieved');
      return -1;
    }

    const rawData = atob(characteristic.value);
    let innerHeartRate: number = -1;

    const firstBitValue: number = Number(rawData) & 0x01;

    if (firstBitValue === 0) {
      innerHeartRate = rawData[1].charCodeAt(0);
    } else {
      innerHeartRate =
        Number(rawData[1].charCodeAt(0) << 8) +
        Number(rawData[2].charCodeAt(2));
    }

    setHeartRate(innerHeartRate);
  };

  const startStreamingData = async (device: Device) => {
    if (device) {
      device.monitorCharacteristicForService(
        HEART_RATE_UUID,
        HEART_RATE_CHARACTERISTIC,
        (error, characteristic) => onHeartRateUpdate(error, characteristic),
      );
    } else {
      console.log('No Device Connected');
    }
  };

  // Light--------------------------------------------------------------------
  const writeDataForLight = async (
    device: Device,
    lightData: string,
    setLightData: any,
  ) => {
    // if (device) {
    //   device.writeCharacteristicWithResponseForService(
    //     HEART_RATE_UUID,
    //     Light_RATE_CHARACTERISTIC,
    //     lightData ? '0' : '1',
    //   ).then((res)=>{
    //     console.log(res)
    //     setLightData(!lightData)
    //   })
    //   .catch(err=>{
    //     console.log("Here is the error",err)
    //   })
    // } else {
    //   console.log('No Device Connected');
    // }

    try {
      if (device) {
        await bleManager
          .writeCharacteristicWithResponseForDevice(
            device.id,
            HEART_RATE_UUID,
            Light_RATE_CHARACTERISTIC,
            // lightData ? 'MA==': "MQ==",
            lightData ? btoa('0') : btoa('1'),
          )
          .then(() => {
            setLightData(!lightData);
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        console.log('No device connect...');
      }
    } catch (error) {
      console.log('Send toggle value to BLE error:', error);
    }
  };

  // Battery--------------------------------------------------------------------
  const startStreamingBattery = async (device: Device) => {
    console.log('This is Device: Battery', device);
    if (device) {
      device.monitorCharacteristicForService(
        HEART_RATE_UUID,
        Battery_RATE_CHARACTERISTIC,
        (error, characteristic) => onBatteryRateUpdate(error, characteristic),
      );
    } else {
      console.log('No Device Connected');
    }
  };

  const onBatteryRateUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null,
  ) => {
    if (error) {
      console.log(error);
      return -1;
    } else if (!characteristic?.value) {
      console.log('No Data was recieved');
      return -1;
    }

    const rawData = atob(characteristic.value);
    let innerHeartRate: number = -1;

    const firstBitValue: number = Number(rawData) & 0x01;

    if (firstBitValue === 0) {
      innerHeartRate = rawData[1].charCodeAt(0);
    } else {
      innerHeartRate =
        Number(rawData[1].charCodeAt(0) << 8) +
        Number(rawData[2].charCodeAt(2));
    }

    setBatteryRate(innerHeartRate);
  };

  // Orientation --------------------------------------------------------------------
  const startStreamingOrientation = async (device: Device) => {
    console.log('This is Device: ', device);
    if (device) {
      device.monitorCharacteristicForService(
        HEART_RATE_UUID,
        Orientation_RATE_CHARACTERISTIC,
        (error, characteristic) =>
          onOrientationRateUpdate(error, characteristic),
      );
    } else {
      console.log('No Device Connected');
    }
  };

  const onOrientationRateUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null,
  ) => {
    if (error) {
      console.log(error);
      return -1;
    } else if (!characteristic?.value) {
      console.log('No Data was recieved');
      return -1;
    }

    const rawData = atob(characteristic.value) ;
    
    if (rawData.length > 3) {
      const oriendationData =  rawData.replace("{",'').replace("}",'',).replace(/"/g,"")
     
      setOrientationRate(oriendationData);
      
    }
  };

  return {
    scanForPeripherals,
    requestPermissions,
    connectToDevice,
    allDevices,
    connectedDevice,
    disconnectFromDevice,
    heartRate,
    batteryRate,
    startStreamingBattery,
    orientationRate,
    startStreamingOrientation,
    writeDataForLight,
  };
}

export default useBLE;

1;

// You are attempting to write characteristic 2A38, which is the sensor location attribute for a heart-rate monitor
// This is a read-only attribute as you can't change the location of a sensor simply by writing a new value to a characteristic.
