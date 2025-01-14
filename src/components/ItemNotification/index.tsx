import { View } from "react-native";
import {
  Button,
  Container,
  Content,
  Icon,
  DateDetails,
  SubTitle,
  Title,
  PendingNotificationCircle,
} from "./styles";
import {
  acceptSharingNotification,
  createNotification,
  INotification,
} from "../../services/firebase/notifications.firebase";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useUserAuth } from "../../hooks/useUserAuth";
import { sendPushNotification } from "../../services/one-signal";

type ItemNotificationProps = {
  notification: INotification;
  handleRefresh: () => void;
};

export function ItemNotification({
  notification,
  handleRefresh,
}: ItemNotificationProps) {
  // const navigation = useNavigation();
  const user = useUserAuth();

  const handleNavigateToDetails = () => {
    console.log("notification", notification);
    if (notification.type === "sharing_invite") {
      if (notification.status !== "sharing_accepted") return;
      // TODO: add navigation to sharing details screen
      switch (notification.source.type) {
        case "expense":
          break;
        case "marketplace":
          break;
        case "note":
          break;
        case "revenue":
          break;
        case "task":
          break;
        default:
          break;
      }
    }

    if (notification.type !== "sharing_invite") {
      // TODO: add navigation to notification details screen
    }
  };

  const handleAcceptSharing = async () => {
    const message = `${user?.displayName} aceitou o compartilhamento.`;
    await Promise.allSettled([
      acceptSharingNotification(notification.id),
      createNotification({
        source: {
          id: notification.id,
          type: "notification",
        },
        description: message,
        receiver: notification.sender,
        sender: notification.receiver,
        title: "Compartilhamento aceito",
        type: "sharing_invite",
        status: "sharing_accepted",
      }),
      sendPushNotification({
        message: message,
        title: "Compartilhamento aceito",
        uid: notification.sender,
      }),
    ]);

    // TODO: After accept sharing, accept all notifications and entities (notes, expenses, revenues, tasks, kar) from the same source

    handleRefresh();
  };

  const handleRejectSharing = async () => {
    const message = `${user?.displayName} rejeitou o compartilhamento.`;
    await Promise.allSettled([
      createNotification({
        source: {
          id: notification.id,
          type: "notification",
        },
        description: message,
        receiver: notification.sender,
        sender: notification.receiver,
        title: "Compartilhamento rejeitado",
        type: "sharing_invite",
        status: "sharing_rejected",
      }),
      sendPushNotification({
        message: message,
        title: "Compartilhamento rejeitado",
        uid: notification.sender,
      }),
    ]);

    // TODO: After reject sharing, reject all notifications and entities (notes, expenses, revenues, tasks, kar) from the same source

    handleRefresh();
  };

  return (
    <Container onPress={handleNavigateToDetails}>
      <Title>{notification.title}</Title>
      <SubTitle>{notification.description}</SubTitle>
      <Content>
        <DateDetails>
          {format(notification.createdAt.toDate(), "dd MMM '*' HH:mm", {
            locale: ptBR,
          })}
        </DateDetails>
        {notification.type === "sharing_invite" && (
          <>
            {notification.status === "pending" && (
              <View style={{ flexDirection: "row" }}>
                <Button onPress={handleAcceptSharing}>
                  <SubTitle>Aprovar</SubTitle>
                  <Icon type="success" name="check" />
                </Button>
                <Button onPress={handleRejectSharing}>
                  <SubTitle>Reprovar</SubTitle>
                  <Icon type="danger" name="close" />
                </Button>
              </View>
            )}

            {notification.status === "sharing_accepted" && (
              <Button>
                <SubTitle>Aceito</SubTitle>
                <Icon type="success" name="check" />
              </Button>
            )}

            {notification.status === "sharing_rejected" && (
              <Button>
                <SubTitle>Rejeitado</SubTitle>
                <Icon type="danger" name="close" />
              </Button>
            )}
          </>
        )}
      </Content>

      {notification.type === "sharing_invite" &&
        notification.status === "pending" && <PendingNotificationCircle />}
    </Container>
  );
}
