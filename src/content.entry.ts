import { ContentEntry } from 'argonite-core';

type CounterUpdatedMessage = {
  value: number;
};

export class ContentLoggerEntry extends ContentEntry {
  register() {
    console.log('[Argonite] Content script active');

    this.runtime.onBroadcast<CounterUpdatedMessage>('counter:updated', (event) => {
      console.log('[Argonite] Counter updated via broadcast', event.value);
    });
  }
}
