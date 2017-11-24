import { APP_INITIALIZER, NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';

import { SocketIo } from './ng-io.service';
import { NgIoConfig } from './ng-io-config';

export function SocketFactory(config: NgIoConfig) {
  return new SocketIo(config);
}

export function AppInitFactory(socketIo: SocketIo, config: NgIoConfig) {
  return function() {
    if (config.connectOnAppLoad) {
      socketIo.connect();
    }
  };
}

export const SOCKET_CONFIG_TOKEN = new InjectionToken<NgIoConfig>('__SOCKET_IO_CONFIG__');

@NgModule({})
export class NgIoModule {
  static forRoot(config: NgIoConfig): ModuleWithProviders {
    return {
      ngModule: NgIoModule,
      providers: [
        {provide: SOCKET_CONFIG_TOKEN, useValue: {url: '', connectOnAppLoad: true, ...config}},
        {
          provide: SocketIo,
          useFactory: SocketFactory,
          deps: [SOCKET_CONFIG_TOKEN],
        },
        {
          provide: APP_INITIALIZER,
          useFactory: AppInitFactory,
          deps: [SocketIo, SOCKET_CONFIG_TOKEN],
          multi: true
        }
      ]
    };
  }
}
