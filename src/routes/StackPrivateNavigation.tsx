import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Filter } from "../components/Filter";
import { HistoryMarketplaceModal } from "../components/HistoryMarketplace";
import { HistoryTaskModal } from "../components/HistoryTaskModal";
import { Charts } from "../screens/Charts";
import { Home } from "../screens/Home";
import { MarketItem } from "../screens/MarketItem";
import { NewItemTask } from "../screens/NewItemTask";
import { NewLaunch } from "../screens/NewLaunch";
import { NewNotes } from "../screens/NewNotes";
import { NewTask } from "../screens/NewTask";
import { Perfil } from "../screens/Perfil";
import { PiggyBank } from "../screens/PiggyBank";
import { BottomTabsNavigation } from "./BottomTabsNavigation";
import { Notifications } from "../screens/Notifications";
import { Shared } from "../screens/Shared";
import { Subscriptions } from "../screens/Subscriptions";
import { NewSubscription } from "../screens/NewSubscription";
import { SubscriptionHistory } from "../screens/SubscriptionHistory";
import { CalendarScreen } from "../screens/Calendar";
import { NewEvent } from "../screens/NewEvent";
import { Notes } from "../screens/Notes";

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
      <Screen name="market-item" component={MarketItem} />
      <Screen name="market-history-item" component={HistoryMarketplaceModal} />
      <Screen name="filter" component={Filter} />
      <Screen name="notifications" component={Notifications} />
      <Screen name="shared" component={Shared} />
      <Screen name="subscriptions" component={Subscriptions} />
      <Screen name="new-subscription" component={NewSubscription} />
      <Screen name="subscription-history" component={SubscriptionHistory} />
      <Screen name="calendar" component={CalendarScreen} />
      <Screen name="newevent" component={NewEvent} />
      <Screen name="notes" component={Notes} />
    </Navigator>
  );
}
