import { Timestamp } from "@react-native-firebase/firestore";

export interface INote {
  id: string;
  title: string;
  description: string;
  createdAt: Timestamp;
  isShared?: boolean;
  sharedWith?: string[];
} 