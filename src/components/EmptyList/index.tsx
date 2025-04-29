import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';

interface EmptyListProps {
  message: string;
}

export function EmptyList({ message }: EmptyListProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
} 