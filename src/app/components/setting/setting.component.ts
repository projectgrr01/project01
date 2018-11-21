import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-setting',
    template: `
        <div class="up-pointer"></div>
        <h3>Languages</h3>
        <ul class="languages" data-columns="2">
            <li (click)="selectLanguage('hindi')">Hindi</li>
            <li (click)="selectLanguage('English')">English</li>
            <li (click)="selectLanguage('marathi')">Marathi</li>
            <li (click)="selectLanguage('punjabi')">Punjabi</li>
            <li (click)="selectLanguage('bangali')">Bangali</li>
            <li (click)="selectLanguage('kannad')">Kannad</li>
            <li (click)="selectLanguage('gurjati')">Gujrati</li>
            <li (click)="selectLanguage('telugu')">Telugu</li>
        </ul>
    `
})

export class SettingComponent {

    @Output() languageSelected: EventEmitter<string> = new EventEmitter();

    public selectLanguage(language: string) {
        console.log(language);
        this.languageSelected.emit('language_selected');
    }

}
