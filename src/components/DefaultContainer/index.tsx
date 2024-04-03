import React, { ReactNode, useState } from "react";
import { Icon, Background, Button, Container, ContainerMonth, Header, Title } from "./style";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from '@expo/vector-icons';
import { Modal } from "react-native";
import { NewTask } from "../../screens/NewTask";
import { NewItem } from "../../screens/NewItem";

type DefaultContainerProps = {
    children: ReactNode;
    backButton?: boolean;
    monthButton?: boolean;
    addButton?: boolean;
    newItem?: boolean;
}

export function DefaultContainer({ children, backButton = false, monthButton = false, addButton = false, newItem = false }: DefaultContainerProps) {
    const navigation = useNavigation();
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
    const [showNewTaskModal, setShowNewTaskModal] = useState(false);
    const [showNewItemModal, setShowNewItemModal] = useState(false);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const months = [
        { id: 0, name: 'Janeiro' },
        { id: 1, name: 'Fevereiro' },
        { id: 2, name: 'Março' },
        { id: 3, name: 'Abril' },
        { id: 4, name: 'Maio' },
        { id: 5, name: 'Junho' },
        { id: 6, name: 'Julho' },
        { id: 7, name: 'Agosto' },
        { id: 8, name: 'Setembro' },
        { id: 9, name: 'Outubro' },
        { id: 10, name: 'Novembro' },
        { id: 11, name: 'Dezembro' }
    ];

    function closeModals() {
        setShowNewTaskModal(false);
        setShowNewItemModal(false);
    }

    function handleGoBack() {
        navigation.goBack();
    }

    function handleNewTask() {
        setShowNewTaskModal(true);
    }

    function handleNewItem() {
        setShowNewItemModal(true);
    }

    return (
        <Background>
            <Container>
                <Header>
                    {backButton ? (
                        <Button style={{
                            height: 60
                        }} onPress={handleGoBack}>
                            <Icon name="chevron-back-outline" />
                        </Button>
                    ) : (
                        <Button />
                    )}
                    {monthButton &&
                        <ContainerMonth style={{
                            height: 60,
                            justifyContent: backButton ? 'flex-start' : 'center'
                        }}>
                            <RNPickerSelect
                                onValueChange={(value) => setSelectedMonth(value)}
                                items={months.map(month => ({ label: month.name, value: month.id }))}
                                value={selectedMonth}
                                placeholder={{ label: `${months[currentMonth].name}`, value: null }}
                                style={{
                                    inputIOS: {
                                        fontSize: 16,
                                        paddingVertical: 12,
                                        paddingHorizontal: 10,
                                        borderWidth: 1,
                                        borderColor: 'gray',
                                        borderRadius: 4,
                                        color: 'white',
                                        paddingRight: 30,
                                    },
                                    inputAndroid: {
                                        fontSize: 16,
                                        paddingHorizontal: 10,
                                        paddingVertical: 8,
                                        borderWidth: 0.5,
                                        borderColor: 'gray',
                                        borderRadius: 8,
                                        color: 'white',
                                        paddingRight: 30,
                                    },
                                    iconContainer: {
                                        top: 15,
                                        right: 9,
                                    },
                                }}
                                Icon={() => {
                                    return <Ionicons name="chevron-down" size={24} color="white" />;
                                }}
                            />
                        </ContainerMonth>
                    }
                    {addButton && (
                        <Button style={{
                            alignItems: 'center',
                            flexDirection: 'row',
                            height: 60
                        }} onPress={handleNewTask}>
                            <Title>
                                Novo
                            </Title>
                            <Icon name="add" />
                        </Button>
                    )}

                    {newItem && (
                        <Button style={{
                            alignItems: 'center',
                            flexDirection: 'row',
                            height: 60
                        }} onPress={handleNewItem}>
                            <Title>
                                Novo
                            </Title>
                            <Icon name="add" />
                        </Button>
                    )}
                </Header>
                {children}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showNewTaskModal}
                    onRequestClose={closeModals}
                >
                    <NewTask closeBottomSheet={closeModals} />
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showNewItemModal}
                    onRequestClose={closeModals}
                >
                    <NewItem closeBottomSheet={closeModals} />
                </Modal>
            </Container>
        </Background>
    );
}
