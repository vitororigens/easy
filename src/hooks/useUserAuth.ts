import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserData {
  uid: string;
  displayName: string | null;
  email: string | null;
}

export function useUserAuth() {
  const [user, setUser] = useState<UserData | null>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;
    
    // Recuperar dados do usuário do AsyncStorage na inicialização
    const loadStoredUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Error loading stored user:", error);
      }
    };

    loadStoredUser();
    
    // Subscrever às mudanças de autenticação do Firebase
    const subscriber = auth().onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userData: UserData = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
        };
        setUser(userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
      } else {
        setUser(null);
        await AsyncStorage.removeItem('user');
      }
    });

    return subscriber;
  }, []);

  return user;
}
