import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable()
export class UtilityService {
    private _baseApiUrl: string;
    private currentLanguage: string;

    constructor () {
        this._baseApiUrl = environment.apiUrl;
        this.currentLanguage = environment.defaultLanguage;
    }

    get language(): string {
        return this.currentLanguage;
    }

    get baseApiUrl(): string {
        return this._baseApiUrl;
    }
}