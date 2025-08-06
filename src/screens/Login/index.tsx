import React, { useState } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { DefaultContainer } from '../../components/DefaultContainer';
import { Logo } from '../../components/Logo';
import { SingIn } from '../SingIn';
import { SingUp } from '../SingUp';
import {
  Button,
  Container,
  Header,
  LogoContainer,
  NavBar,
  Title,
} from './styles';

export function Login() {
  const [activeButton, setActiveButton] = useState('Entrar');

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  return (
    <DefaultContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Container>
            <Header>
              <NavBar>
                <Button
                  onPress={() => handleButtonClick('Entrar')}
                  active={activeButton !== 'Entrar'}
                  style={{ borderTopLeftRadius: 40 }}
                >
                  <Title>Entrar</Title>
                </Button>
                <Button
                  onPress={() => handleButtonClick('Inscrever-se')}
                  active={activeButton !== 'Inscrever-se'}
                  style={{ borderTopRightRadius: 40 }}
                >
                  <Title>Inscrever-se</Title>
                </Button>
              </NavBar>
            </Header>

            {activeButton === 'Entrar' && <SingIn />}
            {activeButton === 'Inscrever-se' && <SingUp />}
            <LogoContainer>
              <Logo />
            </LogoContainer>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </DefaultContainer>
  );
}
