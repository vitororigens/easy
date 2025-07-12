import analytics from '@react-native-firebase/analytics';
import { Platform } from 'react-native';
import React from 'react';

// Tipos para eventos de analytics
export interface AnalyticsEvent {
  name: string;
  parameters?: Record<string, any>;
}

export interface ScreenViewEvent {
  screenName: string;
  screenClass?: string;
}

export interface UserProperty {
  name: string;
  value: string;
}

// Classe principal de Analytics
class AnalyticsService {
  private isEnabled: boolean = true;

  /**
   * Inicializa o serviço de analytics
   */
  async initialize(): Promise<void> {
    try {
      if (Platform.OS === 'ios') {
        await analytics().setAnalyticsCollectionEnabled(this.isEnabled);
      }
      console.log('Analytics initialized successfully');
    } catch (error) {
      console.error('Failed to initialize analytics:', error);
    }
  }

  /**
   * Registra um evento customizado
   */
  async logEvent(eventName: string, parameters?: Record<string, any>): Promise<void> {
    try {
      if (!this.isEnabled) return;

      await analytics().logEvent(eventName, parameters);
      console.log('Event logged:', eventName, parameters);
    } catch (error) {
      console.error('Failed to log event:', error);
    }
  }

  /**
   * Registra visualização de tela
   */
  async logScreenView(screenName: string, screenClass?: string): Promise<void> {
    try {
      if (!this.isEnabled) return;

      await analytics().logScreenView({
        screen_name: screenName,
        screen_class: screenClass || screenName,
      });
      console.log('Screen view logged:', screenName);
    } catch (error) {
      console.error('Failed to log screen view:', error);
    }
  }

  /**
   * Define propriedades do usuário
   */
  async setUserProperty(name: string, value: string): Promise<void> {
    try {
      if (!this.isEnabled) return;

      await analytics().setUserProperty(name, value);
      console.log('User property set:', name, value);
    } catch (error) {
      console.error('Failed to set user property:', error);
    }
  }

  /**
   * Define ID do usuário
   */
  async setUserId(userId: string): Promise<void> {
    try {
      if (!this.isEnabled) return;

      await analytics().setUserId(userId);
      console.log('User ID set:', userId);
    } catch (error) {
      console.error('Failed to set user ID:', error);
    }
  }

  /**
   * Registra erro
   */
  async logError(error: Error, context?: Record<string, any>): Promise<void> {
    try {
      if (!this.isEnabled) return;

      await analytics().logEvent('app_error', {
        error_message: error.message,
        error_stack: error.stack,
        context: JSON.stringify(context),
        timestamp: new Date().toISOString(),
      });
      console.log('Error logged:', error.message);
    } catch (analyticsError) {
      console.error('Failed to log error to analytics:', analyticsError);
    }
  }

  /**
   * Registra performance de operação
   */
  async logPerformance(operation: string, duration: number, success: boolean): Promise<void> {
    try {
      if (!this.isEnabled) return;

      await analytics().logEvent('performance_operation', {
        operation_name: operation,
        duration_ms: duration,
        success: success,
        timestamp: new Date().toISOString(),
      });
      console.log('Performance logged:', operation, duration);
    } catch (error) {
      console.error('Failed to log performance:', error);
    }
  }

  /**
   * Habilita/desabilita analytics
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * Verifica se analytics está habilitado
   */
  isAnalyticsEnabled(): boolean {
    return this.isEnabled;
  }
}

// Instância singleton
export const analyticsService = new AnalyticsService();

// Hooks e utilitários para facilitar o uso

/**
 * Hook para usar analytics em componentes
 */
export const useAnalytics = () => {
  const trackEvent = async (eventName: string, parameters?: Record<string, any>) => {
    await analyticsService.logEvent(eventName, parameters);
  };

  const trackScreen = async (screenName: string, screenClass?: string) => {
    await analyticsService.logScreenView(screenName, screenClass);
  };

  const trackError = async (error: Error, context?: Record<string, any>) => {
    await analyticsService.logError(error, context);
  };

  const trackPerformance = async (operation: string, duration: number, success: boolean) => {
    await analyticsService.logPerformance(operation, duration, success);
  };

  return {
    trackEvent,
    trackScreen,
    trackError,
    trackPerformance,
  };
};

/**
 * Decorator para medir performance de funções
 */
