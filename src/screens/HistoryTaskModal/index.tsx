import { useState } from "react";
import { FlatList } from "react-native";
import { Container } from "../../components/Container";
import { DefaultContainer } from "../../components/DefaultContainer";
import { ItemTask } from "../../components/ItemTask";
import useHistoryTasksCollections from "../../hooks/useHistoryTasksCollection";
import { ButtonClose, Title } from "./styles";

type Props = {
  closeBottomSheet?: () => void;
  onCloseModal?: () => void;
  showButtonEdit?: boolean;
  showButtonSave?: boolean;
  showButtonRemove?: boolean;
  selectedItemId?: string;
}

export function HistoryTaskModal({ closeBottomSheet, onCloseModal, showButtonEdit, showButtonSave, showButtonRemove, selectedItemId }: Props) {
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: boolean }>({});

  const historyData = useHistoryTasksCollections('HistoryTasks');
  const selectedListTask = historyData.find((item) => item.id === selectedItemId)
  const tasks = selectedListTask?.tasks


  return (
    <>
      <DefaultContainer>
      <ButtonClose onPress={closeBottomSheet} >
          <Title style={{ color: 'white' }}>Fechar</Title>
        </ButtonClose>
        <Container title={'Tarefas'}>
          <FlatList
              data={tasks}
              renderItem={({ item }) => (
                <ItemTask
                  title={item.name}
                  isChecked={true}
                  hasActions={false}
                />
              )}
              keyExtractor={item => item.id}
            />
        </Container>
      </DefaultContainer>
    </>
  );
}