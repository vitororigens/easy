import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Filter } from "../components/Filter";
import { HistoryMarketplaceModal } from "../components/HistoryMarketplace";
import { HistoryTaskModal } from "../components/HistoryTaskModal";
import { Charts } from "../screens/Charts";
import { Home } from "../screens/Home";
import { NewItem } from "../screens/NewItem";
import { NewItemTask } from "../screens/NewItemTask";
import { NewLaunch } from "../screens/NewLaunch";
import { NewNotes } from "../screens/NewNotes";
import { NewTask } from "../screens/NewTask";
import { Perfil } from "../screens/Perfil";
import { PiggyBank } from "../screens/PiggyBank";
import { BottomTabsNavigation } from "./BottomTabsNavigation";
import { Expense } from "../components/Expense";
import { Revenue } from "../components/Revenue";
import { Notifications } from "../screens/Notifications";

const { Navigator, Screen } = createNativeStackNavigator();

export function StackPrivateNavigation() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="tabroutes" component={BottomTabsNavigation} />

      <Screen name="graphics" component={Charts} />
      <Screen name="piggybank" component={PiggyBank} />
      <Screen name="perfil" component={Perfil} />
      <Screen name="historic" component={Home} />
      <Screen name="newnotes" component={NewNotes} />
      <Screen name="newtask" component={NewTask} />
      <Screen name="historytask" component={HistoryTaskModal} />
      <Screen name="newlaunch" component={NewLaunch} />
      <Screen name="newitemtask" component={NewItemTask} />
      <Screen name="newitem" component={NewItem} />
      <Screen name="historymarketplace" component={HistoryMarketplaceModal} />
      <Screen name="filter" component={Filter} />
      <Screen name="newexpense" component={Expense} />
      <Screen name="newrevenue" component={Revenue} />
      <Screen name="notifications" component={Notifications} />
    </Navigator>
  );
}
