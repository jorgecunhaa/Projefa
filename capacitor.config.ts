import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Configuração do Capacitor
 * 
 * Define as configurações da aplicação para plataformas nativas
 * incluindo Android e iOS.
 */
const config: CapacitorConfig = {
  appId: 'com.projefa.app',
  appName: 'Projefa',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#8B0000', // Cor Bordô
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      androidSpinnerColor: '#ffffff',
      spinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#ffffff',
      splashFullScreen: true,
      splashImmersive: true
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#8B0000',
      sound: 'beep.wav'
    }
  }
};

export default config;
