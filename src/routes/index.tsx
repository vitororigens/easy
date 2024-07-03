import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { MMKV } from "react-native-mmkv";
import { useTheme } from "styled-components/native";
import { Loading } from "../components/Loading";
import { StackNavigation } from "./StackNavigation";
import { StackPrivateNavigation } from "./StackPrivateNavigation";

const storage = new MMKV({ id: "easy-finances" });

export function Routes() {
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
    const [loading, setLoading] = useState(true); // Estado de carregamento
    const { COLORS } = useTheme();

    useEffect(() => {
        // Recupera dados do usuário do MMKV na inicialização
        const storedUser = storage.getString('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const subscriber = auth().onAuthStateChanged(authUser => {
            if (authUser) {
                const userData = {
                    uid: authUser.uid,
                    name: authUser.displayName,
                    email: authUser.email,
                };
                // @ts-ignore
                setUser(userData);
                storage.set('user', JSON.stringify(userData));
            } else {
                setUser(null);
                storage.delete('user');
            }
            setLoading(false); // Finaliza o carregamento após a verificação
        });
        return subscriber;
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
