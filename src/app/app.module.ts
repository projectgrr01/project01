import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { networkService } from './commons/services/network-service';
import { HttpModule } from '@angular/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { routing } from './app.routes';
import { SearchComponent } from './components/search/search.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { AppPageComponent } from './components/fullpage.component';
import { InfiniteComponent } from './components/infinitecomponent/infinite.component';

@NgModule({
  declarations: [
    AppComponent,
    AppPageComponent,
    HeaderComponent,
    HomeComponent,
    SearchComponent,
    InfiniteComponent
  ],
  imports: [
    BrowserModule, HttpModule, InfiniteScrollModule, routing
  ],
  providers: [
    networkService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
