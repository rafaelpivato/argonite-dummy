# Argonite Dummy

Argonite Dummy is a minimal Chrome extension used to exercise and validate
runtime behavior from `argonite-core`.

It is intentionally small and focused on practical runtime flows:

- background authority with service registration
- capability injection (`storage`)
- page and content clients
- authority-to-client broadcast
- service lifecycle hooks (`onStart` / `onDispose`)

## What It Demonstrates

The dummy currently demonstrates these `argonite-core` concepts in real code:

- `BackgroundRuntime` as authority
- `CounterService` as a developer-authored service
- service-declared required capabilities (`CounterService.requiredCapabilities`)
- explicit message wiring for straightforward routes
- explicit message handlers for orchestration-heavy routes
- broadcast events (`counter:updated`) from authority to clients
- `PageRuntime` and `ContentRuntime` client subscriptions
- runtime-managed suspend disposal with explicit `runtime.dispose()` support

## Project Layout

- `src/background.ts`: authority runtime wiring, handlers, broadcast, and lifecycle hooks
- `src/counter.service.ts`: counter state, storage persist, lifecycle state
- `src/popup.ts` + `src/popup.entry.ts`: popup entry and UI client behavior
- `src/content.ts` + `src/content.entry.ts`: content entry and broadcast log behavior
- `manifest.json`: MV3 manifest and permissions

## Prerequisites

- Node.js 18+
- pnpm

`argonite-dummy` depends on local `argonite-core` via `file:../argonite-core`.

## Setup

Build core first, then build dummy.

```bash
cd ../argonite-core
pnpm install
pnpm run build

cd ../argonite-dummy
pnpm install
pnpm run build
```

## Load In Chrome

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Click Load unpacked.
4. Select the `argonite-dummy` folder.
5. After code changes, run `pnpm run build` and click Reload on the extension.

## Runtime Contract (Current)

### Request/Response messages

- `counter:get` -> `number`
- `counter:increment` -> `number`
- `counter:lifecycle:get` -> `{ count, disposeCount, lastDisposedAt }`
- `runtime:dispose` -> `{ disposed, before, after }` (debug/validation endpoint)

### Broadcast event

- `counter:updated` with payload `{ value: number }`

Produced by background and consumed by popup/content clients.

## Manual Validation

### Counter + storage flow

1. Open popup and click Increment.
2. Close and reopen popup.
3. Confirm count is restored.

### Broadcast flow

1. Keep popup open.
2. Open a normal web page tab (not `chrome://...`).
3. In page console, verify content script active log appears.
4. Click Increment in popup.
5. Confirm popup count updates and content tab logs broadcast value.

### Disposal flow (deterministic, debug)

Run from popup DevTools console:

```js
chrome.runtime.sendMessage({ type: 'runtime:dispose' }, console.log);
```

Expected: response includes `before` and `after`, where `after.disposeCount`
is greater than `before.disposeCount`.

## Dev Scripts

- `pnpm run build`: build background/popup + content bundles
- `pnpm run watch`: watch builds for both pipelines

## Notes

- This repository is a practical sandbox, not a production extension.
- Some debug handlers are intentionally present to validate lifecycle behavior.
- MV3 service worker teardown is non-deterministic for manual log inspection,
  so deterministic message-based checks are preferred for lifecycle validation.
