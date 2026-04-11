import { BackgroundRuntime } from 'argonite-core';
import { CounterService } from './counter.service';

const runtime = new BackgroundRuntime();

runtime.registerService(CounterService, {
  inject: ['storage'],
});

runtime.registerMessageHandler('counter:get', (_msg, ctx) => {
  const counter = ctx.getService(CounterService);
  return counter.getCount();
});

runtime.registerMessageHandler('counter:lifecycle:get', (_msg, ctx) => {
  const counter = ctx.getService(CounterService);
  return counter.getLifecycleState();
});

runtime.registerMessageHandler('counter:increment', (_msg, ctx) => {
  const counter = ctx.getService(CounterService);
  const value = counter.increment();
  void runtime.broadcast('counter:updated', { value });
  return value;
});

runtime.registerMessageHandler('runtime:dispose', (_msg, ctx) => {
  const counter = ctx.getService(CounterService);
  const before = counter.getLifecycleState();

  runtime.dispose();

  const after = counter.getLifecycleState();

  return {
    disposed: true,
    before,
    after,
  };
});

runtime.start();

chrome.runtime.onSuspend.addListener(() => {
  runtime.dispose();
});
