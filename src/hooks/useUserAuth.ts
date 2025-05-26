import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import type { FirebaseAuthTypes } from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_STORAGE_KEY = "@MyApp:usereasy";

export function useUserAuth() {
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadUserFromStorage = async () => {
            try {
                const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
                if (storedUser) {
                    setUser(JSON.parse(storedUser) as FirebaseAuthTypes.User);
                }
            } catch (error) {
                console.error("Erro ao carregar usuário do storage:", error);
            } finally {
                setLoading(false);
            }
        };

        const auth = getAuth();
        const subscriber = onAuthStateChanged(auth, async (authUser) => {
            try {
                if (authUser) {
                    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authUser));
                } else {
                    await AsyncStorage.removeItem(USER_STORAGE_KEY);
                }
                setUser(authUser);
            } catch (error) {
                console.error("Erro ao atualizar storage do usuário:", error);
            } finally {
                setLoading(false);
            }
        });

        loadUserFromStorage();

        return () => subscriber();
    }, []);

    return { user, loading };
}
