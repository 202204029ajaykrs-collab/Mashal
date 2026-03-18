import { Platform } from 'react-native';

// For Android emulator use 10.0.2.2; for iOS simulator use localhost. 
// // For physical devices, replace with your machine's LAN address (e.g. http://192.168.1.100:3000).

export const API_URL = Platform.select({
  ios: 'http://localhost:3000',
  android: 'http://10.0.2.2:3000',
  default: 'http://172.21.207.26:3000',
});