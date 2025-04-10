export interface INote {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  isShared?: boolean;
  sharedWith?: string[];
} 