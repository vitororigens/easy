import { Entypo, FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "styled-components/native";
import LogoClipBoard from "../assets/Icones/icones_brokerx_cinza-18.svg";
import LogoHome from "../assets/Icones/icones_brokerx_cinza-19.svg";
import LogoCart from "../assets/Icones/icones_brokerx_cinza-25.svg";
import { Gears } from "../screens/Gears";
import { Marketplace } from "../screens/Marketplace";

import { Platform } from "react-native";
import { Home } from "../screens/Home";
import { ListTask } from "../screens/ListTask";
import { Notes } from "../screens/Notes";
import { LogoUser } from "../components/LogoUser";

const { Navigator, Screen } = createBottomTabNavigator();
const tabBarHeight = Platform.OS === "ios" ? 80 : 60;

export function BottomTabsNavigation() {
  const { COLORS } = useTheme();

  return (
    <Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: COLORS.WHITE,
          height: tabBarHeight,
          borderTopWidth: 0,
          borderTopRightRadius: 30,
          borderTopLeftRadius: 30,
        },
        tabBarLabelStyle: {
          display: "none",
        },
        tabBarActiveTintColor: COLORS.TEAL_600,
      }}
    >
      <Screen
        options={{
          tabBarIcon: ({ color }) => (
            <LogoCart width={50} height={50} fill={color} />
          ),
        }}
        name="Mercado"
        component={Marketplace}
      />
      <Screen
        options={{
          tabBarIcon: ({ color }) => (
            <LogoClipBoard width={50} height={50} fill={color} />
          ),
        }}
        name="Tarefas"
        component={ListTask}
      />
      <Screen
        options={{
          tabBarIcon: ({ color }) => (
            <LogoHome width={50} height={50} fill={color} />
          ),
        }}
        name="Home"
        component={Home}
      />
      <Screen
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="sticky-note" size={40} color={color} />
          ),
        }}
        name="Notas"
        component={Notes}
      />
      <Screen
        options={{
          tabBarIcon: ({ color }) => (
            <LogoUser  color={color} /> 
          ),
        }}
        name="Config"
        component={Gears}
      />
    </Navigator>
  );
}
