import { Entypo, FontAwesome, Ionicons } from '@expo/vector-icons';
import { getAuth, signOut, deleteUser } from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { ScrollView, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from 'styled-components/native';
import { CustomModal } from '../../components/CustomModal';
import { DefaultContainer } from '../../components/DefaultContainer';
import { Loading } from '../../components/Loading';
import { useUserAuth } from '../../hooks/useUserAuth';
import {
  ButtonIcon,
  Content,
  ContentItems,
  Icon,
  Items,
  Title,
  SectionTitle,
  SectionContainer,
  ItemContent,
  ItemTextContainer,
  ItemSubtitle,
  ArrowIcon,
  DangerIcon,
  WarningIcon,
} from './styles';

// Interface para os itens de menu
interface MenuItemProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onPress: () => void;
  accessibilityLabel: string;
  accessibilityHint: string;
  iconType?: 'default' | 'warning' | 'danger';
}

// Componente reutilizável para itens de menu
const MenuItem: React.FC<MenuItemProps> = ({
  title,
  subtitle,
  icon,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  iconType = 'default',
}) => {
  const { COLORS } = useTheme();

  const renderIcon = () => {
    switch (iconType) {
    case 'warning':
      return <WarningIcon>{icon}</WarningIcon>;
    case 'danger':
      return <DangerIcon>{icon}</DangerIcon>;
    default:
      return <Icon>{icon}</Icon>;
    }
  };

  return (
    <ButtonIcon
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
    >
      <Items>
        <ItemContent>
          <ItemTextContainer>
            <Title>{title}</Title>
            <ItemSubtitle>{subtitle}</ItemSubtitle>
          </ItemTextContainer>
          {renderIcon()}
        </ItemContent>
        <ArrowIcon>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={COLORS.GRAY_400}
          />
        </ArrowIcon>
      </Items>
    </ButtonIcon>
  );
};

