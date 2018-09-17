import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NetworkService } from './commons/services/network-service';
import { HttpModule } from '@angular/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { routing } from './app.routes';
import { SearchComponent } from './components/search/search.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { AppPageComponent } from './components/fullpage.component';
import { InfiniteComponent } from './components/infinitecomponent/infinite.component';
import {ShareModule} from './components/ng2share/share.module'
import { GifviewerComponent } from './components/gifviewer/gifviewer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchTagResultComponent } from './components/search-result/search-result.component';
import { FormsModule } from '@angular/forms';
import { UtilityService } from './commons/services/utility.service';

@NgModule({
  declarations: [
    AppComponent,
    AppPageComponent,
    HeaderComponent,
    HomeComponent,
    SearchComponent,
    GifviewerComponent,
    SearchTagResultComponent,
    InfiniteComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    InfiniteScrollModule,
    ShareModule,
    BrowserAnimationsModule
  ],
  providers: [
    NetworkService,
    UtilityService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
