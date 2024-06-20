import { Entypo, FontAwesome } from '@expo/vector-icons';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from 'react';
import { useTheme } from "styled-components/native";
import LogoClipBoard from '../assets/Icones/icones_brokerx_cinza-18.svg';
import LogoHome from '../assets/Icones/icones_brokerx_cinza-19.svg';
import LogoCart from '../assets/Icones/icones_brokerx_cinza-25.svg';
import { Loading } from '../components/Loading';
import { Gears } from '../screens/Gears';
import { Marketplace } from '../screens/Marketplace';

import { Platform } from 'react-native';
import { Home } from '../screens/Home';
import { ListTask } from '../screens/ListTask';
import { Notes } from '../screens/Notes';

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
                        <LogoCart width={50} height={50} fill={color}/>
                    )
                }}
                name="Mercado"
                component={Marketplace}
            />
            <Screen
                options={{
                    tabBarIcon: ({ color }) => (
                        <LogoClipBoard width={50} height={50} fill={color}/>
                    )
                }}
                name="Tarefas"
                component={ListTask}
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
                        <FontAwesome name="sticky-note" size={40} color={color} />
                    )
                }}
                name="Notas"
                component={Notes}
            />
            <Screen
                options={{
                    tabBarIcon: ({ color }) => (
                        <Entypo name="menu" size={45} color={color} />
                    )
                }}
                name="Config"
                component={Gears}
            />
        </Navigator>
    )
}
