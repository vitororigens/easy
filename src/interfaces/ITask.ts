import { Timestamp } from "firebase/firestore";

export interface ITask {
  id: string;
  uid: string;
  name: string;
  description: string;
  status: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  type: string;
  shareWith: string[];
  shareInfo: Array<{
    acceptedAt: Timestamp | null;
    uid: string;
    userName: string;
  }>;
} 