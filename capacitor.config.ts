import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.meliolabs.iftarready',
  appName: 'Iftar Ready',
  webDir: 'dist',
  ios: {
    scrollEnabled: true,
    bounce: true,
    allowsLinkPreview: false,
  },
};

export default config;
