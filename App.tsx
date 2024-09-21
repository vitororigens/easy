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



OneSignal.initialize("029e1bac-8243-4b3d-9cb0-200f31cb91da")
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
