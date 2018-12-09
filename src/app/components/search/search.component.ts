import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NetworkService } from '../../commons/services/network-service';
import { DomSanitizer } from '@angular/platform-browser';
import { UtilityService } from '../../commons/services/utility.service';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['../../../../node_modules/ng-masonry-grid/ng-masonry-grid.css']
})

export class SearchComponent implements OnInit, OnDestroy {

    public showLoader = true;
    public category: string;
    public group: string;
    public display_category: string;
    public display_group: string;
    public categoryGroupsList: string[];
    public currentGroupChunkStartIndex: number;
    public currentGroupChunkLength: number;
    public routeSubscriber: any;
    public groupDataList: any;
    public categoryGroupSearchDataList: any;
    public pageNumber: number = 0;
    public totalPages: number = Number.MAX_SAFE_INTEGER;
    public imgDownloaded: Array<boolean> = [];

    constructor(private route: ActivatedRoute,
                private netowrk: NetworkService,
                private sanitization: DomSanitizer,
                private utility: UtilityService) { }

    ngOnInit() {
        this.routeSubscriber = this.route.params.subscribe(params => {
            this.category = params['category'];
            this.group = params['group'] || '';
            this.display_category = this.group;
            this.display_group = this.group;
            this.pageNumber = 0;
            this.totalPages = Number.MAX_SAFE_INTEGER;

            this.categoryGroupsList = [];
            this.groupDataList = [];
            this.currentGroupChunkStartIndex = 0;
            this.currentGroupChunkLength = environment.sizeOfChunk;
            this.categoryGroupSearchDataList = [];
            if (this.group === '') {
                this.getGroupsForCategory(this.category);
            } else {
                this.getSearchData(this.category, this.group);
            }
        });
    }

    ngOnDestroy() {
        this.routeSubscriber.unsubscribe();
    }

    private getGroupsForCategory(cat: string) {
        this.showLoader = true;
        this.netowrk.getCategoryGroupsData(cat).subscribe(response => {
            //Check if data is not inserted for wrong search data
            if (cat == this.category){
                this.categoryGroupsList = response.groups;
                this.onScrollGroups(true);
            }
        });
    }

    private getSearchData(cat: string, grp: string) {
        this.showLoader = true;
        this.netowrk.getCategoryGroupsSearchData(cat, grp, this.pageNumber).subscribe(response => {
            this.categoryGroupSearchDataList = this.categoryGroupSearchDataList.concat(response.content);
            this.showLoader = false;
            if (cat == this.category && grp == this.group){
                if (response.content.length > 0) {
                    this.display_category = response.content[0].category_loc ? response.content[0].category_loc : this.category;
                    this.display_group = response.content[0].group_loc ? response.content[0].group_loc : this.group;
                }
                if (response.metadata){
                    this.totalPages = response.metadata.totalPages;
                }
            }
        });
    }

    private getCoverImageForGroupTile(category: string, groups: string[]) {
        let tempDataList = [];
        let totalReqCount = groups.length;
        for (let group of groups) {
            this.netowrk.getCategoryGroupsCoverData(category, group[environment.defaultLanguage]).subscribe(response => {
                if (category == this.category){
                    if (response.content && response.content.length > 0) {
                        tempDataList.push(response.content[0]);
                        this.display_category = response.content[0].category_loc ? response.content[0].category_loc : this.category;
                    }
                    if (--totalReqCount === 0) {
                        this.groupDataList = this.groupDataList.concat(tempDataList);
                        this.showLoader = false;
                    }
                }
            });
        }
    }

    private onScrollGroups(firstTime: boolean) {
        if(this.showLoader && !firstTime){
            return;
        }
        this.showLoader = true;
        let categoryGroupPart: any[] = this.categoryGroupsList
            .slice(this.currentGroupChunkStartIndex, this.currentGroupChunkStartIndex + this.currentGroupChunkLength);
        this.currentGroupChunkStartIndex += this.currentGroupChunkLength;
        this.getCoverImageForGroupTile(this.category, categoryGroupPart);
    }

    get showGroupData(): boolean {
        return this.group !== '';
    }

    public onLoadMoreData() {
        if (this.showLoader || (this.pageNumber >= this.totalPages-1)){
            return;
        }
        this.showLoader = true;
        this.pageNumber++;
        this.getSearchData(this.category, this.group);
    }

    public getGroupSearchLink(data: any) {
        return '/search/' + data.category + '/' + data.group;
    }

    public getGroup(data: any): string {
        return data.group_loc ? data.group_loc : data.group;
    }
    
    public showThisImg(index: number) {
        setTimeout(function(that){
            that.imgDownloaded[index] = true;
        }, 1000, this);
    }

    public getSanitizedGifUrl(data: any) {
        //return this.sanitization.bypassSecurityTrustStyle(`url(${data.media.gif.tiny.url})`);
        return data.media.gif.tiny.url;
    }
    public getGifMinHeight(data: any) {
        return `${data.media.gif.actual.height - 20}px`;
    }
    private getGifMinHeightCover(data: any) {
      return `${data.media.gif.actual.height + 40}px`;
    }
}
