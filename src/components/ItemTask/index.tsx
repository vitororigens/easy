import React, { useState } from "react";
import { Icon, Title, Container, Button } from "./styles";
import { TouchableOpacity, View } from "react-native";

type ListItemProps = {
  title: string;
  onDelete: () => void;
  onEdit: () => void;
  isChecked: boolean;
  onToggle: () => void;
};

export function ItemTask({ title, onDelete, onEdit, isChecked, onToggle }: ListItemProps) {
  return (
    <Container>
        <Title >{title}</Title>
  
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={onEdit}>
          <Icon type="SECONDARY" name="pencil" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete}>
          <Icon type="SECONDARY" name="trash-can" />
        </TouchableOpacity>
      </View>
    </Container>
  );
}