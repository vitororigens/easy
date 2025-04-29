import { useEffect, useRef, useState } from "react";
import { DefaultContainer } from "../../components/DefaultContainer";
import { ItemNotification } from "../../components/ItemNotification";
import {
  getNotifications,
  INotification,
} from "../../services/firebase/notifications.firebase";
import { useUserAuth } from "../../hooks/useUserAuth";
import { FlatList, RefreshControl, View, Text } from "react-native";
import { Loading } from "../../components/Loading";
import theme from "../../theme";

export function Notifications() {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const flatListRef = useRef<FlatList | null>(null);
  const user = useUserAuth();

  const handleGetNotifications = async () => {
    if (!user?.uid) return;
    
    try {
      setIsLoading(true);
      const n = await getNotifications({
        profile: "receiver",
        uid: user.uid,
      });

      setNotifications(n);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetNotifications();
  }, [user]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await handleGetNotifications();
    setIsRefreshing(false);
  };

  if (isLoading) {
    return (
      <DefaultContainer title="Notificações" backButton>
        <Loading />
      </DefaultContainer>
    );
  }

  return (
    <DefaultContainer title="Notificações" backButton>
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
        ListEmptyComponent={() => (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <Text style={{ color: theme.COLORS.GRAY_400, textAlign: 'center' }}>
              Nenhuma notificação encontrada
            </Text>
          </View>
        )}
      />
    </DefaultContainer>
  );
}
