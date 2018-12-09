import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NetworkService } from '../../commons/services/network-service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-search-result',
    templateUrl: './search-result.component.html'
})

export class SearchTagResultComponent implements OnInit, OnDestroy {
    public tag: string;
    public tagSearchDataList: any;
    public pageNumber: number;
    public totalPages: number = Number.MAX_SAFE_INTEGER;
    public showLoader = true;
    private routeSubscriber: any;

    constructor(private route: ActivatedRoute,
                private netowrk: NetworkService,
                private sanitization: DomSanitizer) { }

    ngOnInit() {
        this.routeSubscriber = this.route.params.subscribe(params => {
            this.tag = params['tag'];
            this.pageNumber = 0;
            this.totalPages = Number.MAX_SAFE_INTEGER;
            this.showLoader = true;

            this.tagSearchDataList = [];
            this.getSearchDataFortag(this.tag);
        });
    }

    ngOnDestroy() {
        this.routeSubscriber.unsubscribe();
    }

    private getSearchDataFortag(_tagParam: string) {
        this.showLoader = true;
        var _tag =  _tagParam;
        if (_tag.indexOf(' ') > -1){
            _tag = this.tag.split(' ').join(',');
            _tag += ',' + this.tag;
        }
        this.netowrk.getTagsSearchData(_tag, this.pageNumber).subscribe(response => {
            if (_tagParam == this.tag){
                this.tagSearchDataList = this.tagSearchDataList.concat(response.content);
                this.showLoader = false;
                if (response.metadata){
                    this.totalPages = response.metadata.totalPages;
                }
            }
        });
    }

    public onLoadMoreData() {
        if (this.showLoader || (this.pageNumber >= this.totalPages-1)){
            return;
        }
        this.pageNumber++;
        this.getSearchDataFortag(this.tag);
    }

    public getGroupSearchLink(data: any) {
        return '/search/' + data.category + '/' + data.group;
    }
    public getSanitizedGifUrl(data: any) {
        return this.sanitization.bypassSecurityTrustStyle(`url(${data.media.tiny.url})`);
    }
    public getGifMinHeight(data: any) {
        return `${data.media.actual.height - 20}px`;
    }
    private getGifMinHeightCover(data: any) {
      return `${data.media.actual.height + 40}px`;
    }
}
