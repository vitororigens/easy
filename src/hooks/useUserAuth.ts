import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useEffect, useState } from 'react';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({id: "easy-finances"});

export function useUserAuth() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  
  useEffect(() => {
    // Recuperar dados do usuário do MMKV na inicialização
    const storedUser = storage.getString('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Subscrever às mudanças de autenticação do Firebase
    const subscriber = auth().onAuthStateChanged((user) => {
      if (user) {
        const userData = {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
        };
        // @ts-ignore
        setUser(userData);
        storage.set('user', JSON.stringify(userData));
      } else {
        setUser(null);
        storage.delete('user');
      }
    });

    // Retornar a função de limpeza da subscrição
    return subscriber;
  }, []);

  return user;
}
