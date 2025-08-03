import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.043e5de60e7540f4bd46c34c0ce43ff7',
  appName: 'accademy-assist',
  webDir: 'dist',
  server: {
    url: 'https://043e5de6-0e75-40f4-bd46-c34c0ce43ff7.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    BarcodeScanner: {
      cameraDirection: 'back'
    }
  }
};

export default config;