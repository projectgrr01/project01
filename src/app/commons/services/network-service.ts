import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilityService } from './utility.service';

const subUrls: any = {
    CATEGORYURL: 'categories',
    GROUPS: '/groups',
    SEARCH: 'search'
}

@Injectable()
export class NetworkService {

    constructor (private http: Http,
                private utility: UtilityService) {
     }

    public getMenuCategories(): Observable<any> {
        return this.http.get(this.utility.baseApiUrl + subUrls.CATEGORYURL)
            .pipe(map(data => data.json()));
    }

    public getTrendingData(pageNumber: number): Observable<any> {
        /*coundn't use URLSearchParams due to SEO visibility*/
        let params = '?page=' + pageNumber.toString() + '&size=' + environment.sizeOfChunk.toString();
        return this.http.get(this.utility.baseApiUrl + environment.defaultCategory + params)
            .pipe(map(data => data.json()));
    }

    public getCategoryGroupsData(category: String): Observable<any> {
        return this.http.get(this.utility.baseApiUrl + category + subUrls.GROUPS)
            .pipe(map(data => data.json()));
    }

    public getCategoryGroupsCoverData(category: string, group: string): Observable<any> {
        return this.getCategoryGroupSearchData(category, group, 0, 1);
    }

    public getCategoryGroupsSearchData(category: string, group: string, pageNumber: number): Observable<any> {
        return this.getCategoryGroupSearchData(category, group, pageNumber, environment.sizeOfChunk);
    }

    public getTagsSearchData(tag: string, pageNumber: number): Observable<any> {
        return this.getTagSearchData(tag, pageNumber, environment.sizeOfChunk);
    }

    public getGifDataByUid(gifId: string): Observable<any> {
        return this.http.get(this.utility.baseApiUrl + gifId)
            .pipe(map(data => data.json()));
    }

    public getTagSearchData(tag: string, pageNumber: number, size: number): Observable<any> {
        let options = '?tags=' + tag + '&page=' + pageNumber.toString() + '&size=' + size.toString();
        return this.http.get(this.utility.baseApiUrl + subUrls.SEARCH + options)
            .pipe(map(data => data.json()));
    }

    private getCategoryGroupSearchData(category: string, group: string, pageNumber: number, size: number): Observable<any> {
        let options = '?category=' + category + '&group=' + group + '&page=' + pageNumber.toString() + '&size=' + size.toString();
        return this.http.get(this.utility.baseApiUrl + subUrls.SEARCH + options)
            .pipe(map(data => data.json()));
    }
}
