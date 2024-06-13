import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabsNavigation } from './BottomTabsNavigation';
import { Charts } from '../screens/Charts';
import { PiggyBank } from '../screens/PiggyBank';
import { Perfil } from '../screens/Perfil';
import { Historic } from '../screens/Historic';

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
                component={Historic}
            />
        </Navigator>
    )
}
