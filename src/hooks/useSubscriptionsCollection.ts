import { useState, useEffect } from 'react';
import { Subscription, getSubscriptions } from '../services/firebase/subscription.firebase';
import { useUserAuth } from './useUserAuth';
import { User } from 'firebase/auth';

export const useSubscriptionsCollection = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUserAuth() as { user: User | null };

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (!user?.uid) return;

      try {
        setLoading(true);
        const data = await getSubscriptions(user.uid);
        setSubscriptions(data);
      } catch (err) {
        setError('Erro ao carregar assinaturas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [user?.uid]);

  return { subscriptions, loading, error };
};
