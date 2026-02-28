/**
 * In-memory rate limiter using a Map
 * Tracks request counts per key with automatic cleanup of expired entries
 */
export class RateLimiter {
  private requests: Map<string, { count: number; resetAt: number }> = new Map();

  /**
   * Check if a request should be allowed based on rate limit
   * @param key - Unique identifier (e.g., IP address, user ID)
   * @param limit - Maximum number of requests allowed
   * @param windowMs - Time window in milliseconds
   * @returns true if request is allowed, false if rate limit exceeded
   */
  check(key: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const record = this.requests.get(key);

    // If no record exists, create new one
    if (!record) {
      this.requests.set(key, {
        count: 1,
        resetAt: now + windowMs,
      });
      return true;
    }

    // If window has expired, reset the count
    if (now >= record.resetAt) {
      this.requests.set(key, {
        count: 1,
        resetAt: now + windowMs,
      });
      return true;
    }

    // If within window, check if limit exceeded
    if (record.count < limit) {
      record.count++;
      return true;
    }

    return false;
  }

  /**
   * Cleanup expired entries from the map
   * Should be called periodically to prevent memory leaks
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, value] of this.requests.entries()) {
      if (now >= value.resetAt) {
        this.requests.delete(key);
      }
    }
  }

  /**
   * Clear all entries
   */
  clear(): void {
    this.requests.clear();
  }

  /**
   * Get current number of tracked keys
   */
  size(): number {
    return this.requests.size;
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiter();

// Auto-cleanup every 5 minutes
setInterval(() => {
  rateLimiter.cleanup();
}, 5 * 60 * 1000);
