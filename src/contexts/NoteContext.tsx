import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { INote } from '../interfaces/INote';
import { INoteContext } from '../interfaces/INoteContext';

const NoteContext = createContext<INoteContext | undefined>(undefined);

export const NoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<INote[]>([]);

  const addNote = (note: Omit<INote, 'id' | 'createdAt'>) => {
    const newNote: INote = {
      ...note,
      id: uuidv4(),
      createdAt: new Date(),
      isShared: false,
      sharedWith: []
    };
    setNotes(prev => [...prev, newNote]);
  };

  const updateNote = (id: string, updatedNote: Partial<INote>) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, ...updatedNote } : note
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const shareNote = (id: string, email: string) => {
    setNotes(prev => prev.map(note => {
      if (note.id === id) {
        const sharedWith = note.sharedWith || [];
        if (!sharedWith.includes(email)) {
          return {
            ...note,
            isShared: true,
            sharedWith: [...sharedWith, email]
          };
        }
      }
      return note;
    }));
  };

  const unshareNote = (id: string, email: string) => {
    setNotes(prev => prev.map(note => {
      if (note.id === id) {
        const sharedWith = note.sharedWith?.filter(e => e !== email) || [];
        return {
          ...note,
          isShared: sharedWith.length > 0,
          sharedWith
        };
      }
      return note;
    }));
  };

  return (
    <NoteContext.Provider value={{ notes, addNote, updateNote, deleteNote, shareNote, unshareNote }}>
      {children}
    </NoteContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NoteContext);
  if (context === undefined) {
    throw new Error('useNotes deve ser usado dentro de um NoteProvider');
  }
  return context;
}; 