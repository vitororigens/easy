import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View, Image } from "react-native";
import { Calendar as RNCalendar } from "react-native-calendars";
import { useTheme } from "styled-components/native";
import { DefaultContainer } from "../../components/DefaultContainer";
import { EventItem } from "../../components/EventItem";
import { useUserAuth } from "../../hooks/useUserAuth";
import {
  OneSignal
} from "react-native-onesignal";


import { format } from "date-fns";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {
  Container,
  Content,
  ContentTitle,
  DividerContent,
  Icon,
  SubTitle,
  Title,
  HeaderContainer,
  SectionIcon,
  EmptyContainer,
} from "./styles";
import { ICalendarEvent, listEvents, listSharedEvents, deleteCalendarEvent } from "../../services/firebase/calendar.firebase";
import { ICalendar } from "../../interfaces/ICalendar";
import { Toast } from "react-native-toast-notifications";

export function CalendarScreen() {
  const navigation = useNavigation();
  const { COLORS } = useTheme();
  const user = useUserAuth();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [events, setEvents] = useState<ICalendarEvent[]>([]);
  const [sharedEvents, setSharedEvents] = useState<ICalendarEvent[]>([]);
  const [showPersonalEvents, setShowPersonalEvents] = useState(true);
  const [showSharedEvents, setShowSharedEvents] = useState(false);

  useEffect(() => {
    if (user) {
      OneSignal.initialize("76ebaeee-ec3c-437e-b2a0-d6512f50e690");
      OneSignal.Notifications.requestPermission(true);
      fetchEvents();
    }
  }, [user]);

  async function fetchEvents() {
    if (!user) return;

    try {
      const userEvents = await listEvents(user.user?.uid || "");
      const userSharedEvents = await listSharedEvents(user.user?.uid || "");
      setEvents(userEvents);
      setSharedEvents(userSharedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }

  async function handleDeleteEvent(event: ICalendarEvent) {
    try {
      // Verificar se o usuário pode excluir este evento
      const isCreator = event.userId === user.user?.uid;
      const canDelete = isCreator || event.sharedWith?.includes(user.user?.uid || "");

      if (!canDelete) {
        Toast.show("Você não pode excluir eventos compartilhados por outros usuários", { type: "warning" });
        return;
      }

      await deleteCalendarEvent(event.id, user.user?.uid || "");
      
      // Atualizar a lista de eventos após a exclusão
      await fetchEvents();
      
      Toast.show("Evento excluído!", { type: "success" });
    } catch (error) {
      console.error("Erro ao excluir evento:", error);
      Toast.show("Erro ao excluir evento", { type: "error" });
    }
  }

  function handleEditEvent(event: ICalendarEvent) {
    navigation.navigate("newevent", {
      selectedItemId: event.id,
      isCreator: event.userId === user.user?.uid,
    });
  }

  function handleShareEvent(event: ICalendarEvent) {
    // Implement share functionality
  }

  function handleNewEvent() {
    navigation.navigate("newevent", {
      selectedItemId: "",
      isCreator: true,
    });
  }

  const markedDates: {
    [date: string]: {
      selected?: boolean;
      selectedColor?: string;
      dots?: { color: string }[];
    };
  } = {
    [selectedDate]: {
      selected: true,
      selectedColor: COLORS.PURPLE_800,
    },
  };

  // Add dots for days with events
  events.forEach((event) => {
    if (markedDates[event.date]) {
      markedDates[event.date].dots = [
        { color: COLORS.PURPLE_800 }
      ];
    } else {
      markedDates[event.date] = {
        dots: [{ color: COLORS.PURPLE_800 }]
      };
    }
  });

  // Add dots for days with shared events
  sharedEvents.forEach((event) => {
    if (markedDates[event.date]) {
      if (!markedDates[event.date].dots) {
        markedDates[event.date].dots = [];
      }
      markedDates[event.date].dots?.push({ color: COLORS.TEAL_600 });
    } else {
      markedDates[event.date] = {
        dots: [{ color: COLORS.TEAL_600 }]
      };
    }
  });

  const filteredEvents = events.filter(
    (event) => event.date === selectedDate && showPersonalEvents
  );

  const filteredSharedEvents = sharedEvents.filter(
    (event) => event.date === selectedDate && showSharedEvents
  );

  return (
    <DefaultContainer title="Agenda" newEvent={true} onNewEvent={handleNewEvent} backButton>
      <Container>
        <Content>
          <RNCalendar
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={markedDates}
            markingType="multi-dot"
            theme={{
              calendarBackground: COLORS.WHITE,
              textSectionTitleColor: COLORS.PURPLE_800,
              selectedDayBackgroundColor: COLORS.PURPLE_800,
              selectedDayTextColor: COLORS.WHITE,
              todayTextColor: COLORS.PURPLE_800,
              dayTextColor: COLORS.PURPLE_800,
              textDisabledColor: COLORS.GRAY_300,
              dotColor: COLORS.GREEN_700,
              selectedDotColor: COLORS.WHITE,
              arrowColor: COLORS.PURPLE_800,
              monthTextColor: COLORS.PURPLE_800,
              indicatorColor: COLORS.PURPLE_800,
              dotStyle: {
                width: 8,
                height: 8,
                borderRadius: 4,
                marginTop: 1
              }
            }}
          />

          <HeaderContainer>
            <TouchableOpacity
              onPress={() => {
                setShowPersonalEvents(true);
                setShowSharedEvents(false);
              }}
            >
              <SectionIcon active={showPersonalEvents}>
                <Ionicons 
                  name="person" 
                  size={24} 
                  color={showPersonalEvents ? COLORS.TEAL_600 : COLORS.PURPLE_800} 
                />
                <Title style={{ color: showPersonalEvents ? COLORS.TEAL_600 : COLORS.PURPLE_800 }}>
                  Meus Eventos
                </Title>
              </SectionIcon>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setShowPersonalEvents(false);
                setShowSharedEvents(true);
              }}
            >
              <SectionIcon active={showSharedEvents}>
                <Ionicons 
                  name="people" 
                  size={24} 
                  color={showSharedEvents ? COLORS.TEAL_600 : COLORS.PURPLE_800} 
                />
                <Title style={{ color: showSharedEvents ? COLORS.TEAL_600 : COLORS.PURPLE_800 }}>
                  Compartilhados
                </Title>
              </SectionIcon>
            </TouchableOpacity>
          </HeaderContainer>

          {filteredEvents.length === 0 && filteredSharedEvents.length === 0 ? (
            <EmptyContainer>
              <Image 
                source={require("../../assets/illustrations/notes.png")}
                style={{ width: 200, height: 200 }}
                resizeMode="contain"
              />
              <Title>Nenhum evento para esta data</Title>
              <SubTitle>
                Toque no botão + para adicionar um novo evento
              </SubTitle>
            </EmptyContainer>
          ) : (
            <>
              {filteredEvents.length > 0 && (
                <>
                  <ContentTitle>
                    <Title>Meus Compromissos</Title>
                    <DividerContent />
                  </ContentTitle>
                  <FlatList
                    data={filteredEvents}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <EventItem
                        event={{
                          ...item,
                          name: item.title,
                          createdAt: new Date(item.date + 'T' + item.time)
                        }}
                        onUpdate={() => handleEditEvent(item)}
                        onDelete={() => handleDeleteEvent(item)}
                        isSharedByMe={false}
                      />
                    )}
                  />
                </>
              )}

              {filteredSharedEvents.length > 0 && (
                <>
                  <ContentTitle>
                    <Title>Compromissos Compartilhados</Title>
                    <DividerContent />
                  </ContentTitle>
                  <FlatList
                    data={filteredSharedEvents}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <EventItem
                        event={{
                          ...item,
                          name: item.title,
                          createdAt: new Date(item.date + 'T' + item.time)
                        }}
                        onUpdate={() => handleEditEvent(item)}
                        onDelete={() => handleDeleteEvent(item)}
                        isSharedByMe={true}
                      />
                    )}
                  />
                </>
              )}
            </>
          )}
        </Content>
      </Container>
    </DefaultContainer>
  );
} 