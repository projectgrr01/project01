import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable()
export class UtilityService {
    private _baseApiUrl: string;
    private currentLanguage: string;

    constructor () {
    	try{
            this._baseApiUrl = environment.apiUrl;
	    this.currentLanguage = localStorage['lang'] ? localStorage['lang'] : environment.defaultLanguage;
	} catch(e){}
    }

    get language(): string {
        return this.currentLanguage;
    }

    get baseApiUrl(): string {
        return this._baseApiUrl;
    }

    set language(lang: string) {
        this.currentLanguage = lang;
    }
}
