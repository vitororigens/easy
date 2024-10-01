import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { ToastProvider } from 'react-native-toast-notifications';
import { ThemeProvider } from 'styled-components';
import { StatusBar } from 'react-native';
//
import { Loading } from './src/components/Loading';
import { MonthProvider } from './src/context/MonthProvider'
import { Routes } from './src/routes';
import theme from './src/theme';
import {OneSignal} from 'react-native-onesignal'
import mobileAds from 'react-native-google-mobile-ads';



OneSignal.initialize("04b5e397-b327-469b-a9f2-9ac8a22a039f")
OneSignal.Notifications.requestPermission(true)

export default function App() {
  const [fontLoader] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold
  });

  mobileAds()
  .initialize()
  .then(adapterStatuses => {
    console.log("Google ads Inicializado")
  })

  return (
    <ThemeProvider theme={theme}>
      <MonthProvider>
        <ToastProvider>
          <StatusBar
            barStyle='light-content'
            backgroundColor='transparent'
            translucent
          />
          {fontLoader ? <Routes /> : <Loading />}
        </ToastProvider>
      </MonthProvider>
    </ThemeProvider>
  );
}
