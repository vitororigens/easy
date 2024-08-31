import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { ToastProvider } from 'react-native-toast-notifications';
import { ThemeProvider } from 'styled-components';
import { StatusBar } from 'react-native';
//
import { Loading } from './src/components/Loading';
import { FiltersProvider } from './src/context/FiltersContext'
import { Routes } from './src/routes';
import theme from './src/theme';


export default function App() {
  const [fontLoader] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold
  });

  return (
    <ThemeProvider theme={theme}>
      <FiltersProvider>
        <ToastProvider>
          <StatusBar
            barStyle='light-content'
            backgroundColor='transparent'
            translucent
          />
          {fontLoader ? <Routes /> : <Loading />}
        </ToastProvider>
      </FiltersProvider>
    </ThemeProvider>
  );
}
