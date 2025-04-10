import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useEffect, useState } from 'react';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({id: "easy-finances"});

export function useUserAuth() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  console.log("useUserAuth hook chamado");
  
  useEffect(() => {
    console.log("useUserAuth useEffect iniciado");
    
    // Recuperar dados do usuário do MMKV na inicialização
    const storedUser = storage.getString('user');
    if (storedUser) {
      console.log("Usuário encontrado no MMKV:", JSON.parse(storedUser));
      setUser(JSON.parse(storedUser));
    } else {
      console.log("Nenhum usuário encontrado no MMKV");
    }
    
    // Subscrever às mudanças de autenticação do Firebase
    const subscriber = auth().onAuthStateChanged((user) => {
      console.log("onAuthStateChanged chamado com usuário:", user?.uid);
      
      if (user) {
        const userData = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
        };
        console.log("Dados do usuário formatados:", userData);
        // @ts-ignore
        setUser(userData);
        storage.set('user', JSON.stringify(userData));
      } else {
        console.log("Usuário não autenticado");
        setUser(null);
        storage.delete('user');
      }
    });

    // Retornar a função de limpeza da subscrição
    return subscriber;
  }, []);

  console.log("useUserAuth retornando:", user);
  return user;
}
