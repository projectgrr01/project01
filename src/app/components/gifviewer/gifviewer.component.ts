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

    private imageData: any;
    private imageUid: string;
    private routeSubscriber: any;
    private mp4Url = environment.siteRootUrl + environment.pathNames.embedMp4;
    private webmUrl = environment.siteRootUrl + environment.pathNames.embedWebm;
    private embedUrl = environment.siteRootUrl + environment.pathNames.embedImg;

    private dataList: any[] = [];
    private showLoader = true;
    private currentPage = 0;

    constructor (private route: ActivatedRoute,
                private network: NetworkService,
                private sanitization: DomSanitizer) {}

    ngOnInit(): void {
        this.routeSubscriber = this.route.params.subscribe(params => {
            this.imageData = null;
            this.imageUid = unescape(params['gifid']);
            this.getGifData();
        });
        this.dataList = [];
        this.currentPage = 0;
        this.populateGridData();
    }

    ngOnDestroy() {
        this.routeSubscriber.unsubscribe();
    }
    private onLoadMoreData(): void {
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

    private getGifData(): void {
        this.network.getGifDataByUid(this.imageUid).subscribe(response => {
            this.imageData = response.content[0];
        }) ;
    }

    private getSanitizedGifUrl(data: any) {
        return this.sanitization.bypassSecurityTrustStyle(`url(${data.media.tiny.url})`);
    }
    private getSanitizedGifPageUrl(data: any): SafeUrl {
        return this.sanitization.bypassSecurityTrustUrl('/gifs/' + data.giftuid);
    }
    private getSanitizedGifSrcUrl(data: any) {
        return this.sanitization.bypassSecurityTrustResourceUrl(data.media.actual.url);
    }
}
