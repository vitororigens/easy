import { INote } from './INote';

export interface INoteContext {
  notes: INote[];
  addNote: (note: Omit<INote, 'id' | 'createdAt'>) => void;
  updateNote: (id: string, note: Partial<INote>) => void;
  deleteNote: (id: string) => void;
  shareNote: (id: string, email: string) => void;
  unshareNote: (id: string, email: string) => void;
} 