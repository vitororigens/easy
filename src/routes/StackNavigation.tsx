import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Login } from '../screens/Login';
import { Home } from '../screens/Home';
import { ForgetPassword } from '../screens/ForgetPassword';

const { Navigator, Screen } = createNativeStackNavigator();

export function StackNavigation() {
    
    return (
        <Navigator screenOptions={{ headerShown: false}}>
            <Screen
                name='login'
                component={Login}
            />
             <Screen
                name='forgetPassword'
                component={ForgetPassword}
            />
              <Screen
                name='home'
                component={Home}
            />
        </Navigator>
    )
}
