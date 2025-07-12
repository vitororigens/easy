import React from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheConfig {
  defaultTTL: number; // Time to live in milliseconds
  maxSize: number; // Maximum number of entries
  cleanupInterval: number; // Cleanup interval in milliseconds
}

class Cache<T = any> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private config: CacheConfig;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      defaultTTL: 5 * 60 * 1000, // 5 minutes
      maxSize: 100,
      cleanupInterval: 60 * 1000, // 1 minute
      ...config,
    };

    // Start cleanup interval
    this.startCleanup();
  }

  /**
   * Adiciona um item ao cache
   */
  set(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.defaultTTL,
    };

    // Remove oldest entry if cache is full
    if (this.cache.size >= this.config.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, entry);
  }

  /**
   * Obtém um item do cache
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Verifica se uma chave existe no cache
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Remove um item do cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Limpa todo o cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Obtém o tamanho do cache
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Obtém todas as chaves do cache
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Obtém todos os valores do cache
   */
  values(): T[] {
    return Array.from(this.cache.values()).map(entry => entry.data);
  }

  /**
   * Obtém informações sobre uma entrada do cache
   */
  getInfo(key: string): { exists: boolean; age: number; ttl: number } | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    const age = Date.now() - entry.timestamp;
    const isExpired = age > entry.ttl;

    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return {
      exists: true,
      age,
      ttl: entry.ttl,
    };
  }

  /**
   * Remove entradas expiradas
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Inicia o processo de limpeza automática
   */
  private startCleanup(): void {
    setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }
}

// Cache especializado para usuários
export class UserCache extends Cache<any> {
  constructor() {
    super({
      defaultTTL: 10 * 60 * 1000, // 10 minutes
      maxSize: 50,
    });
  }

  /**
   * Busca usuário no cache ou executa a função de busca
   */
  async getOrFetch(
    key: string,
    fetchFn: () => Promise<any>,
    ttl?: number
  ): Promise<any> {
    const cached = this.get(key);
    if (cached) {
      return cached;
    }

    const data = await fetchFn();
    this.set(key, data, ttl);
    return data;
  }
}

// Cache especializado para dados de compartilhamento
export class SharingCache extends Cache<any> {
  constructor() {
    super({
      defaultTTL: 2 * 60 * 1000, // 2 minutes
      maxSize: 100,
    });
  }
}

// Cache especializado para dados de mercado
export class MarketCache extends Cache<any> {
  constructor() {
    super({
      defaultTTL: 5 * 60 * 1000, // 5 minutes
      maxSize: 200,
    });
  }
}

// Instâncias globais
export const userCache = new UserCache();
export const sharingCache = new SharingCache();
export const marketCache = new MarketCache();

// Hook para usar cache em componentes
export const useCache = <T>(cache: Cache<T>) => {
  const get = React.useCallback((key: string): T | null => {
    return cache.get(key);
  }, [cache]);

  const set = React.useCallback((key: string, data: T, ttl?: number): void => {
    cache.set(key, data, ttl);
  }, [cache]);

  const has = React.useCallback((key: string): boolean => {
    return cache.has(key);
  }, [cache]);

  const remove = React.useCallback((key: string): boolean => {
    return cache.delete(key);
  }, [cache]);

  const clear = React.useCallback((): void => {
    cache.clear();
  }, [cache]);

  const getOrFetch = React.useCallback(async (
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number
  ): Promise<T> => {
    const cached = cache.get(key);
    if (cached) {
      return cached;
    }

    const data = await fetchFn();
    cache.set(key, data, ttl);
    return data;
  }, [cache]);

  return {
    get,
    set,
    has,
    remove,
    clear,
    getOrFetch,
  };
};

// Hook específico para cache de usuários
export const useUserCache = () => {
  return useCache(userCache);
};

// Hook específico para cache de compartilhamento
export const useSharingCache = () => {
  return useCache(sharingCache);
};

// Hook específico para cache de mercado
export const useMarketCache = () => {
  return useCache(marketCache);
};

// Utilitário para limpar todos os caches
export const clearAllCaches = (): void => {
  userCache.clear();
  sharingCache.clear();
  marketCache.clear();
};

// Utilitário para obter estatísticas dos caches
export const getCacheStats = () => {
  return {
    userCache: {
      size: userCache.size(),
      keys: userCache.keys().length,
    },
    sharingCache: {
      size: sharingCache.size(),
      keys: sharingCache.keys().length,
    },
    marketCache: {
      size: marketCache.size(),
      keys: marketCache.keys().length,
    },
  };
};

export default Cache; 