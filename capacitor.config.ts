import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.meliodeveloper.iftarready',
  appName: 'Iftar Ready',
  webDir: 'dist',
  ios: {
    scrollEnabled: true,
    bounce: true,
  },
};

export default config;
