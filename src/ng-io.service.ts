import { Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import Socket = SocketIOClient.Socket;

const io = require('socket.io/lib/client');

import { NgIoConfig } from './ng-io-config';
import { SOCKET_CONFIG_TOKEN } from './ng-io.module';

export class SocketIo {
  subscribersCounter = 0;
  ioSocket: Socket;
  private initialized = false;

  constructor(@Inject(SOCKET_CONFIG_TOKEN) private config: NgIoConfig) {}

  on(eventName: string, callback: Function) {
    this.ioSocket.on(eventName, callback);
  }

  once(eventName: string, callback: Function) {
    this.ioSocket.once(eventName, callback);
  }

  connect() {
    if (!this.initialized) {
      const {url, options} = this.config;
      this.ioSocket = io(url, options);
    } else {
      this.ioSocket = this.ioSocket.connect();
    }
    return this.ioSocket;
  }

  disconnect(close?: any) {
    return this.ioSocket.disconnect.apply(this.ioSocket, arguments);
  }

  emit(eventName: string, data?: any, callback?: Function) {
    return this.ioSocket.emit.apply(this.ioSocket, arguments);
  }

  removeListener(eventName: string, callback?: Function) {
    return this.ioSocket.removeListener.apply(this.ioSocket, arguments);
  }

  removeAllListeners(eventName?: string) {
    return this.ioSocket.removeAllListeners.apply(this.ioSocket, arguments);
  }

  fromEvent<T>(eventName: string): Observable<T> {
    this.subscribersCounter++;
    return Observable.create((observer: any) => {
      this.ioSocket.on(eventName, (data: T) => {
        observer.next(data);
      });
      return () => {
        if (this.subscribersCounter === 1) {
          this.ioSocket.removeListener(eventName);
        }
      };
    }).share();
  }

  /* Creates a Promise for a one-time event */
  fromEventOnce<T>(eventName: string): Promise<T> {
    return new Promise<T>(resolve => this.once(eventName, resolve));
  }
}
