import { createStackNavigator } from "@react-navigation/stack";
import { CalendarScreen } from "../screens/Calendar";
import { NewEvent } from "../screens/NewEvent";
import History from '../screens/History';

const Stack = createStackNavigator();

export function AppRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="calendar"
        component={CalendarScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="newevent"
        component={NewEvent}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="history"
        component={History}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
} 