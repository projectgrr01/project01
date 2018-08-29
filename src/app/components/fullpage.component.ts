import { Component } from '@angular/core';

@Component({
    selector: 'app-page',
    template: `
            <app-header></app-header>
            <router-outlet></router-outlet>
            `
})

export class AppPageComponent {
    constructor() {}
}
