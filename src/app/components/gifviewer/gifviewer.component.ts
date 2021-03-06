import { Component, OnInit, ViewChildren, QueryList, AfterViewInit, Sanitizer, OnDestroy } from '@angular/core';
import { NetworkService } from '../../commons/services/network-service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { UtilityService } from '../../commons/services/utility.service';

@Component({
  selector: 'app-gif-viewer',
  templateUrl: './gifviewer.template.html'
})

export class GifviewerComponent implements OnInit, OnDestroy {

    public imageData: any = {category: '', group: ''};
    public imageUid: string;
    public routeSubscriber: any;
    public mp4Url = environment.siteRootUrl + environment.pathNames.embedMp4;
    public webmUrl = environment.siteRootUrl + environment.pathNames.embedWebm;
    public embedUrl = environment.siteRootUrl + environment.pathNames.embedImg;

    public dataList: any[] = [];
    public showLoader = true;
    public currentPage = 0;

    constructor (private route: ActivatedRoute,
                private network: NetworkService,
                private sanitization: DomSanitizer,
                private utility: UtilityService) {}

    ngOnInit(): void {
        this.routeSubscriber = this.route.params.subscribe(params => {
            this.imageData = {category: '', group: ''};
            this.imageUid = unescape(params['gifid']);
            this.utility.account = this.route.snapshot.queryParamMap.get('u');

            this.getGifData();
        });
    }

    ngOnDestroy() {
        this.routeSubscriber.unsubscribe();
    }

    public onLoadMoreData(): void {
        this.populateGridData();
    }

    private populateGridData() {
        this.showLoader = true;
        this.network.getCategoryGroupsSearchData(this.imageData.category, this.imageData.group, this.currentPage)
            .subscribe(response => {
            this.currentPage++;
            this.dataList = this.dataList.concat(response.content);
            this.showLoader = false;
        });
    }

    public getGifData(): void {
        this.network.getGifDataByUid(this.imageUid).subscribe(response => {
            this.imageData = response;
            this.dataList = [];
            this.currentPage = 0;
            if (this.currentPage == 0)
                this.populateGridData();
        }) ;
    }

    get shortenUrl(): string {
        if (this.imageData.category === '') {
            return '';
        }
        return this.imageData.media.gif.actual.shorten;
    }

    public getCategory(data: any): string {
        return data.category_loc ? data.category_loc : data.category;
    }

    public getGroup(data: any): string {
        return data.group_loc ? data.group_loc : data.group;
    }

    public getSanitizedGifUrl(data: any) {
        if (data.category === '') {
            return '';
        }
        return this.sanitization.bypassSecurityTrustStyle(`url(${data.media.gif.tiny.url})`);
    }
    public getSanitizedGifPageUrl(data: any): SafeUrl {
        if (data.category === '') {
            return '';
        }
        return this.sanitization.bypassSecurityTrustUrl('/gifs/' + data.giftuid);
    }
    public getGifUrl(data: any) {
        console.log(data);
        if (!data || data.category === '') {
            return '';
        }
        return (data.media.gif.actual.url);
    }
    public getSanitizedGifSrcUrl(data: any) {
        if (!data || data.category === '') {
            return '';
        }
        return this.sanitization.bypassSecurityTrustResourceUrl(data.media.gif.actual.url);
    }
}
