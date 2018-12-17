import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-setting',
    template: `
        <div class="up-pointer"></div>
        <h3>Languages</h3>
        <ul class="languages" data-columns="2">
            <li (click)="selectLanguage('hindi')">Hindi</li>
            <li (click)="selectLanguage('english')">English</li>
            <li (click)="selectLanguage('marathi')">Marathi</li>
            <li (click)="selectLanguage('punjabi')">Punjabi</li>
            <li (click)="selectLanguage('bengali')">Bangali</li>
            <li (click)="selectLanguage('kannada')">Kannada</li>
            <li (click)="selectLanguage('gujarati')">Gujarati</li>
            <li (click)="selectLanguage('telugu')">Telugu</li>
            <li (click)="selectLanguage('malayalam')">Malayalam</li>
            <li (click)="selectLanguage('tamil')">Tamil</li>
        </ul>
    `
})

export class SettingComponent {

    @Output() languageSelected: EventEmitter<string> = new EventEmitter();

    public selectLanguage(language: string) {
        this.languageSelected.emit(language);
    }

}
