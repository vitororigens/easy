import { useEffect } from 'react';
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  setDoc,
} from '@react-native-firebase/firestore';
import useSendNotifications from './useSendNotifications';
import { useUserAuth } from './useUserAuth';

export function useUpdateSubscriberIds() {
  const { user } = useUserAuth();
  const { subscriptionId, playerId } = useSendNotifications();
  const uid = user?.uid;

  useEffect(() => {
    const updateSubscriberId = async () => {
      if (!uid || !subscriptionId || !playerId) return;

      try {
        const db = getFirestore();
        const userRef = doc(db, 'User', uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          // Se o documento não existe, cria um novo com os dados iniciais
          await setDoc(userRef, {
            subscribers: [subscriptionId],
            playerIds: [playerId],
            createdAt: new Date(),
          });
          console.log('Documento do usuário criado com sucesso');
          return;
        }

        const data = userSnap.data();
        const subscriptionIds = data?.['subscribers'] || [];
        const isAllSubscriptionIds = subscriptionIds.includes(subscriptionId);
        const updatedSubscriptionIds = isAllSubscriptionIds
          ? subscriptionIds
          : [...subscriptionIds, subscriptionId];

        const playerIds = data?.['playerIds'] || [];
        const isAllPlayerIds = playerIds.includes(playerId);
        const updatedPlayerIds = isAllPlayerIds
          ? playerIds
          : [...playerIds, playerId];

        await updateDoc(userRef, {
          subscribers: updatedSubscriptionIds,
          playerIds: updatedPlayerIds,
        });
      } catch (error) {
        console.error('Erro ao atualizar subscribers e playerIds:', error);
      }
    };

    updateSubscriberId();
  }, [uid, subscriptionId, playerId]);

  return { subscriptionId, playerId };
}
