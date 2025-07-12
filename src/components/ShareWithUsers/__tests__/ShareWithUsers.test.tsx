import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import { FormProvider, useForm } from 'react-hook-form';
import { ShareWithUsers } from '../index';
import { findUserByUsername, addToFavorites, removeFromFavorites, getFavorites } from '../../../services/firebase/users.firestore';
import { createSharing, getSharing } from '../../../services/firebase/sharing.firebase';
import { sendPushNotification } from '../../../services/one-signal';
import { useUserAuth } from '../../../hooks/useUserAuth';

// Mock dos serviços
jest.mock('../../../services/firebase/users.firestore');
jest.mock('../../../services/firebase/sharing.firebase');
jest.mock('../../../services/one-signal');
jest.mock('../../../hooks/useUserAuth');

const mockFindUserByUsername = findUserByUsername as jest.MockedFunction<typeof findUserByUsername>;
const mockAddToFavorites = addToFavorites as jest.MockedFunction<typeof addToFavorites>;
const mockRemoveFromFavorites = removeFromFavorites as jest.MockedFunction<typeof removeFromFavorites>;
const mockGetFavorites = getFavorites as jest.MockedFunction<typeof getFavorites>;
const mockCreateSharing = createSharing as jest.MockedFunction<typeof createSharing>;
const mockGetSharing = getSharing as jest.MockedFunction<typeof getSharing>;
const mockSendPushNotification = sendPushNotification as jest.MockedFunction<typeof sendPushNotification>;
const mockUseUserAuth = useUserAuth as jest.MockedFunction<typeof useUserAuth>;

