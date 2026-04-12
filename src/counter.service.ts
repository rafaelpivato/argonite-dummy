import { Service } from 'argonite-core';

const counterCapabilities = ['storage'] as const;

export class CounterService extends Service<typeof counterCapabilities> {
  static readonly requiredCapabilities = counterCapabilities;

  private count = 0;
  private lastDisposedAt: number | null = null;
  private disposeCount = 0;
  private restoreReady: Promise<void> = Promise.resolve();

  onStart() {
    this.restoreReady = this.restore();
  }

  onDispose() {
    const disposedAt = Date.now();
    this.disposeCount += 1;
    this.lastDisposedAt = disposedAt;

    console.log('[Argonite Dummy] CounterService disposed', disposedAt);

    void this.storage.set('counter:lastDisposedAt', disposedAt).catch((err: unknown) => {
      console.warn('[Argonite Dummy] Failed to persist dispose marker', err);
    });
  }

  async increment() {
    await this.restoreReady;
    this.count++;
    void this.persist();
    return this.count;
  }

  async getCount() {
    await this.restoreReady;
    return this.count;
  }

  async getLifecycleState() {
    await this.restoreReady;
    return {
      count: this.count,
      disposeCount: this.disposeCount,
      lastDisposedAt: this.lastDisposedAt,
    };
  }

  private async restore() {
    try {
      const storedCount = await this.storage.get<number>('counter:count');
      if (typeof storedCount === 'number') {
        this.count = storedCount;
      }
    } catch (err) {
      console.warn('[Argonite Dummy] Failed to restore counter from storage', err);
    }
  }

  private async persist() {
    try {
      await this.storage.set('counter:count', this.count);
    } catch (err) {
      console.warn('[Argonite Dummy] Failed to persist counter to storage', err);
    }
  }
}
