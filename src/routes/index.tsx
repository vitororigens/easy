import { NavigationContainer } from "@react-navigation/native";
import { StackNavigation } from "./StackNavigation";
//
import { useTheme } from "styled-components/native";
//
import { View } from "react-native";
import { useEffect, useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { BottomTabsNavigation } from "./BottomTabsNavigation";

export function Routes() {
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null)

    console.log(user)


    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(setUser)

        return subscriber
    }, [])

    const { COLORS } = useTheme();
    return (
        <View style={{
            backgroundColor: COLORS.WHITE,
            flex: 1
        }}>
            <NavigationContainer>
                {user ? <BottomTabsNavigation/> : <StackNavigation/>}
            </NavigationContainer>
        </View>

    )
}