import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgIoModule, NgIoConfig } from 'ng-io';

import { ChatComponent } from './chat.component';

const config: NgIoConfig = { url: 'http://localhost:8988', options: {} };

@NgModule({
  declarations: [
    ChatComponent
  ],
  imports: [
    BrowserModule,
    NgIoModule.forRoot(config)
  ],
  bootstrap: [ChatComponent]
})
export class AppModule {}
