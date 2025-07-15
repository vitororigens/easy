import React from 'react';

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  keyPrefix?: string;
}

interface RateLimitEntry {
  attempts: number;
  resetTime: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  /**
   * Verifica se uma ação pode ser executada
   */
  canExecute(key: string): boolean {
    const fullKey = this.config.keyPrefix ? `${this.config.keyPrefix}:${key}` : key;
    const now = Date.now();
    const entry = this.limits.get(fullKey);

    // Se não há entrada ou a janela de tempo expirou, permite a execução
    if (!entry || now > entry.resetTime) {
      this.limits.set(fullKey, {
        attempts: 1,
        resetTime: now + this.config.windowMs,
      });
      return true;
    }

    // Se ainda está dentro da janela de tempo, verifica o número de tentativas
    if (entry.attempts < this.config.maxAttempts) {
      entry.attempts++;
      return true;
    }

    return false;
  }

  /**
   * Executa uma função com rate limiting
   */
  async execute<T>(
    key: string,
    fn: () => Promise<T>,
    onLimitExceeded?: () => void
  ): Promise<T> {
    if (!this.canExecute(key)) {
      onLimitExceeded?.();
      throw new Error('Rate limit exceeded');
    }

    return fn();
  }

  /**
   * Obtém informações sobre o rate limit atual
   */
  getLimitInfo(key: string): { attempts: number; remaining: number; resetTime: number } | null {
    const fullKey = this.config.keyPrefix ? `${this.config.keyPrefix}:${key}` : key;
    const entry = this.limits.get(fullKey);

    if (!entry) {
      return null;
    }

    const now = Date.now();
    if (now > entry.resetTime) {
      return null;
    }

    return {
      attempts: entry.attempts,
      remaining: Math.max(0, this.config.maxAttempts - entry.attempts),
      resetTime: entry.resetTime,
    };
  }

  /**
   * Reseta o rate limit para uma chave específica
   */
  reset(key: string): void {
    const fullKey = this.config.keyPrefix ? `${this.config.keyPrefix}:${key}` : key;
    this.limits.delete(fullKey);
  }

  /**
   * Limpa todos os rate limits
   */
  clear(): void {
    this.limits.clear();
  }

  /**
   * Remove entradas expiradas
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetTime) {
        this.limits.delete(key);
      }
    }
  }
}

// Configurações predefinidas para diferentes tipos de ações
export const RateLimitConfigs = {
  // Compartilhamento
  SHARING_INVITE: {
    maxAttempts: 5,
    windowMs: 60 * 1000, // 1 minuto
    keyPrefix: 'sharing_invite',
  },

  // Busca de usuários
  USER_SEARCH: {
    maxAttempts: 10,
    windowMs: 60 * 1000, // 1 minuto
    keyPrefix: 'user_search',
  },

  // Login
  LOGIN_ATTEMPT: {
    maxAttempts: 3,
    windowMs: 5 * 60 * 1000, // 5 minutos
    keyPrefix: 'login',
  },

  // Criação de itens
  ITEM_CREATION: {
    maxAttempts: 20,
    windowMs: 60 * 1000, // 1 minuto
    keyPrefix: 'item_creation',
  },

  // Notificações
  NOTIFICATION_SEND: {
    maxAttempts: 10,
    windowMs: 60 * 1000, // 1 minuto
    keyPrefix: 'notification',
  },

  // Upload de arquivos
  FILE_UPLOAD: {
    maxAttempts: 5,
    windowMs: 60 * 1000, // 1 minuto
    keyPrefix: 'file_upload',
  },
} as const;

// Instâncias predefinidas
export const rateLimiters = {
  sharingInvite: new RateLimiter(RateLimitConfigs.SHARING_INVITE),
  userSearch: new RateLimiter(RateLimitConfigs.USER_SEARCH),
  loginAttempt: new RateLimiter(RateLimitConfigs.LOGIN_ATTEMPT),
  itemCreation: new RateLimiter(RateLimitConfigs.ITEM_CREATION),
  notificationSend: new RateLimiter(RateLimitConfigs.NOTIFICATION_SEND),
  fileUpload: new RateLimiter(RateLimitConfigs.FILE_UPLOAD),
};

// Hook para usar rate limiting em componentes
export const useRateLimit = (action: string, config?: RateLimitConfig) => {
  const limiter = React.useMemo(() => {
    return config ? new RateLimiter(config) : rateLimiters[action as keyof typeof rateLimiters];
  }, [action, config]);

  const canExecute = React.useCallback((key: string) => {
    return limiter.canExecute(key);
  }, [limiter]);

  const execute = React.useCallback(async <T>(
    key: string,
    fn: () => Promise<T>,
    onLimitExceeded?: () => void
  ): Promise<T> => {
    return limiter.execute(key, fn, onLimitExceeded);
  }, [limiter]);

  const getLimitInfo = React.useCallback((key: string) => {
    return limiter.getLimitInfo(key);
  }, [limiter]);

  const reset = React.useCallback((key: string) => {
    limiter.reset(key);
  }, [limiter]);

  return {
    canExecute,
    execute,
    getLimitInfo,
    reset,
  };
};

// Decorator para adicionar rate limiting a métodos
export const withRateLimit = (action: string, config?: RateLimitConfig) => {
  return function ( propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    const limiter = config ? new RateLimiter(config) : rateLimiters[action as keyof typeof rateLimiters];

    descriptor.value = async function (...args: any[]) {
      const key = `${this.constructor.name}:${propertyName}`;
      
      if (!limiter.canExecute(key)) {
        throw new Error(`Rate limit exceeded for ${action}`);
      }

      return method.apply(this, args);
    };

    return descriptor;
  };
};

// Utilitário para limpeza periódica
export const startRateLimitCleanup = (intervalMs: number = 5 * 60 * 1000) => {
  setInterval(() => {
    Object.values(rateLimiters).forEach(limiter => {
      limiter.cleanup();
    });
  }, intervalMs);
};

export default RateLimiter; 