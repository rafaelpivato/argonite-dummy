import { BackgroundRuntime } from 'argonite-core';
import { CounterService } from './counter.service';

const runtime = new BackgroundRuntime();

runtime.registerService(CounterService);

runtime.registerMessageHandler('counter:increment', (_msg, ctx) => {
  const counter = ctx.getService(CounterService);
  return counter.increment();
});

runtime.start();
