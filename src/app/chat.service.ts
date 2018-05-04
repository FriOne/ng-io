import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { SocketIo } from 'ng-io';

@Injectable()
export class ChatService {

  constructor(private socket: SocketIo) {}

  getMessage() {
    return this.socket
      .fromEvent<any>('msg')
      .pipe(map((data: any) => data.msg));
  }

  sendMessage(msg: string) {
    this.socket.emit('msg', msg);
  }
}
