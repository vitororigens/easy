import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home } from "../screens/Home";
import { useTheme } from "styled-components/native";
import { FontAwesome5 } from '@expo/vector-icons';
import { Charts } from '../screens/Charts';
import { Marketplace } from '../screens/Marketplace';
import { PiggyBank } from '../screens/PiggyBank';
import { Gears } from '../screens/Gears';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { Loading } from '../components/Loading';
import LogoHome from '../assets/Icones/icones_brokerx_cinza-19.svg';
import LogoPiggBank from '../assets/Icones/icones_brokerx_cinza-01.svg';
import LogoOpenCart from '../assets/Icones/icones_brokerx_cinza-25.svg';
import LogoLineChart from '../assets/Icones/icones_brokerx_cinza-07.svg';
import LogoGears from '../assets/Icones/icones_brokerx_cinza-32.svg';

import { Platform } from 'react-native';

const { Navigator, Screen } = createBottomTabNavigator();
const tabBarHeight = Platform.OS === 'ios' ? 80 : 60;

export function BottomTabsNavigation() {
    const { COLORS, FONTE_SIZE, FONT_FAMILY } = useTheme();
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(setUser);
        setTimeout(() => {
            setIsLoading(false); 
        }, 3000); 
        return subscriber;
    }, []);

    if (isLoading || user === null) {
        return <Loading />;
    }
    return (
        <Navigator
            initialRouteName="Home"
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    backgroundColor: COLORS.WHITE,
                    height: tabBarHeight,
                    borderTopWidth: 0,
                    borderTopRightRadius: 30,
                    borderTopLeftRadius: 30
                },
                tabBarLabelStyle: {
                    display: 'none'
                },
                tabBarActiveTintColor: COLORS.TEAL_600,
                
            }}
        >

            <Screen
                options={{
                    tabBarIcon: ({ color }) => (
                        <LogoLineChart width={50} height={50} fill={color}/>
                    )
                }}
                name="Gráficos"
                component={Charts}
            />
            <Screen
                options={{
                    tabBarIcon: ({ color }) => (
                        <FontAwesome5 name="clipboard-list" size={45} color={color} />
                    )
                }}
                name="Mercado"
                component={Marketplace}
            />
            <Screen
                options={{
                    tabBarIcon: ({ color }) => (
                        <LogoHome width={50} height={50} fill={color}/>
                    )

                }}
                name="Home"
                component={Home}

            />
            <Screen
                options={{
                    tabBarIcon: ({ color }) => (
                        <LogoPiggBank width={50} height={50} fill={color}/>
                    )
                }}
                name="Cofrinho"
                component={PiggyBank}
            />
            <Screen
                options={{
                    tabBarIcon: ({ color }) => (
                        <LogoGears width={50} height={50} fill={color} />
                    )
                }}
                name="Config"
                component={Gears}
            />
        </Navigator>
    )
}
