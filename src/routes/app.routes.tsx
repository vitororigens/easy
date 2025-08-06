import { CalendarScreen } from '../screens/Calendar';
import { NewEvent } from '../screens/NewEvent';
import History from '../screens/History';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

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
