import { BackgroundRuntime } from 'argonite-core';
import { CounterService } from './counter.service';

const runtime = new BackgroundRuntime();

runtime.registerService(CounterService);

runtime.registerServiceMessage('counter:get', CounterService, 'getCount');
runtime.registerServiceMessage('counter:lifecycle:get', CounterService, 'getLifecycleState');

runtime.registerMessageHandler('counter:increment', async (_msg, ctx) => {
  const counter = ctx.getService(CounterService);
  const value = await counter.increment();
  void runtime.broadcast('counter:updated', { value });
  return value;
});

runtime.registerMessageHandler('runtime:dispose', async (_msg, ctx) => {
  const counter = ctx.getService(CounterService);
  const before = await counter.getLifecycleState();

  runtime.dispose();

  const after = await counter.getLifecycleState();

  return {
    disposed: true,
    before,
    after,
  };
});

runtime.start();
