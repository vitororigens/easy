import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Login } from '../screens/Login';
import { ForgetPassword } from '../screens/ForgetPassword';
import { BottomTabsNavigation } from './BottomTabsNavigation';
import { List } from '../screens/List';

const { Navigator, Screen } = createNativeStackNavigator();

export function StackPrivateNavigation() {
    
    return (
        <Navigator screenOptions={{ headerShown: false}}>
            <Screen
                name='tabroutes'
                component={BottomTabsNavigation}
            />
            <Screen
                name='list'
                component={List}
            />
     
        </Navigator>
    )
}
