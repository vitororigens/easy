import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, TextInput, View, Keyboard, Platform, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Container, Content, ButtonText } from './styles';

interface FinishTasksProps {
  selectedCount: number;
  onFinish: (groupName: string) => void;
}

export function FinishTasks({ selectedCount, onFinish }: FinishTasksProps) {
  const [groupName, setGroupName] = useState('');
  const [keyboardHeight] = useState(new Animated.Value(0));

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (event) => {
        Animated.timing(keyboardHeight, {
          toValue: event.endCoordinates.height,
          duration: Platform.OS === 'ios' ? event.duration : 250,
          useNativeDriver: false,
        }).start();
      },
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        Animated.timing(keyboardHeight, {
          toValue: 0,
          duration: Platform.OS === 'ios' ? 250 : 250,
          useNativeDriver: false,
        }).start();
      },
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, [keyboardHeight]);

  if (selectedCount === 0) return null;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        bottom: 60,
        left: 0,
        right: 0,
        transform: [{
          translateY: keyboardHeight.interpolate({
            inputRange: [0, 300],
            outputRange: [0, -300],
          }),
        }],
      }}
    >
      <Container>
        <Content>
          <Text style={{ color: '#FFF', fontSize: 16 }}>
            {selectedCount} {selectedCount === 1 ? 'tarefa selecionada' : 'tarefas selecionadas'}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <TextInput
              placeholder="Nome do grupo"
              placeholderTextColor="#FFF"
              value={groupName}
              onChangeText={setGroupName}
              style={{
                color: '#FFF',
                borderBottomWidth: 1,
                borderBottomColor: '#FFF',
                marginRight: 8,
                flex: 1,
              }}
            />
            <TouchableOpacity onPress={() => onFinish(groupName || 'Grupo de Tarefas')}>
              <ButtonText>
                <MaterialIcons name="check-circle" size={24} color="#FFF" />
                <Text style={{ color: '#FFF', marginLeft: 8 }}>Finalizar</Text>
              </ButtonText>
            </TouchableOpacity>
          </View>
        </Content>
      </Container>
    </Animated.View>
  );
}
