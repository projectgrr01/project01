import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NetworkService } from '../../commons/services/network-service';
import { DomSanitizer } from '@angular/platform-browser';
import { UtilityService } from '../../commons/services/utility.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['../../../../node_modules/ng-masonry-grid/ng-masonry-grid.css']
})

export class SearchComponent implements OnInit, OnDestroy {

    public showLoader = true;
    public category: string;
    public group: string;
    public categoryGroupsList: string[];
    public currentGroupChunkStartIndex: number;
    public currentGroupChunkLength: number;
    public routeSubscriber: any;
    public groupDataList: any;
    public categoryGroupSearchDataList: any;
    public pageNumber: number;

    constructor(private route: ActivatedRoute,
                private netowrk: NetworkService,
                private sanitization: DomSanitizer,
                private utility: UtilityService) { }

    ngOnInit() {
        this.routeSubscriber = this.route.params.subscribe(params => {
            this.category = params['category'];
            this.group = params['group'] || '';
            this.pageNumber = 0;

            this.categoryGroupsList = [];
            this.groupDataList = [];
            this.currentGroupChunkStartIndex = 0;
            this.currentGroupChunkLength = 10;
            this.categoryGroupSearchDataList = [];
            if (this.group === '') {
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
            this.netowrk.getCategoryGroupsCoverData(category, group[this.utility.language]).subscribe(response => {
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

    get showGroupData(): boolean {
        return this.group !== '';
    }

    public onLoadMoreData() {
        this.pageNumber++;
        this.getSearchData();
    }

    public getGroupSearchLink(data: any) {
        return '/search/' + data.category + '/' + data.group;
    }
    public getSanitizedGifUrl(data: any) {
        return this.sanitization.bypassSecurityTrustStyle(`url(${data.media.gif.tiny.url})`);
    }
    public getGifMinHeight(data: any) {
        return `${data.media.gif.actual.height - 20}px`;
    }
    private getGifMinHeightCover(data: any) {
      return `${data.media.gif.actual.height + 40}px`;
    }
}
