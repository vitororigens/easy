import { ICalendar } from './ICalendar';

export interface ICalendarContext {
  events: ICalendar[];
  addEvent: (event: Omit<ICalendar, 'id' | 'createdAt'>) => void;
  updateEvent: (id: string, event: Partial<ICalendar>) => void;
  deleteEvent: (id: string) => void;
  shareEvent: (id: string, email: string) => void;
  unshareEvent: (id: string, email: string) => void;
}
