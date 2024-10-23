import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'envios.expres',
  appName: 'envios-expres',
  webDir: 'www',
  plugins: {
    "FirebaseAuthentication": {
      "skipNativeAuth": false,
      "providers": []
    }
  }
};

export default config;
