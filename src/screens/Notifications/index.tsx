import { useEffect, useRef, useState } from "react";
import { DefaultContainer } from "../../components/DefaultContainer";
import { ItemNotification } from "../../components/ItemNotification";
import {
  getNotifications,
  INotification,
} from "../../services/firebase/notifications.firebase";
import { useUserAuth } from "../../hooks/useUserAuth";
import { FlatList, RefreshControl } from "react-native";
import { Loading } from "../../components/Loading";

export function Notifications() {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const flatListRef = useRef<FlatList | null>(null);
  const user = useUserAuth();

  const handleGetNotifications = async () => {
    try {
      const n = await getNotifications({
        profile: "receiver",
        uid: user?.uid as string,
      });

      setNotifications(n);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!user) return;
    handleGetNotifications();
  }, [user]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await handleGetNotifications();
    setIsRefreshing(false);
  };

  return (
    <DefaultContainer title="Notificações" backButton>
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ItemNotification
              notification={item}
              handleRefresh={handleRefresh}
            />
          )}
          ref={flatListRef}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          }
        />
      )}
    </DefaultContainer>
  );
}
