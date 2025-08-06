import { useState, useEffect } from 'react';
import { getFirestore } from '@react-native-firebase/firestore';

export interface FinanceData {
  uid: string;
  revenue: number;
  expense: number;
}

export function useFinanceData(uid: string): FinanceData | null {
  const [financeData, setFinanceData] = useState<FinanceData | null>(null);
  const db = getFirestore();
  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        const financeDoc = await db.collection('Tasks').doc(uid).get();
        if (financeDoc.exists()) {
          const data = financeDoc.data();
          if (data) {
            const financeData: FinanceData = {
              uid,
              revenue: parseFloat(data['revenue']),
              expense: parseFloat(data['Exepnse']),
            };
            setFinanceData(financeData);
          } else {
            console.log('No finance data found for user with uid:', uid);
          }
        } else {
          console.log('No finance data found for user with uid:', uid);
        }
      } catch (error) {
        console.error('Error fetching finance data:', error);
      }
    };

    if (uid) {
      fetchFinanceData();
    }

    return () => {};
  }, [uid]);

  return financeData;
}
