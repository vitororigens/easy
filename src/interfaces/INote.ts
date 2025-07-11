import { Timestamp } from "@react-native-firebase/firestore";

export interface INote {
  uid: string;
  id: string;
  title: string;
  name?: string;
  description: string;
  createdAt: Timestamp;
  isShared?: boolean;
  sharedWith?: string[];
} 