import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NetworkService } from '../../commons/services/network-service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-search-result',
    templateUrl: './search-result.component.html'
})

export class SearchTagResultComponent implements OnInit, OnDestroy {
    private tag: string;
    private routeSubscriber: any;
    private tagSearchDataList: any;
    private pageNumber: number;
    private showLoader = true;

    constructor(private route: ActivatedRoute,
                private netowrk: NetworkService,
                private sanitization: DomSanitizer) { }

    ngOnInit() {
        this.routeSubscriber = this.route.params.subscribe(params => {
            this.tag = params['tag'];
            this.pageNumber = 0;
            this.showLoader = true;

            this.tagSearchDataList = [];
            this.getSearchDataFortag();
        });
    }

    ngOnDestroy() {
        this.routeSubscriber.unsubscribe();
    }

    private getSearchDataFortag() {
        this.showLoader = true;
        this.netowrk.getTagsSearchData(this.tag, this.pageNumber).subscribe(response => {
            this.tagSearchDataList = this.tagSearchDataList.concat(response.content);
            this.showLoader = false;
        });
    }

    private onLoadMoreData() {
        this.pageNumber++;
        this.getSearchDataFortag();
    }

    private getGroupSearchLink(data: any) {
        return '/search/' + data.category + '/' + data.group;
    }
    private getSanitizedGifUrl(data: any) {
        return this.sanitization.bypassSecurityTrustStyle(`url(${data.media.tiny.url})`);
    }
    private getGifMinHeight(data: any) {
        return `${data.media.actual.height - 20}px`;
    }
    private getGifMinHeightCover(data: any) {
      return `${data.media.actual.height + 40}px`;
    }
}
