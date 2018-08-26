import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { networkService } from './commons/services/network-service';
import { HttpModule } from '@angular/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, HttpModule, InfiniteScrollModule
  ],
  providers: [
    networkService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
