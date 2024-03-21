import React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home } from "../screens/Home";
import { useTheme } from "styled-components/native";
import { FontAwesome, Entypo, FontAwesome5 } from '@expo/vector-icons';

const { Navigator, Screen } = createBottomTabNavigator();

export function BottomTabsNavigation() {
    const { COLORS, FONTE_SIZE, FONT_FAMILY } = useTheme();
    return (
        <Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    backgroundColor: COLORS.WHITE,
                    height: 80,
                    borderTopWidth: 0,
                    borderTopRightRadius: 40,
                    borderTopLeftRadius: 40
                },
                tabBarLabelStyle: {
                    fontSize: FONTE_SIZE.LG,
                    fontFamily: FONT_FAMILY.REGULAR,
                },
                tabBarActiveTintColor: COLORS.TEAL_600,

            }}
        >
           
            <Screen
                options={{
                    tabBarIcon: ({ color }) => (
                        <FontAwesome name="line-chart" color={color} size={35} />
                    )
                }}
                name="Gráficos"
                component={Home}
            />
            <Screen
                options={{
                    tabBarIcon: ({ color }) => (
                        <FontAwesome name="opencart" color={color} size={35} />
                    )
                }}
                name="Mercado"
                component={Home}
            />
             <Screen
                options={{
                    tabBarIcon: ({ color }) => (
                        <Entypo name="wallet" color={color} size={35} />
                    )

                }}
                name="home"
                component={Home}
            />
            <Screen
                options={{
                    tabBarIcon: ({ color }) => (
                        <FontAwesome5 name="piggy-bank" color={color} size={35} />
                    )
                }}
                name="Cofrinho"
                component={Home}
            />
            <Screen
                options={{
                    tabBarIcon: ({ color }) => (
                        <FontAwesome name="gear" color={color} size={35} />
                    )
                }}
                name="config"
                component={Home}
            />
        </Navigator>
    )
}
