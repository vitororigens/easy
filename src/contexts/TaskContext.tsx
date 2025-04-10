import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { ITask } from "../interfaces/ITask";
import { useUserAuth } from "../hooks/useUserAuth";
import { Timestamp } from "@react-native-firebase/firestore";
import { database } from "../libs/firebase";

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

  // Carregar tarefas do Firebase
  useEffect(() => {
    if (!user?.uid) {
      console.log("Usuário não autenticado");
      return;
    }
    
    console.log("Iniciando carregamento de tarefas para o usuário:", user.uid);
    setLoading(true);
    
    const unsubscribe = database
      .collection("Tasks")
      .where("uid", "==", user.uid)
      .onSnapshot((snapshot) => {
        console.log("Snapshot recebido do Firebase");
        const taskData: ITask[] = [];
        snapshot.forEach((doc) => {
          console.log("Documento encontrado:", doc.id);
          taskData.push({ id: doc.id, ...doc.data() } as ITask);
        });
        console.log("Tarefas carregadas:", taskData);
        setTasks(taskData);
        setLoading(false);
      }, (error) => {
        console.error("Erro ao carregar tarefas:", error);
        setLoading(false);
      });

    return () => {
      console.log("Limpando listener de tarefas");
      unsubscribe();
    };
  }, [user?.uid]);

  const addTask = useCallback(async (task: Omit<ITask, "id" | "createdAt" | "updatedAt">) => {
    if (!user?.uid) return;
    
    setLoading(true);
    try {
      await database.collection("Tasks").add({
        ...task,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Erro ao adicionar task:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateTask = useCallback(async (id: string, task: Partial<ITask>) => {
    setLoading(true);
    try {
      await database.collection("Tasks").doc(id).update({
        ...task,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Erro ao atualizar task:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await database.collection("Tasks").doc(id).delete();
    } catch (error) {
      console.error("Erro ao deletar task:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleTaskCompletion = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const taskRef = database.collection("Tasks").doc(id);
      const doc = await taskRef.get();
      if (doc.exists) {
        const taskData = doc.data();
        await taskRef.update({
          status: !taskData?.status,
          updatedAt: Timestamp.now(),
        });
      }
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