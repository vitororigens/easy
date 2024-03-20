import React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home } from "../screens/Home";
import { useTheme } from "styled-components/native";
import { FontAwesome } from '@expo/vector-icons';
import { Search } from '../screens/Search';
import { Favorite } from '../screens/Favorite';
import { Perfil } from '../screens/Perfil';

const { Navigator, Screen } = createBottomTabNavigator();

export function BottomTabsNavigation() {
    const { COLORS, FONTE_SIZE, FONT_FAMILY } = useTheme();
    return (
        <Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    backgroundColor: COLORS.GRAY_600,
                    height: 60,
                    borderTopWidth: 0
                },
                tabBarLabelStyle: {
                    fontSize: FONTE_SIZE.LG,
                    fontFamily: FONT_FAMILY.REGULAR,
                },
                tabBarActiveTintColor: COLORS.BLUE_400,

            }}
        >
            <Screen
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="home" color={color} size={size} />
                    )

                }}
                name="home"
                component={Home}
            />
            <Screen
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="search" color={color} size={size} />
                    )
                }}
                name="search"
                component={Search}
            />
            <Screen
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="heart" color={color} size={size} />
                    )
                }}
                name="Favorite"
                component={Favorite}
            />
            <Screen
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="user" color={color} size={size} />
                    )
                }}
                name="perfil"
                component={Perfil}
            />
        </Navigator>
    )
}
