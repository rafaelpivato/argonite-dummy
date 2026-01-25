import { Service } from 'argonite-core';

export class CounterService extends Service {
  private count = 0;

  increment() {
    this.count++;
    return this.count;
  }
}
