import { ModuleWithProviders } from '@angular/core';
import {Routes, RouterModule, Route, } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { SearchComponent } from './components/search/search.component';
import { AppPageComponent } from './components/fullpage.component';

const homeComponentRoute: Route = {path: '**', component: HomeComponent}
const searchPageRoute: Route = {path: 'search/:category', component: SearchComponent}
const searchCategoryPageRoute: Route = {path: 'search/:category/:group', component: SearchComponent}

const appRoutes: Routes = [
    {
      path: '',
      component: AppPageComponent,
      children: [searchPageRoute, searchCategoryPageRoute, homeComponentRoute]
    },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
