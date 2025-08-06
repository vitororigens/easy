import { Timestamp } from '@react-native-firebase/firestore';

type TShareInfo = {
  acceptedAt: Timestamp | null;
  uid: string;
  userName: string;
};

export interface IMarket {
  id: string;
  name: string;
  quantity?: number;
  price?: number;
  category?: string;
  measurement?: string;
  observation?: string;
  uid: string;
  createdAt: Timestamp;
  shareWith: string[];
  shareInfo: TShareInfo[];
  status?: boolean;
  isOwner?: boolean;
  isShared?: boolean;
}
