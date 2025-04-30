import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useEffect, useState, useRef } from 'react';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({id: "easy-finances"});

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
    
    // Recuperar dados do usuário do MMKV na inicialização
    const storedUser = storage.getString('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
    
    // Subscrever às mudanças de autenticação do Firebase
    const subscriber = auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        const userData: UserData = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
        };
        setUser(userData);
        storage.set('user', JSON.stringify(userData));
      } else {
        setUser(null);
        storage.delete('user');
      }
    });

    return subscriber;
  }, []);

  return user;
}
