import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from 'styled-components/native';
import { Loading } from '../components/Loading';
import { StackNavigation } from './StackNavigation';
import { StackPrivateNavigation } from './StackPrivateNavigation';
import {
  NotificationWillDisplayEvent,
  OneSignal,
} from 'react-native-onesignal';

export function Routes() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { COLORS } = useTheme();
  const auth = getAuth();

  console.log(user);

  useEffect(() => {
    const loadStoredUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error loading stored user:', error);
      }
    };

    loadStoredUser();

    const subscriber = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        const userData = {
          uid: authUser.uid,
          name: authUser.displayName,
          email: authUser.email,
        };
        setUser(userData);
        AsyncStorage.setItem('user', JSON.stringify(userData));
      } else {
        setUser(null);
        AsyncStorage.removeItem('user');
      }
      setLoading(false);
    });
    return subscriber;
  }, []);

  useEffect(() => {
    const handleNotification = (e: NotificationWillDisplayEvent): void => {
      e.preventDefault();
      const res = e.getNotification();
      console.log(res);
    };

    OneSignal.Notifications.addEventListener(
      'foregroundWillDisplay',
      handleNotification,
    );

    return () =>
      OneSignal.Notifications.removeEventListener(
        'foregroundWillDisplay',
        handleNotification,
      );
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={{ backgroundColor: COLORS.WHITE, flex: 1 }}>
      <NavigationContainer>
        {user ? <StackPrivateNavigation /> : <StackNavigation />}
      </NavigationContainer>
    </View>
  );
}
