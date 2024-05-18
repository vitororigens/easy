import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Login } from '../screens/Login';
import { ForgetPassword } from '../screens/ForgetPassword';
import { BottomTabsNavigation } from './BottomTabsNavigation';
import { List } from '../screens/List';
import { Charts } from '../screens/Charts';
import { Marketplace } from '../screens/Marketplace';
import { PiggyBank } from '../screens/PiggyBank';
import { Perfil } from '../screens/Perfil';

const { Navigator, Screen } = createNativeStackNavigator();

export function StackPrivateNavigation() {

    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen
                name='tabroutes'
                component={BottomTabsNavigation}
            />
            <Screen
                name='list'
                component={List}
            />
            <Screen
                name="graphics"
                component={Charts}
            />
              <Screen
                name="piggybank"
                component={PiggyBank}
            />
             <Screen
                name="perfil"
                component={Perfil}
            />
        </Navigator>
    )
}
