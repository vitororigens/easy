export interface ICalendar {
  id: string;
  name: string;
  description: string;
  date: string;
  createdAt: Date;
  userId: string;
  isShared?: boolean;
  sharedWith?: string[];
}