// Componente wrapper para fornecer o contexto do formulário
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const methods = useForm({
    defaultValues: {
      sharedUsers: [],
    },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('ShareWithUsers', () => {
  const mockUser = {
    user: {
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: 'Test User',
    },
    loading: false,
  };

  const mockUsers = [
    {
      uid: 'user1',
      userName: 'John Doe',
      email: 'john@example.com',
    },
    {
      uid: 'user2',
      userName: 'Jane Smith',
      email: 'jane@example.com',
    },
  ];

  const mockSharings = [
    {
      id: 'sharing1',
      invitedBy: 'test-uid',
      target: 'user1',
      status: 'accepted' as const,
      createdAt: { seconds: 1234567890, nanoseconds: 0 },
      updatedAt: { seconds: 1234567890, nanoseconds: 0 },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseUserAuth.mockReturnValue(mockUser);
    mockFindUserByUsername.mockResolvedValue([]);
    mockGetFavorites.mockResolvedValue([]);
    mockGetSharing.mockResolvedValue([]);
  });

  describe('Renderização', () => {
    it('deve renderizar o componente corretamente', () => {
      const { getByText } = render(
        <TestWrapper>
          <ShareWithUsers control={{} as any} name="sharedUsers" />
        </TestWrapper>
      );

      expect(getByText('Compartilhar com usuários')).toBeTruthy();
    });

    it('deve mostrar o botão de adicionar usuários', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ShareWithUsers control={{} as any} name="sharedUsers" />
        </TestWrapper>
      );

      expect(getByTestId('add-users-button')).toBeTruthy();
    });
  });

  describe('Busca de usuários', () => {
    it('deve buscar usuários quando digitar no campo de busca', async () => {
      mockFindUserByUsername.mockResolvedValue(mockUsers);

      const { getByPlaceholderText } = render(
        <TestWrapper>
          <ShareWithUsers control={{} as any} name="sharedUsers" />
        </TestWrapper>
      );

      const searchInput = getByPlaceholderText('Buscar usuários');
      fireEvent.changeText(searchInput, 'john');

      await waitFor(() => {
        expect(mockFindUserByUsername).toHaveBeenCalledWith('john', 'test-uid');
      });
    });

    it('deve mostrar loading durante a busca', async () => {
      mockFindUserByUsername.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(mockUsers), 100)));

      const { getByPlaceholderText, getByTestId } = render(
        <TestWrapper>
          <ShareWithUsers control={{} as any} name="sharedUsers" />
        </TestWrapper>
      );

      const searchInput = getByPlaceholderText('Buscar usuários');
      fireEvent.changeText(searchInput, 'john');

      expect(getByTestId('loading-indicator')).toBeTruthy();
    });

    it('deve limpar a lista de usuários quando o campo estiver vazio', async () => {
      const { getByPlaceholderText } = render(
        <TestWrapper>
          <ShareWithUsers control={{} as any} name="sharedUsers" />
        </TestWrapper>
      );

      const searchInput = getByPlaceholderText('Buscar usuários');
      fireEvent.changeText(searchInput, '');

      await waitFor(() => {
        expect(mockFindUserByUsername).not.toHaveBeenCalled();
      });
    });
  });

  describe('Adicionar usuários à lista de compartilhamento', () => {
    it('deve adicionar usuário à lista quando clicado', async () => {
      mockFindUserByUsername.mockResolvedValue(mockUsers);
      mockGetSharing.mockResolvedValue([]);

      const { getByPlaceholderText, getByText } = render(
        <TestWrapper>
          <ShareWithUsers control={{} as any} name="sharedUsers" />
        </TestWrapper>
      );

      const searchInput = getByPlaceholderText('Buscar usuários');
      fireEvent.changeText(searchInput, 'john');

      await waitFor(() => {
        const userButton = getByText('John Doe');
        fireEvent.press(userButton);
      });

      await waitFor(() => {
        expect(mockSendPushNotification).toHaveBeenCalledWith({
          title: 'Novo compartilhamento',
          message: 'John Doe, você foi adicionado a um compartilhamento!',
          uid: 'user1',
        });
      });
    });

    it('deve remover usuário da lista quando clicado novamente', async () => {
      mockFindUserByUsername.mockResolvedValue(mockUsers);
      mockGetSharing.mockResolvedValue([]);

      const { getByPlaceholderText, getByText } = render(
        <TestWrapper>
          <ShareWithUsers control={{} as any} name="sharedUsers" />
        </TestWrapper>
      );

      const searchInput = getByPlaceholderText('Buscar usuários');
      fireEvent.changeText(searchInput, 'john');

      await waitFor(() => {
        const userButton = getByText('John Doe');
        fireEvent.press(userButton); // Adiciona
        fireEvent.press(userButton); // Remove
      });

      // Verifica se o usuário foi removido (não deve estar na lista)
      await waitFor(() => {
        expect(screen.queryByText('John Doe (Adicionado)')).toBeNull();
      });
    });
  });

  describe('Sistema de favoritos', () => {
    it('deve carregar usuários favoritos automaticamente', async () => {
      mockGetFavorites.mockResolvedValue(mockUsers);
      mockGetSharing.mockResolvedValue([]);

      const { getByTestId } = render(
        <TestWrapper>
          <ShareWithUsers control={{} as any} name="sharedUsers" />
        </TestWrapper>
      );

      const addButton = getByTestId('add-users-button');
      fireEvent.press(addButton);

      await waitFor(() => {
        expect(mockGetFavorites).toHaveBeenCalledWith('test-uid');
      });
    });

    it('deve adicionar usuário aos favoritos', async () => {
      mockFindUserByUsername.mockResolvedValue(mockUsers);
      mockAddToFavorites.mockResolvedValue();

      const { getByPlaceholderText, getByTestId } = render(
        <TestWrapper>
          <ShareWithUsers control={{} as any} name="sharedUsers" />
        </TestWrapper>
      );

      const searchInput = getByPlaceholderText('Buscar usuários');
      fireEvent.changeText(searchInput, 'john');

      await waitFor(() => {
        const favoriteButton = getByTestId('favorite-button-user1');
        fireEvent.press(favoriteButton);
      });

      await waitFor(() => {
        expect(mockAddToFavorites).toHaveBeenCalledWith('test-uid', 'user1');
      });
    });

    it('deve remover usuário dos favoritos', async () => {
      mockFindUserByUsername.mockResolvedValue(mockUsers);
      mockRemoveFromFavorites.mockResolvedValue();

      const { getByPlaceholderText, getByTestId } = render(
        <TestWrapper>
          <ShareWithUsers control={{} as any} name="sharedUsers" />
        </TestWrapper>
      );

      const searchInput = getByPlaceholderText('Buscar usuários');
      fireEvent.changeText(searchInput, 'john');

      await waitFor(() => {
        const favoriteButton = getByTestId('favorite-button-user1');
        fireEvent.press(favoriteButton); // Adiciona aos favoritos
        fireEvent.press(favoriteButton); // Remove dos favoritos
      });

      await waitFor(() => {
        expect(mockRemoveFromFavorites).toHaveBeenCalledWith('test-uid', 'user1');
      });
    });
  });

  describe('Ações em lote', () => {
    it('deve adicionar todos os favoritos à lista de compartilhamento', async () => {
      mockGetFavorites.mockResolvedValue(mockUsers);
      mockGetSharing.mockResolvedValue([]);

      const { getByTestId, getByText } = render(
        <TestWrapper>
          <ShareWithUsers control={{} as any} name="sharedUsers" />
        </TestWrapper>
      );

      const addButton = getByTestId('add-users-button');
      fireEvent.press(addButton);

      await waitFor(() => {
        const addAllButton = getByText('Adicionar todos os favoritos');
        fireEvent.press(addAllButton);
      });

      await waitFor(() => {
        expect(mockSendPushNotification).toHaveBeenCalledTimes(2);
      });
    });

    it('deve limpar todos os usuários da lista', async () => {
      mockFindUserByUsername.mockResolvedValue(mockUsers);
      mockGetSharing.mockResolvedValue([]);

      const { getByPlaceholderText, getByText, getByTestId } = render(
        <TestWrapper>
          <ShareWithUsers control={{} as any} name="sharedUsers" />
        </TestWrapper>
      );

      const searchInput = getByPlaceholderText('Buscar usuários');
      fireEvent.changeText(searchInput, 'john');

      await waitFor(() => {
        const userButton = getByText('John Doe');
        fireEvent.press(userButton); // Adiciona usuário
      });

      const clearButton = getByTestId('clear-all-button');
      fireEvent.press(clearButton);

      await waitFor(() => {
        expect(screen.queryByText('John Doe (Adicionado)')).toBeNull();
      });
    });
  });

  describe('Tratamento de erros', () => {
    it('deve mostrar erro quando a busca falhar', async () => {
      mockFindUserByUsername.mockRejectedValue(new Error('Erro na busca'));

      const { getByPlaceholderText } = render(
        <TestWrapper>
          <ShareWithUsers control={{} as any} name="sharedUsers" />
        </TestWrapper>
      );

      const searchInput = getByPlaceholderText('Buscar usuários');
      fireEvent.changeText(searchInput, 'john');

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith('Error fetching users:', expect.any(Error));
      });
    });

    it('deve mostrar erro quando adicionar aos favoritos falhar', async () => {
      mockFindUserByUsername.mockResolvedValue(mockUsers);
      mockAddToFavorites.mockRejectedValue(new Error('Erro ao adicionar favorito'));

      const { getByPlaceholderText, getByTestId } = render(
        <TestWrapper>
          <ShareWithUsers control={{} as any} name="sharedUsers" />
        </TestWrapper>
      );

      const searchInput = getByPlaceholderText('Buscar usuários');
      fireEvent.changeText(searchInput, 'john');

      await waitFor(() => {
        const favoriteButton = getByTestId('favorite-button-user1');
        fireEvent.press(favoriteButton);
      });

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith('Error toggling favorite:', expect.any(Error));
      });
    });
  });

  describe('Estados de loading', () => {
    it('deve mostrar loading durante operações assíncronas', async () => {
      mockFindUserByUsername.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(mockUsers), 100)));

      const { getByPlaceholderText, getByTestId } = render(
        <TestWrapper>
          <ShareWithUsers control={{} as any} name="sharedUsers" />
        </TestWrapper>
      );

      const searchInput = getByPlaceholderText('Buscar usuários');
      fireEvent.changeText(searchInput, 'john');

      expect(getByTestId('loading-indicator')).toBeTruthy();

      await waitFor(() => {
        expect(screen.queryByTestId('loading-indicator')).toBeNull();
      });
    });
  });

  describe('Integração com formulário', () => {
    it('deve atualizar o formulário quando usuários são adicionados', async () => {
      mockFindUserByUsername.mockResolvedValue(mockUsers);
      mockGetSharing.mockResolvedValue([]);

      const TestComponent = () => {
        const methods = useForm({
          defaultValues: {
            sharedUsers: [],
          },
        });

        return (
          <FormProvider {...methods}>
            <ShareWithUsers control={methods.control} name="sharedUsers" />
          </FormProvider>
        );
      };

      const { getByPlaceholderText, getByText } = render(<TestComponent />);

      const searchInput = getByPlaceholderText('Buscar usuários');
      fireEvent.changeText(searchInput, 'john');

      await waitFor(() => {
        const userButton = getByText('John Doe');
        fireEvent.press(userButton);
      });

      // Verifica se o formulário foi atualizado
      await waitFor(() => {
        expect(screen.getByText('John Doe (Adicionado)')).toBeTruthy();
      });
    });
  });
}); 