export function Gears() {
  const navigation = useNavigation();
  const { COLORS } = useTheme();
  const user = useUserAuth();
  const [confirmLogoutVisible, setConfirmLogoutVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const auth = getAuth();

  function handleLogoutConfirmation() {
    setConfirmLogoutVisible(true);
  }

  async function handleLogout() {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('user');
      console.log('User signed out');
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'login' }],
        });
      }, 1000);
    } catch (error) {
      console.error('Error signing out: ', error);
      Alert.alert('Erro', 'Não foi possível fazer logout. Tente novamente.');
    }
  }

  function handleDeleteUserConfirmation() {
    setConfirmDeleteVisible(true);
  }

  async function handleDeleteUser() {
    try {
      if (auth.currentUser) {
        await deleteUser(auth.currentUser);
        await AsyncStorage.removeItem('user');
        console.log('User deleted account');
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'login' }],
          });
        }, 1000);
      }
    } catch (error) {
      console.error('Error delete account: ', error);
      Alert.alert('Erro', 'Não foi possível deletar a conta. Tente novamente.');
    }
  }

  // function handlePiggyBank() {
  //   navigation.navigate("piggybank");
  // }

  // function handleGraphics() {
  //   navigation.navigate("graphics");
  // }

  function handlePefil() {
    navigation.navigate('perfil');
  }

  function handleNotifications() {
    navigation.navigate('notifications');
  }

  function handleShared() {
    navigation.navigate('shared');
  }

  function handleSubscriptions() {
    navigation.navigate('subscriptions');
  }

  function handleNotes() {
    navigation.navigate('notes');
  }

  return (
    <DefaultContainer title="Configurações">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ flex: 1 }}
      >
        <Content>
          {user ? (
            <View>
              {/* Seção Funcionalidades */}
              <SectionContainer>
                <SectionTitle>Funcionalidades</SectionTitle>
                <ContentItems>
                  <MenuItem
                    title="Assinaturas"
                    subtitle="Gerencie suas assinaturas mensais"
                    icon={<FontAwesome name="pencil" size={24} color={COLORS.PURPLE_800} />}
                    onPress={handleSubscriptions}
                    accessibilityLabel="Ir para Assinaturas"
                    accessibilityHint="Navega para a tela de gerenciamento de assinaturas"
                  />

                  <MenuItem
                    title="Notas"
                    subtitle="Suas anotações e lembretes"
                    icon={<FontAwesome name="sticky-note" size={24} color={COLORS.PURPLE_800} />}
                    onPress={handleNotes}
                    accessibilityLabel="Ir para Notas"
                    accessibilityHint="Navega para a tela de notas pessoais"
                  />
                </ContentItems>
              </SectionContainer>

              {/* Seção Configurações */}
              <SectionContainer>
                <SectionTitle>Configurações</SectionTitle>
                <ContentItems>
                  <MenuItem
                    title="Compartilhamentos"
                    subtitle="Gerencie o que você compartilha"
                    icon={<FontAwesome name="share" size={24} color={COLORS.PURPLE_800} />}
                    onPress={handleShared}
                    accessibilityLabel="Ir para Compartilhamentos"
                    accessibilityHint="Navega para a tela de compartilhamentos"
                  />

                  <MenuItem
                    title="Notificações"
                    subtitle="Configure alertas e lembretes"
                    icon={<FontAwesome name="bell" size={24} color={COLORS.PURPLE_800} />}
                    onPress={handleNotifications}
                    accessibilityLabel="Ir para Notificações"
                    accessibilityHint="Navega para a tela de configurações de notificações"
                  />

                  <MenuItem
                    title="Perfil"
                    subtitle="Edite suas informações pessoais"
                    icon={<FontAwesome name="user" size={24} color={COLORS.PURPLE_800} />}
                    onPress={handlePefil}
                    accessibilityLabel="Ir para Perfil"
                    accessibilityHint="Navega para a tela de perfil do usuário"
                  />
                </ContentItems>
              </SectionContainer>

              {/* Seção Conta */}
              <SectionContainer>
                <SectionTitle>Conta</SectionTitle>
                <ContentItems>
                  <MenuItem
                    title="Sair"
                    subtitle="Encerrar sessão atual"
                    icon={<Entypo name="log-out" size={24} color={COLORS.YELLOW_700} />}
                    onPress={handleLogoutConfirmation}
                    accessibilityLabel="Sair da conta"
                    accessibilityHint="Confirma o logout da conta atual"
                    iconType="warning"
                  />

                  <MenuItem
                    title="Deletar Conta"
                    subtitle="Excluir conta permanentemente"
                    icon={<FontAwesome name="trash" size={24} color={COLORS.RED_700} />}
                    onPress={handleDeleteUserConfirmation}
                    accessibilityLabel="Deletar conta"
                    accessibilityHint="Confirma a exclusão permanente da conta"
                    iconType="danger"
                  />
                </ContentItems>
              </SectionContainer>
            </View>
          ) : (
            <Loading />
          )}
        </Content>
      </ScrollView>

      <CustomModal
        animationType="slide"
        transparent={true}
        onCancel={() => setConfirmLogoutVisible(false)}
        onClose={() => {
          setConfirmLogoutVisible(false);
        }}
        onConfirme={() => {
          setConfirmLogoutVisible(false);
          handleLogout();
        }}
        title="Deseja realmente sair da conta?"
        visible={confirmLogoutVisible}
      />

      <CustomModal
        animationType="slide"
        transparent={true}
        onCancel={() => setConfirmDeleteVisible(false)}
        onClose={() => {
          setConfirmDeleteVisible(false);
        }}
        onConfirme={() => {
          setConfirmDeleteVisible(false);
          handleDeleteUser();
        }}
        title="Deseja realmente excluir essa conta?"
        visible={confirmDeleteVisible}
      />
    </DefaultContainer>
  );
}
