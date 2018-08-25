import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgGridModule } from 'angular2-grid';

import { AppComponent } from './app.component';
import { networkService } from './commons/services/network-service';
import { HttpModule } from '@angular/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, HttpModule//, NgGridModule
  ],
  providers: [
    networkService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
