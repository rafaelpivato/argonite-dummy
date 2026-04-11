import type { ServiceDependencies } from 'argonite-core';
import { Service } from 'argonite-core';

export class CounterService extends Service {
  private count = 0;
  private lastDisposedAt: number | null = null;
  private disposeCount = 0;

  constructor(private readonly deps: ServiceDependencies) {
    super();
  }

  onStart() {
    const storage = this.deps.capabilities.storage;
    if (!storage) {
      return;
    }

    void Promise.all([
      storage.get<number>('counter:count'),
      storage.get<number>('counter:lastDisposedAt'),
    ])
      .then(([storedCount, storedDisposedAt]) => {
        if (typeof storedCount === 'number') {
          this.count = storedCount;
        }

        if (typeof storedDisposedAt === 'number') {
          this.lastDisposedAt = storedDisposedAt;
        }
      })
      .catch((err) => {
        console.warn('[Argonite Dummy] Failed to restore state from storage', err);
      });
  }

  onDispose() {
    const disposedAt = Date.now();
    this.disposeCount += 1;
    this.lastDisposedAt = disposedAt;

    console.log('[Argonite Dummy] CounterService disposed', disposedAt);

    void this.deps.capabilities.storage?.set('counter:lastDisposedAt', disposedAt).catch((err) => {
      console.warn('[Argonite Dummy] Failed to persist dispose marker', err);
    });
  }

  increment() {
    this.count++;
    void this.persist();
    return this.count;
  }

  getCount() {
    return this.count;
  }

  getLifecycleState() {
    return {
      count: this.count,
      disposeCount: this.disposeCount,
      lastDisposedAt: this.lastDisposedAt,
    };
  }

  private async persist() {
    try {
      await this.deps.capabilities.storage?.set('counter:count', this.count);
    } catch (err) {
      console.warn('[Argonite Dummy] Failed to persist counter to storage', err);
    }
  }
}
