import React, { createContext, useContext, useState, useCallback } from "react";
import { ITask } from "../interfaces/ITask";
import { useUserAuth } from "../hooks/useUserAuth";
import { Timestamp } from "firebase/firestore";

interface ITaskContext {
  tasks: ITask[];
  loading: boolean;
  addTask: (task: Omit<ITask, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateTask: (id: string, task: Partial<ITask>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskCompletion: (id: string) => Promise<void>;
}

const TaskContext = createContext<ITaskContext>({} as ITaskContext);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(false);
  const user = useUserAuth();

  const addTask = useCallback(async (task: Omit<ITask, "id" | "createdAt" | "updatedAt">) => {
    if (!user?.uid) return;
    
    setLoading(true);
    try {
      // Implementar lógica de adicionar task
      const newTask: ITask = {
        ...task,
        id: "temp-id",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      
      setTasks(prev => [...prev, newTask]);
    } catch (error) {
      console.error("Erro ao adicionar task:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateTask = useCallback(async (id: string, task: Partial<ITask>) => {
    setLoading(true);
    try {
      // Implementar lógica de atualizar task
      setTasks(prev => prev.map(t => t.id === id ? { ...t, ...task, updatedAt: Timestamp.now() } : t));
    } catch (error) {
      console.error("Erro ao atualizar task:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    setLoading(true);
    try {
      // Implementar lógica de deletar task
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error("Erro ao deletar task:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleTaskCompletion = useCallback(async (id: string) => {
    setLoading(true);
    try {
      // Implementar lógica de toggle completion
      setTasks(prev => prev.map(t => 
        t.id === id ? { ...t, status: !t.status, updatedAt: Timestamp.now() } : t
      ));
    } catch (error) {
      console.error("Erro ao alternar status da task:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <TaskContext.Provider value={{
      tasks,
      loading,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskCompletion,
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTask() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
} 