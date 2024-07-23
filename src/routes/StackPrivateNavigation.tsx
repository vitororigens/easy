import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Charts } from '../screens/Charts';
import { Home } from '../screens/Home';
import { Perfil } from '../screens/Perfil';
import { PiggyBank } from '../screens/PiggyBank';
import { BottomTabsNavigation } from './BottomTabsNavigation';
import { NewNotes } from '../screens/NewNotes';
import { NewTask } from '../screens/NewTask';
import { NewLaunch } from '../screens/NewLaunch';
import { NewItemTask } from '../screens/NewItemTask';
import { NewItem } from '../screens/NewItem';

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
             <Screen
                name="newnotes"
                component={NewNotes}
            />
             <Screen
                name="newtask"
                component={NewTask}
            />
             <Screen
                name="newlaunch"
                component={NewLaunch}
            />
             <Screen
                name="newitemtask"
                component={NewItemTask}
            />
             <Screen
                name="newitem"
                component={NewItem}
            />
        </Navigator>
    )
}
