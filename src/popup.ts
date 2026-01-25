import { PageRuntime } from 'argonite-core';
import { PopupEntry } from './popup.entry';

const runtime = new PageRuntime();
runtime.mountEntry(new PopupEntry());
