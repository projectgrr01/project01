import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NetworkService } from '../../commons/services/network-service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html'
})

export class SearchComponent implements OnInit, OnDestroy {

    private showLoader = true;
    private category: string;
    private group: string;
    private categoryGroupsList: string[];
    private currentGroupChunkStartIndex: number;
    private currentGroupChunkLength: number;
    private routeSubscriber: any;
    private groupDataList: any;
    private categoryGroupSearchDataList: any;
    private pageNumber: number;

    constructor(private route: ActivatedRoute,
                private netowrk: NetworkService,
                private sanitization: DomSanitizer) { }

    ngOnInit() {
        this.routeSubscriber = this.route.params.subscribe(params => {
            this.category = params['category'];
            this.group = params['group'];
            this.pageNumber = 0;

            this.categoryGroupsList = [];
            this.groupDataList = [];
            this.currentGroupChunkStartIndex = 0;
            this.currentGroupChunkLength = 10;
            this.categoryGroupSearchDataList = [];
            if (this.group == undefined) {
                this.getGroupsForCategory();
            } else {
                this.getSearchData();
            }
        });
    }

    ngOnDestroy() {
        this.routeSubscriber.unsubscribe();
    }

    private getGroupsForCategory() {
        this.showLoader = true;
        this.netowrk.getCategoryGroupsData(this.category).subscribe(response => {
            this.categoryGroupsList = response.groups;
            this.onScrollGroups();
        });
    }

    private getSearchData() {
        this.showLoader = true;
        this.netowrk.getCategoryGroupsSearchData(this.category, this.group, this.pageNumber).subscribe(response => {
            this.categoryGroupSearchDataList = this.categoryGroupSearchDataList.concat(response.content);
            this.showLoader = false;
        });
    }

    private getCoverImageForGroupTile(category: string, groups: string[]) {
        let tempDataList = [];
        let totalReqCount = groups.length;
        for (let group of groups) {
            this.netowrk.getCategoryGroupsCoverData(category, group).subscribe(response => {
                if (response.content && response.content.length > 0) {
                    tempDataList.push(response.content[0]);
                }
                if (--totalReqCount === 0) {
                    this.groupDataList = this.groupDataList.concat(tempDataList);
                    this.showLoader = false;
                }
            });
        }
    }

    private onScrollGroups() {
        let categoryGroupPart: any[] = this.categoryGroupsList
            .slice(this.currentGroupChunkStartIndex, this.currentGroupChunkStartIndex + this.currentGroupChunkLength);
        this.currentGroupChunkStartIndex += this.currentGroupChunkLength;
        this.getCoverImageForGroupTile(this.category, categoryGroupPart);
    }

    private onLoadMoreData() {
        this.pageNumber++;
        this.getSearchData();
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
