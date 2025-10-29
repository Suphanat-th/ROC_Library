// src/main.server.ts
import { renderApplication } from '@angular/platform-server';
import { App } from './app/app';

export default function bootstrap(options: { document: string; url: string }) {
  return renderApplication(App, {
    document: options.document,
    url: options.url
  });
}
