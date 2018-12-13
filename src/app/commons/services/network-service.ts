import { Injectable, OnDestroy } from '@angular/core';
import { Http, Response, RequestOptions, ResponseContentType } from '@angular/http';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil, filter } from 'rxjs/operators';
import { UtilityService } from './utility.service';
import { Router, NavigationStart } from '@angular/router';

const subUrls: any = {
    CATEGORYURL: 'categories',
    GROUPS: '/groups',
    SEARCH: 'search'
}

@Injectable()
export class NetworkService implements OnDestroy {
    private shouldCancelNetworkCalls = false;
    protected ngUnsubscribe: Subject<void> = new Subject<void>();
    private routeSubs: any = null;

    constructor (private http: Http,
                private router: Router,
                private utility: UtilityService) {
                    this.router.events.pipe(
                        filter (event => event instanceof NavigationStart)
                    )
                    .subscribe((event:NavigationStart) => {
                        if(this.shouldCancelNetworkCalls){
                            this.ngUnsubscribe.next();
                        }
                        //The flag for first time navigation started
                        this.shouldCancelNetworkCalls = true;
                    });
                }

    public ngOnDestroy(){
        if(this.routeSubs != null){
            this.routeSubs.unsubscribe();
        }
    }

    public getMenuCategories(): Observable<any> {
        return this.http.get(this.utility.baseApiUrl + subUrls.CATEGORYURL + '?lang=' + this.utility.language)
            .pipe(map(data => data.json()));
    }

    public getTrendingData(pageNumber: number): Observable<any> {
        /*coundn't use URLSearchParams due to SEO visibility*/
        let params = '?page=' + pageNumber.toString() + '&size=' + environment.sizeOfChunk.toString()
                    + '&lang=' + this.utility.language;
        return this.http.get(this.utility.baseApiUrl + environment.defaultCategory + params)
            .pipe(takeUntil(this.ngUnsubscribe))
            .pipe(map(data => data.json()));
    }

    public getCategoryGroupsData(category: String): Observable<any> {
        return this.http.get(this.utility.baseApiUrl + category + subUrls.GROUPS)
            .pipe(takeUntil(this.ngUnsubscribe))
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
        return this.http.get(this.utility.baseApiUrl + gifId + '?lang=' + this.utility.language)
            .pipe(takeUntil(this.ngUnsubscribe))
            .pipe(map(data => data.json()));
    }

    public getBlobDataFromUrl(url: string) {
        let options = new RequestOptions({responseType: ResponseContentType.Blob });
        return this.http.get(url, options)
            .pipe(takeUntil(this.ngUnsubscribe))
            .pipe(map(data => data.blob()));
    }

    public getTagSearchData(tag: string, pageNumber: number, size: number): Observable<any> {
        let options = '?tags=' + tag + '&page=' + pageNumber.toString() + '&size=' + size.toString()
                        + '&lang=' + this.utility.language;
        return this.http.get(this.utility.baseApiUrl + subUrls.SEARCH + options)
            .pipe(takeUntil(this.ngUnsubscribe))
            .pipe(map(data => data.json()));
    }

    private getCategoryGroupSearchData(category: string, group: string, pageNumber: number, size: number): Observable<any> {
        let options = '?category=' + category + '&group=' + group + '&page=' + pageNumber.toString() + '&size=' + size.toString()
                        + '&lang=' + this.utility.language;
        return this.http.get(this.utility.baseApiUrl + subUrls.SEARCH + options)
            .pipe(takeUntil(this.ngUnsubscribe))
            .pipe(map(data => data.json()));
    }
}
