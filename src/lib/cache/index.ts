import NodeCache from 'node-cache';
import { config } from '@/lib/config';

/**
 * Cache key constants for entities
 */
export const CACHE_KEYS = {
  USER: (id: string) => `users:${id}`,
  GROUPS: (userId: string) => `groups:${userId}`,
  GROUP: (groupId: string) => `group:${groupId}`,
  EXPENSES: (groupId: string) => `expenses:${groupId}`,
  BALANCES: (groupId: string) => `balances:${groupId}`,
  CURRENCIES: 'currencies',
} as const;

/**
 * CacheManager - Singleton pattern for in-memory caching
 */
class CacheManager {
  private static instance: CacheManager;
  private cache: NodeCache;

  private constructor() {
    this.cache = new NodeCache({ stdTTL: config.cache.defaultTtl, checkperiod: 600 });
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  /**
   * Get value from cache
   */
  public get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  /**
   * Set value in cache with optional TTL
   */
  public set<T>(key: string, value: T, ttl?: number): boolean {
    if (ttl) {
      this.cache.set<T>(key, value, ttl);
    } else {
      this.cache.set<T>(key, value);
    }
    return true;
  }

  /**
   * Delete value from cache
   */
  public del(key: string): number {
    return this.cache.del(key);
  }

  /**
   * Flush all cache
   */
  public flush(): void {
    this.cache.flushAll();
  }

  /**
   * Invalidate all keys matching a pattern
   */
  public invalidatePattern(pattern: string): number {
    const keys = this.cache.keys();
    let deletedCount = 0;

    for (const key of keys) {
      if (this.matchesPattern(key, pattern)) {
        this.cache.del(key);
        deletedCount++;
      }
    }

    return deletedCount;
  }

  /**
   * Helper method to match keys against a pattern
   * Supports wildcards: * matches any sequence of characters
   */
  private matchesPattern(key: string, pattern: string): boolean {
    const regexPattern = pattern
      .replace(/[.+^${}()|[\]\\]/g, '\\$&')
      .replace(/\*/g, '.*');
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(key);
  }

  /**
   * Get cache statistics
   */
  public getStats() {
    return this.cache.getStats();
  }

  /**
   * Get all keys
   */
  public getKeys(): string[] {
    return this.cache.keys();
  }
}

export const cacheManager = CacheManager.getInstance();
