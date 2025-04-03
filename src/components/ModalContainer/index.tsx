import React from 'react';
import { Modal, Platform, View } from 'react-native';

interface ModalContainerProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function ModalContainer({ visible, onClose, children }: ModalContainerProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          paddingTop: Platform.OS === "ios" ? 20 : 0,
        }}
      >
        {children}
      </View>
    </Modal>
  );
} 