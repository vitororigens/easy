import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import React, { ReactNode, useEffect, useState } from "react";
import { Modal } from "react-native";
import RNPickerSelect from 'react-native-picker-select';
import { useMonth } from "../../context/MonthProvider";
import { NewItem } from "../../screens/NewItem";
import { NewItemTask } from "../../screens/NewItemTask";
import { NewLaunch } from "../../screens/NewLaunch";
import { NewNotes } from "../../screens/NewNotes";
import { NewTask } from "../../screens/NewTask";
import { Background, Button, Container, ContainerMonth, Header, Icon, Title } from "./style";

type DefaultContainerProps = {
    children: ReactNode;
    backButton?: boolean;
    monthButton?: boolean;
    addButton?: boolean;
    newItem?: boolean;
    newLaunch?: boolean;
    listButtom?: boolean;
    showHeader?: boolean;
    newItemMarketplace?: boolean;
    newNotes?: boolean;
    hasHeader?: boolean;
}

export function DefaultContainer({ children, newNotes = false, newItemMarketplace = false, showHeader = false, backButton = false, monthButton = false, addButton = false, newItem = false, newLaunch = false, listButtom = false, hasHeader = true }: DefaultContainerProps) {
    const navigation = useNavigation();
    const { selectedMonth, setSelectedMonth } = useMonth();
    const [showNewTaskModal, setShowNewTaskModal] = useState(false);
    const [showNewItemModal, setShowNewItemModal] = useState(false);
    const [showNotesModal, setShowNotesModal] = useState(false);
    const [showNewItemMarketplace, setShowNewItemMarketplace] = useState(false);
    const [showListModal, setShowListModal] = useState(false);
    const [showNewLaunchModal, setShowNewLaunchModal] = useState(false);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const months = [
        { id: 1, name: 'Janeiro' },
        { id: 2, name: 'Fevereiro' },
        { id: 3, name: 'Março' },
        { id: 4, name: 'Abril' },
        { id: 5, name: 'Maio' },
        { id: 6, name: 'Junho' },
        { id: 7, name: 'Julho' },
        { id: 8, name: 'Agosto' },
        { id: 9, name: 'Setembro' },
        { id: 10, name: 'Outubro' },
        { id: 11, name: 'Novembro' },
        { id: 12, name: 'Dezembro' }
    ];

    function closeModals() {
        setShowNewTaskModal(false);
        setShowNewItemModal(false);
        setShowNewLaunchModal(false);
        setShowNewItemMarketplace(false)
        setShowListModal(false);
        setShowNotesModal(false)
    }

    function handleGoBack() {
        navigation.goBack();
    }

    function handleNewTask() {
        setShowNewTaskModal(true);
    }

    function handleList() {
        navigation.navigate('historic')
    }


    function handleNewItem() {
        setShowNewItemModal(true);
    }

    function handleNewNotes() {
        setShowNotesModal(true);
    }


    function handleNewItemMarketplace() {
        setShowNewItemMarketplace(true);
    }

    function handleNewLaunch() {
        setShowNewLaunchModal(true);
    }
    useEffect(() => {
        const monthDate = currentDate.getMonth() + 1
        setSelectedMonth(monthDate);
    }, []);

    return (
        <Background>
            <Container>
                <Header
                style={{
                    justifyContent:backButton ? 'flex-start' : 'flex-end',
                    display: hasHeader ? "flex" : "none"
                }}
                >
                    {listButtom &&
                        <Button style={{
                            alignItems: 'center',
                            flexDirection: 'row',
                            height: 60,
                            width: '33%',
                           
                        }} onPress={handleList}>

                            <Icon name="list" />
                            <Title>
                                Histórico
                            </Title>
                        </Button>
                    }
                    {!listButtom && (
                        <Button style={{ height: 60 }} onPress={handleGoBack}>
                            {backButton ? (
                                <Icon name="chevron-back-outline" />
                            ) : (
                                <Button />
                            )}
                        </Button>
                    )}

                    {monthButton &&
                        <ContainerMonth style={{
                            height: 60,
                            justifyContent: backButton ? 'flex-start' : 'center',
                            width: '41%'
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
                            height: 60,
                            width: '25%',
                           
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
                            height: 60,
                            width: '25%',
                        }} onPress={handleNewItem}>
                            <Title>
                                Novo
                            </Title>
                            <Icon name="add" />
                        </Button>
                    )}
                    {newLaunch && (
                        <Button style={{
                            alignItems: 'center',
                            flexDirection: 'row',
                            height: 60,
                            width: '25%',
                        }} onPress={handleNewLaunch}>
                            <Title>
                                Novo
                            </Title>
                            <Icon name="add" />
                        </Button>
                    )}
                    {newItemMarketplace && (
                        <Button style={{
                            alignItems: 'center',
                            flexDirection: 'row',
                            height: 60,
                            width: '25%',
                        }} onPress={handleNewItemMarketplace}>
                            <Title>
                                Novo
                            </Title>
                            <Icon name="add" />
                        </Button>
                    )}
                    {newNotes && (
                        <Button style={{
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: backButton ? 'flex-start' : 'flex-end',
                            height: 60
                        }} onPress={handleNewNotes}>
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
                    <NewItemTask showButtonSave closeBottomSheet={closeModals}/>
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showNewLaunchModal}
                    onRequestClose={closeModals}
                >
                    <NewLaunch closeBottomSheet={closeModals} showButtonSave />
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showNewItemMarketplace}
                    onRequestClose={closeModals}
                >
                    <NewItem showButtonSave closeBottomSheet={closeModals}/>
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showNotesModal}
                    onRequestClose={closeModals}
                >
                    <NewNotes showButtonSave closeBottomSheet={closeModals}/>
                </Modal>
            </Container>
        </Background>
    );
}
