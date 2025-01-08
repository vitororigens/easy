import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { ToastProvider } from "react-native-toast-notifications";
import { ThemeProvider } from "styled-components";
import { StatusBar } from "react-native";
//
import { Loading } from "./src/components/Loading";
import { MonthProvider } from "./src/context/MonthProvider";
import { Routes } from "./src/routes";
import theme from "./src/theme";
import {
  OneSignal,
  LogLevel,
  NotificationClickEvent,
} from "react-native-onesignal";
import mobileAds from "react-native-google-mobile-ads";

import Constants from "expo-constants";
import { useEffect } from "react";

OneSignal.initialize(Constants!.expoConfig!.extra!.oneSignalAppId);
OneSignal.Notifications.requestPermission(true);
OneSignal.Debug.setLogLevel(LogLevel.Verbose);

export default function App() {
  const [fontLoader] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  mobileAds()
    .initialize()
    .then((adapterStatuses) => {
      console.log("Google ads Inicializado");
    });

  useEffect(() => {
    const handleNotificationClick = (e: NotificationClickEvent): void => {
      // TODO: Add Notification Clicked Event opening <Notification />
      console.log("Notification Clicked", e);
    };

    OneSignal.Notifications.addEventListener("click", handleNotificationClick);

    return () =>
      OneSignal.Notifications.removeEventListener(
        "click",
        handleNotificationClick
      );
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <MonthProvider>
        <ToastProvider>
          <StatusBar
            barStyle="light-content"
            backgroundColor="transparent"
            translucent
          />
          {fontLoader ? <Routes /> : <Loading />}
        </ToastProvider>
      </MonthProvider>
    </ThemeProvider>
  );
}
