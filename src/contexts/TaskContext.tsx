import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { ITask } from "../interfaces/ITask";
import { useUserAuth } from "../hooks/useUserAuth";
import { Timestamp, getFirestore, arrayRemove } from "@react-native-firebase/firestore";
import { Toast } from "react-native-toast-notifications";

interface ITaskContext {
  tasks: ITask[];
  loading: boolean;
  addTask: (task: Omit<ITask, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateTask: (id: string, task: Partial<ITask>) => Promise<void>;
  deleteTask: (id: string, task?: ITask) => Promise<void>;
  toggleTaskCompletion: (id: string) => Promise<void>;
}

const TaskContext = createContext<ITaskContext>({} as ITaskContext);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(false);
  const user = useUserAuth();
  const db = getFirestore();
  // Carregar tarefas do Firebase
  useEffect(() => {
    if (!user.user?.uid) {
      console.log("Usuário não autenticado");
      return;
    }
    
    console.log("Iniciando carregamento de tarefas para o usuário:", user.user?.uid);
    setLoading(true);
    
    // Lista para armazenar todas as tarefas
    let allTasks: ITask[] = [];
    
    // 1. Listener para tarefas criadas pelo usuário
    const userTasksUnsubscribe = db
      .collection("Tasks")
      .where("uid", "==", user.user?.uid)
      .onSnapshot((snapshot) => {
        console.log("Snapshot de tarefas do usuário recebido");
        const userTasks: ITask[] = [];
        snapshot.forEach((doc: any) => {
          userTasks.push({ id: doc.id, ...doc.data() } as ITask);
        });
        console.log("Tarefas do usuário carregadas:", userTasks.length);
        
        // Atualiza a lista combinada
        allTasks = [...userTasks, ...allTasks.filter(task => task.uid !== user.user?.uid)];
        setTasks(allTasks);
        setLoading(false);
      }, (error: any) => {
        console.error("Erro ao carregar tarefas do usuário:", error);
        setLoading(false);
      });
    
    // 2. Listener para tarefas compartilhadas com o usuário
    const sharedTasksUnsubscribe = db
      .collection("Tasks")
      .where("shareWith", "array-contains", user.user?.uid)
      .onSnapshot((snapshot) => {
        console.log("Snapshot de tarefas compartilhadas recebido");
        const sharedTasksData: ITask[] = [];
        snapshot.forEach((doc: any) => {
          const taskData = doc.data() as ITask;
          const taskWithId = { ...taskData, id: doc.id } as ITask;
          
          // Verificar se o usuário tem uma entrada em shareInfo e se foi aceita
          const userShareInfo = taskData.shareInfo?.find(info => info.uid === user.user?.uid);
          if (userShareInfo && userShareInfo.acceptedAt !== null) {
            console.log("Tarefa compartilhada aceita encontrada:", doc.id);
            sharedTasksData.push(taskWithId);
          }
        });
        console.log("Tarefas compartilhadas carregadas:", sharedTasksData.length);
        
        // Atualiza a lista combinada
        allTasks = [
          ...allTasks.filter(
            task =>
              !(
                typeof user.user?.uid === "string" &&
                task.shareWith?.includes(user.user.uid)
              )
          ),
          ...sharedTasksData
        ];
        setTasks(allTasks);
      }, (error: any) => {
        console.error("Erro ao carregar tarefas compartilhadas:", error);
      });

    return () => {
      console.log("Limpando listeners de tarefas");
      userTasksUnsubscribe();
      sharedTasksUnsubscribe();
    };
  }, [user?.user?.uid]);

  const addTask = useCallback(async (task: Omit<ITask, "id" | "createdAt" | "updatedAt">) => {
    if (!user?.user?.uid) return;
    
    setLoading(true);
    try {
      await db.collection("Tasks").add({
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
      await db.collection("Tasks").doc(id).update({
        ...task,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Erro ao atualizar task:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (id: string, task?: ITask) => {
    setLoading(true);
    try {
      // Se o item for compartilhado com você (não é seu), remova seu UID do array shareWith no Firestore
      if (task && task.uid !== user.user?.uid) {
        await db
          .collection("Tasks")
          .doc(id)
          .update({
            shareWith: arrayRemove(user.user?.uid),
          });
        Toast.show("Item removido da sua lista!", { type: "success" });
      } else {
        // Se for seu, delete do banco normalmente
          await db.collection("Tasks").doc(id).delete();
        Toast.show("Tarefa excluída!", { type: "success" });
      }
    } catch (error) {
      console.error("Erro ao deletar task:", error);
      Toast.show("Erro ao excluir a tarefa", { type: "error" });
    } finally {
      setLoading(false);
    }
  }, [user.user?.uid]);

  const toggleTaskCompletion = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const taskRef = db.collection("Tasks").doc(id);
      const doc = await taskRef.get();
      if (doc.exists()) {
        const taskData = doc.data();
        await taskRef.update({
          status: !taskData?.['status'],
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

export const useTask = () => useContext(TaskContext);