import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable()
export class UtilityService {
    private _baseApiUrl: string;
    private currentLanguage: string;
    private currentAccount: string = "public";

    constructor () {
    	try{
            this._baseApiUrl = environment.apiUrl;
            this.currentAccount = "public";
            this.currentLanguage = localStorage['lang'] ? localStorage['lang'] : environment.defaultLanguage;
	    } catch(e){}
    }

    get baseApiUrl(): string {
        return this._baseApiUrl;
    }

    get account(): string {
        return this.currentAccount;
    }

    get accountPath(): string {
        return this.account + "/";
    }

    set account(acc: string) {
        if (!acc || acc == "" || acc == null){
            this.currentAccount = "public";
        } else {
            this.currentAccount = acc;
        }
    }

    get language(): string {
        return this.currentLanguage;
    }

    set language(lang: string) {
        this.currentLanguage = lang;
    }
}
