import { ContentEntry } from 'argonite-core';

export class ContentLoggerEntry extends ContentEntry {
  register() {
    console.log('[Argonite] Content script active');
  }
}
