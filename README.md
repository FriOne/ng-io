# Angular 4+ module for socket.io

It is fork from https://github.com/bougarfaoui/ng-socket-io

I have add Angular 5 SSR support and made the library with https://github.com/gonzofish/angular-librarian

Also, I have add option `connectOnAppLoad` which allow socket to connect on app load (true by default).

## Install
```
npm install socket.io
npm install ng-socket-io
```

## How to use

### Import and configure NgIoModule

```ts
//...
import { NgIoModule, NgIoConfig } from 'ng-io';

const config: NgIoConfig = { url: 'http://localhost:8988', options: {} };

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

We need to configure ```NgIoModule``` module using the object ```config``` of type ```NgIoConfig```, this object accepts two optional properties they are the same used here [io(url[, options])](https://github.com/socketio/socket.io-client/blob/master/docs/API.md#iourl-options).

Now we pass the configuration to the static method ```forRoot``` of ```NgIoModule```

### Using your socket Instance

The ```NgIoModule``` provides now a configured ```SocketIo``` service that can be injected anywhere inside the ```AppModule```.

```typescript
import { Injectable } from '@angular/core';
import { SocketIo } from 'ng-socket-io';

@Injectable()
export class ChatService {

    constructor(private socket: SocketIo) { }

    sendMessage(msg: string){
        this.socket.emit("message", msg);
    }

    getMessage() {
        return this.socket
            .fromEvent("message")
            .map( data => data.msg );
    }
}
```

### Using multiple sockets with different end points

In this case we do not configure the ```NgIoModule``` directly using ```forRoot```. What we have to do is: extend the ```SocketIo``` service, and call ```super()``` with the ```NgIoConfig``` object type (passing ```url``` & ```options``` if any).

```typescript
import { Injectable, NgModule } from '@angular/core';
import { SocketIo } from 'ng-socket-io';

@Injectable()
export class SocketOne extends SocketIo {

    constructor() {
        super({ url: 'http://url_one:portOne', options: {} });
    }

}

@Injectable()
export class SocketTwo extends SocketIo {

    constructor() {
        super({ url: 'http://url_two:portTwo', options: {} });
    }

}

@NgModule({
  declarations: [
    //components
  ],
  imports: [
    NgIoModule,
    //...
  ],
  providers: [SocketOne, SocketTwo],
  bootstrap: [/** AppComponent **/]
})
export class AppModule { }

```

Now you can inject ```SocketOne```, ```SocketTwo``` in any other services and / or components.


## API

Most of the functionalities here you are already familiar with.

The only addition is the ```fromEvent``` method, which returns an ```Observable``` that you can subscribe to.

### `socket.on(eventName: string)`
Takes an event name and callback.
Works the same as in SocketIo.IO.

### `socket.removeListener(eventName: string, callback: Function)`
Takes an event name and callback.
Works the same as in SocketIo.IO.

### `socket.removeAllListeners(eventName: string)`
Takes an event name.
Works the same as in SocketIo.IO.

### `socket.emit(eventName:string, message: any, [callback: Function])`
Sends a message to the server.
Optionally takes a callback.
Works the same as in SocketIo.IO.

### `socket.fromEvent<T>(eventName: string): Observable<T>`
Takes an event name and returns an Observable that you can subscribe to.

### socket.fromEventOnce<T>(eventName: string): Promise<T>
Takes an event name, and returns a Promise instead of an Observable.
Works the same as `once` in SocketIo.IO.

You should keep a reference to the Observable subscription and unsubscribe when you're done with it.
This prevents memory leaks as the event listener attached will be removed (using ```socket.removeListener```) ONLY and when/if you unsubscribe.

If you have multiple subscriptions to an Observable only the last unsubscription will remove the listener.

##### Example

You can also see this [example](https://github.com/bougarfaoui/ng-socket-io/tree/master/examples/chat-app) with express.js.

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

import { NgIoModule, NgIoConfig, SocketIo} from 'ng-socket-io';

const config: NgIoConfig = { url: 'http://localhost:8988', options: {} };

@Injectable()
class ChatService {

    constructor(private socket: SocketIo) { }

    sendMessage(msg: string){
        this.socket.emit("message", msg);
    }

    getMessage() {
        return this.socket
            .fromEvent<any>("message")
            .map(data => data.msg );
    }

    close() {
      this.socket.disconnect()
    }
}


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgIoModule.forRoot(config)
  ],
  providers: [ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
``

## LICENSE

MIT