import { useRoute } from "@react-navigation/native";
import { FlatList, View } from "react-native";
import useHistoryTasksCollections from "../../hooks/useHistoryTasksCollection";
import { DefaultContainer } from "../DefaultContainer";
import { ItemTask } from "../ItemTask";
import { Content } from "./styles";

export function HistoryTaskModal() {
  const route = useRoute();

  const { selectedItemId } = route.params as { selectedItemId?: string };

  const historyData = useHistoryTasksCollections("HistoryTasks");
  const selectedListTask = historyData.find(
    (item) => item.id === selectedItemId
  );

  const tasks = selectedListTask?.tasks;

  return (
    <>
      <DefaultContainer hasHeader={false} title="Tarefas" backButton>
        <Content>
          <FlatList
            data={tasks}
            renderItem={({ item }) => (
              <ItemTask title={item.name} isChecked={true} hasActions={false} />
            )}
            keyExtractor={(item) => item.id}
            ListFooterComponent={<View style={{ height: 90 }} />}
          />
        </Content>
      </DefaultContainer>
    </>
  );
}
