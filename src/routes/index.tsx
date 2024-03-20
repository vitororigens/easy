import { NavigationContainer } from "@react-navigation/native";
import { StackNavigation } from "./StackNavigation";
//
import { useTheme } from "styled-components/native";
//
import { View } from "react-native";

export function Routes() {
    const { COLORS } = useTheme();
    return (
        <View style={{
            backgroundColor: COLORS.WHITE,
            flex: 1
        }}>
            <NavigationContainer>
                <StackNavigation/>
            </NavigationContainer>
        </View>

    )
}