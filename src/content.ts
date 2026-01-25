import { ContentRuntime } from 'argonite-core';
import { ContentLoggerEntry } from './content.entry';

const runtime = new ContentRuntime();
runtime.mountEntry(new ContentLoggerEntry());
