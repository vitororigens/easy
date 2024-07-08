import { useState } from "react";
import { FlatList } from "react-native";
import useHistoryTasksCollections from "../../hooks/useHistoryTasksCollection";
import { DefaultContainer } from "../DefaultContainer";
import { ItemTask } from "../ItemTask";
import { Content } from "./styles";

type Props = {
  closeBottomSheet?: () => void;
  onCloseModal?: () => void;
  showButtonEdit?: boolean;
  showButtonSave?: boolean;
  showButtonRemove?: boolean;
  selectedItemId?: string;
};

export function HistoryTaskModal({
  closeBottomSheet,
  onCloseModal,
  showButtonEdit,
  showButtonSave,
  showButtonRemove,
  selectedItemId,
}: Props) {
  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: boolean;
  }>({});

  const historyData = useHistoryTasksCollections("HistoryTasks");
  const selectedListTask = historyData.find(
    (item) => item.id === selectedItemId
  );
  const tasks = selectedListTask?.tasks;

  return (
    <>
      <DefaultContainer
        hasHeader={false}
        title="Tarefas"
        closeModalFn={closeBottomSheet}
      >
        <Content>
          <FlatList
            data={tasks}
            renderItem={({ item }) => (
              <ItemTask title={item.name} isChecked={true} hasActions={false} />
            )}
            keyExtractor={(item) => item.id}
          />
        </Content>
      </DefaultContainer>
    </>
  );
}
