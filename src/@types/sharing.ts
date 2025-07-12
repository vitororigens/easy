import { Timestamp } from "@react-native-firebase/firestore";
import { ESharingStatus } from "../services/firebase/sharing.firebase";

export interface ISharing {
  id?: string;
  invitedBy: string;
  target: string;
  status: ESharingStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
} 