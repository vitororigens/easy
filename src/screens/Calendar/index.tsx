import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View, Image } from "react-native";
import { Calendar as RNCalendar } from "react-native-calendars";
import { useTheme } from "styled-components/native";
import { DefaultContainer } from "../../components/DefaultContainer";
import { EventItem } from "../../components/EventItem";
import { useUserAuth } from "../../hooks/useUserAuth";
import {
  OneSignal,
  LogLevel,
  NotificationClickEvent,
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
import { ICalendarEvent, listEvents, listSharedEvents } from "../../services/firebase/calendar.firebase";

export function CalendarScreen() {
  const navigation = useNavigation();
  const { COLORS } = useTheme();
  const user = useUserAuth();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [events, setEvents] = useState<ICalendarEvent[]>([]);
  const [sharedEvents, setSharedEvents] = useState<ICalendarEvent[]>([]);
  const [showPersonalEvents, setShowPersonalEvents] = useState(true);
  const [showSharedEvents, setShowSharedEvents] = useState(true);

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

  function handleEditEvent(event: ICalendarEvent) {
    navigation.navigate("newevent", {
      selectedItemId: event.id,
      isCreator: event.userId === user.user?.uid,
    });
  }

  function handleDeleteEvent(event: ICalendarEvent) {
    // Implement delete functionality
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

  const markedDates = {
    [selectedDate]: {
      selected: true,
      selectedColor: COLORS.PURPLE_800,
    },
  };

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
            theme={{
              calendarBackground: COLORS.WHITE,
              textSectionTitleColor: COLORS.PURPLE_800,
              selectedDayBackgroundColor: COLORS.PURPLE_800,
              selectedDayTextColor: COLORS.WHITE,
              todayTextColor: COLORS.PURPLE_800,
              dayTextColor: COLORS.PURPLE_800,
              textDisabledColor: COLORS.GRAY_300,
              dotColor: COLORS.PURPLE_800,
              selectedDotColor: COLORS.WHITE,
              arrowColor: COLORS.PURPLE_800,
              monthTextColor: COLORS.PURPLE_800,
              indicatorColor: COLORS.PURPLE_800,
            }}
          />

          <HeaderContainer>
            <TouchableOpacity
              onPress={() => setShowPersonalEvents(!showPersonalEvents)}
            >
              <SectionIcon active={showPersonalEvents}>
                <Ionicons name="person" size={24} color={COLORS.PURPLE_800} />
                <Title>Meus Eventos</Title>
              </SectionIcon>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowSharedEvents(!showSharedEvents)}
            >
              <SectionIcon active={showSharedEvents}>
                <Ionicons name="people" size={24} color={COLORS.PURPLE_800} />
                <Title>Compartilhados</Title>
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
                    <Title>Meus Eventos</Title>
                    <DividerContent />
                  </ContentTitle>
                  <FlatList
                    data={filteredEvents}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <EventItem
                        event={item}
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
                    <Title>Eventos Compartilhados</Title>
                    <DividerContent />
                  </ContentTitle>
                  <FlatList
                    data={filteredSharedEvents}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <EventItem
                        event={item}
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