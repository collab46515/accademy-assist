import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.043e5de60e7540f4bd46c34c0ce43ff7',
  appName: 'Doxa Technology Solutions',
  webDir: 'dist',
  server: {
    url: 'https://043e5de6-0e75-40f4-bd46-c34c0ce43ff7.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    BarcodeScanner: {
      cameraDirection: 'back'
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      showSpinner: false
    },
    StatusBar: {
      style: 'default',
      backgroundColor: '#ffffff'
    }
  }
};

export default config;