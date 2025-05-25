import React from 'react';
import { TouchableOpacity } from 'react-native';
import { ICalendarEvent } from '../../services/firebase/calendar.firebase';
import {
  Container,
  Content,
  Title,
  Description,
  Time,
  Icon,
  ShareIcon,
} from './styles';

interface EventItemProps {
  event: ICalendarEvent;
  onUpdate: () => void;
  onDelete: () => void;
  isSharedByMe?: boolean;
}

export function EventItem({ event, onUpdate, onDelete, isSharedByMe }: EventItemProps) {
  return (
    <Container>
      <TouchableOpacity onPress={onUpdate}>
        <Content>
          <Title>{event.title}</Title>
          <Description>{event.description}</Description>
          <Time>{event.time}</Time>
        </Content>
      </TouchableOpacity>
      <Icon name="delete-outline" onPress={onDelete} />
      {isSharedByMe && <ShareIcon name="share-variant" />}
    </Container>
  );
} 