export const measurePerformance = (operationName: string) => {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now();
      let success = false;

      try {
        const result = await method.apply(this, args);
        success = true;
        return result;
      } finally {
        const duration = Date.now() - startTime;
        await analyticsService.logPerformance(operationName, duration, success);
      }
    };

    return descriptor;
  };
};

/**
 * HOC para adicionar tracking de tela automaticamente
 */
export const withScreenTracking = <P extends object>(
  Component: React.ComponentType<P>,
  screenName: string
) => {
  const WrappedComponent = (props: P) => {
    const { trackScreen } = useAnalytics();

    React.useEffect(() => {
      trackScreen(screenName);
    }, [trackScreen]);

    return React.createElement(Component, props);
  };

  WrappedComponent.displayName = `withScreenTracking(${Component.displayName || Component.name})`;

  return WrappedComponent;
};

// Eventos predefinidos para consistência
export const AnalyticsEvents = {
  // Autenticação
  USER_SIGN_UP: 'user_sign_up',
  USER_SIGN_IN: 'user_sign_in',
  USER_SIGN_OUT: 'user_sign_out',
  USER_DELETE_ACCOUNT: 'user_delete_account',

  // Compartilhamento
  SHARING_INVITE_SENT: 'sharing_invite_sent',
  SHARING_INVITE_ACCEPTED: 'sharing_invite_accepted',
  SHARING_INVITE_REJECTED: 'sharing_invite_rejected',
  SHARING_ITEM_CREATED: 'sharing_item_created',

  // Finanças
  EXPENSE_ADDED: 'expense_added',
  EXPENSE_UPDATED: 'expense_updated',
  EXPENSE_DELETED: 'expense_deleted',
  REVENUE_ADDED: 'revenue_added',
  REVENUE_UPDATED: 'revenue_updated',
  REVENUE_DELETED: 'revenue_deleted',

  // Lista de compras
  MARKET_ITEM_ADDED: 'market_item_added',
  MARKET_ITEM_UPDATED: 'market_item_updated',
  MARKET_ITEM_DELETED: 'market_item_deleted',
  MARKET_ITEM_CHECKED: 'market_item_checked',

  // Tarefas
  TASK_CREATED: 'task_created',
  TASK_UPDATED: 'task_updated',
  TASK_DELETED: 'task_deleted',
  TASK_COMPLETED: 'task_completed',

  // Notas
  NOTE_CREATED: 'note_created',
  NOTE_UPDATED: 'note_updated',
  NOTE_DELETED: 'note_deleted',

  // Eventos
  EVENT_CREATED: 'event_created',
  EVENT_UPDATED: 'event_updated',
  EVENT_DELETED: 'event_deleted',

  // Notificações
  NOTIFICATION_RECEIVED: 'notification_received',
  NOTIFICATION_OPENED: 'notification_opened',

  // Erros
  APP_ERROR: 'app_error',
  NETWORK_ERROR: 'network_error',
  VALIDATION_ERROR: 'validation_error',

  // Performance
  PERFORMANCE_OPERATION: 'performance_operation',
  SCREEN_LOAD_TIME: 'screen_load_time',

  // Engajamento
  FEATURE_USED: 'feature_used',
  BUTTON_CLICKED: 'button_clicked',
  SEARCH_PERFORMED: 'search_performed',
} as const;

// Parâmetros comuns para eventos
export const AnalyticsParameters = {
  // Usuário
  USER_ID: 'user_id',
  USER_EMAIL: 'user_email',
  USER_NAME: 'user_name',

  // Item
  ITEM_ID: 'item_id',
  ITEM_TYPE: 'item_type',
  ITEM_CATEGORY: 'item_category',
  ITEM_VALUE: 'item_value',

  // Compartilhamento
  SHARING_ID: 'sharing_id',
  TARGET_USER_ID: 'target_user_id',
  SHARING_STATUS: 'sharing_status',

  // Performance
  DURATION_MS: 'duration_ms',
  SUCCESS: 'success',
  OPERATION_NAME: 'operation_name',

  // Erro
  ERROR_MESSAGE: 'error_message',
  ERROR_STACK: 'error_stack',
  ERROR_CONTEXT: 'error_context',

  // Tela
  SCREEN_NAME: 'screen_name',
  SCREEN_CLASS: 'screen_class',

  // Timestamp
  TIMESTAMP: 'timestamp',
} as const;

// Exporta a instância por padrão
export default analyticsService; 