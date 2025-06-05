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
import { TaskProvider } from "./src/contexts/TaskContext";
import { MarketProvider } from "./src/contexts/MarketContext";
import { Routes } from "./src/routes";
import theme from "./src/theme";
import {
  OneSignal,
  LogLevel,
  NotificationClickEvent,
} from "react-native-onesignal";
import mobileAds from "react-native-google-mobile-ads";
import * as Updates from 'expo-updates';

import Constants from "expo-constants";
import { useEffect } from "react";

OneSignal.Debug.setLogLevel(LogLevel.Verbose);

OneSignal.initialize("76ebaeee-ec3c-437e-b2a0-d6512f50e690");
OneSignal.Notifications.requestPermission(true);
OneSignal.Notifications.addEventListener;

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
    // Check for updates
    async function checkForUpdates() {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (error) {
        console.log('Error checking for updates:', error);
      }
    }

    checkForUpdates();
  }
    , []);
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

  // useEffect(() => {
  //   const onReceived = (notification: any) => {
  //     console.log("Notificação recebida:", notification);
  //     displayPopup(notification);
  //   };
  //   OneSignal.Notifications.addEventListener(
  //     "foregroundWillDisplay",
  //     onReceived
  //   );

  //   return () => {
  //     OneSignal.Notifications.removeEventListener(
  //       "foregroundWillDisplay",
  //       onReceived
  //     );
  //   };
  // }, []);

  // const displayPopup = (notification: any) => {
  //   alert(`Você recebeu uma notificação: ${notification.body}`);
  // };

  return (
    <ThemeProvider theme={theme}>
      <MonthProvider>
        <TaskProvider>
          <MarketProvider>
            <ToastProvider>
              <StatusBar
                barStyle="light-content"
                backgroundColor="transparent"
                translucent
              />
              {fontLoader ? <Routes /> : <Loading />}
            </ToastProvider>
          </MarketProvider>
        </TaskProvider>
      </MonthProvider>
    </ThemeProvider>
  );
}
