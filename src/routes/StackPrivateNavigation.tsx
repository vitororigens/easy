import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Charts } from '../screens/Charts';
import { Home } from '../screens/Home';
import { Perfil } from '../screens/Perfil';
import { PiggyBank } from '../screens/PiggyBank';
import { BottomTabsNavigation } from './BottomTabsNavigation';

const { Navigator, Screen } = createNativeStackNavigator();

export function StackPrivateNavigation() {

    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen
                name='tabroutes'
                component={BottomTabsNavigation}
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
            <Screen
                name="historic"
                component={Home}
            />
        </Navigator>
    )
}
