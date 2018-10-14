import { Component, OnInit, ViewChildren, QueryList, AfterViewInit, Sanitizer, OnDestroy } from '@angular/core';
import { NetworkService } from '../../commons/services/network-service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';

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
                private sanitization: DomSanitizer) {}

    ngOnInit(): void {
        this.routeSubscriber = this.route.params.subscribe(params => {
            this.imageData = {category: '', group: ''};
            this.imageUid = unescape(params['gifid']);
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
            this.populateGridData();
        }) ;
    }

    get shortenUrl(): string {
        if (this.imageData.category === '') {
            return '';
        }
        return this.imageData.media.gif.actual.shorten;
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
    public getSanitizedGifSrcUrl(data: any) {
        if (data.category === '') {
            return '';
        }
        return this.sanitization.bypassSecurityTrustResourceUrl(data.media.gif.actual.url);
    }
}
