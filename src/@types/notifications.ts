import { Timestamp } from 'firebase/firestore';

export interface INotification {
  id?: string;
  sender: string;
  receiver: string;
  status: 'pending' | 'sharing_accepted';
  type: 'sharing_invite';
  source: {
    type: 'expense';
    id: string;
  };
  title: string;
  description: string;
  createdAt: Timestamp;
}
