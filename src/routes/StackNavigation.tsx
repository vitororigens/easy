import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Login } from "../screens/Login";
import { ForgetPassword } from "../screens/ForgetPassword";
import { BottomTabsNavigation } from "./BottomTabsNavigation";

const { Navigator, Screen } = createNativeStackNavigator();

export function StackNavigation() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="login" component={Login} />
      <Screen name="forgetPassword" component={ForgetPassword} />
      <Screen name="tabroutes" component={BottomTabsNavigation} />
    </Navigator>
  );
}
