import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { ToastProvider } from 'react-native-toast-notifications';
import { ThemeProvider } from 'styled-components';
import { StatusBar } from 'react-native';
//
import { Loading } from './src/components/Loading';
import { MonthProvider } from './src/context/MonthProvider'
import { Routes } from './src/routes';
import theme from './src/theme';


export default function App() {
  const [fontLoader] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold
  });

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
