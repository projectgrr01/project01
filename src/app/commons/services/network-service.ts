import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const subUrls: any = {
    CATEGORYURL: 'categories/',
    GROUPS: '/groups'
}

@Injectable()
export class networkService {
    private baseSiteUrl;

    constructor (private http: Http) {
        this.baseSiteUrl = environment.site;
     }

    public getMenuCategories(): Observable<any> {
        return this.http.get(this.baseSiteUrl + subUrls.CATEGORYURL)
            .pipe(map(data => data.json()));
    }

    public getTrendingData(pageNumber: number): Observable<any> {
        let reqParams = new URLSearchParams();
        reqParams.set('page', pageNumber.toString());
        reqParams.set('size', environment.sizeOfChunk.toString());
        let options = new RequestOptions({ params: reqParams.toString() });
        return this.http.get(this.baseSiteUrl + environment.defaultCategory, options)
            .pipe(map(data => data.json()));
    }

    public getCategoryGroupsData(category: String): Observable<any> {
        return this.http.get(this.baseSiteUrl + category + subUrls.GROUPS)
            .pipe(map(data => data.json()));
    }
}
