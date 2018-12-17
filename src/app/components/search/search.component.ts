import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationStart, Route, Router } from '@angular/router';
import { NetworkService } from '../../commons/services/network-service';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { filter } from 'rxjs/operators';
import { Masonry, MasonryGridItem } from 'ng-masonry-grid';
import { UtilityService } from '../../commons/services/utility.service';

declare var $: any;

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['../../../../node_modules/ng-masonry-grid/ng-masonry-grid.css']
})

export class SearchComponent implements OnInit, OnDestroy {

    private routeSubs: any = null;

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
                private utility: UtilityService,
                private router: Router) { 
                    
                    this.routeSubs = this.router.events.pipe(
                        filter(event => event instanceof NavigationStart)
                    )
                    .subscribe((event:NavigationStart) => {
                        this.groupDataList = [];
                        this.categoryGroupsList = [];
                        this.imgDownloaded = [];
                        //this.removeAllItems();
                    });
                }

    ngOnInit() {
        this.routeSubscriber = this.route.params.subscribe(params => {
            //Harcoded for three images stripe in homapge
            this.utility.account = this.route.snapshot.queryParamMap.get('u');

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
            
            if (this.utility.account == "public"){
                if (this.group === '') {
                    this.getGroupsForCategory(this.category);
                } else {
                    this.getSearchData(this.category, this.group);
                }
            } else {
                //Harcoded for three images stripe in homapge
                this.getSearchData(this.category, "");
            }
        });
    }

    ngOnDestroy() {
        this.routeSubscriber.unsubscribe();
        if(this.routeSubs != null){
            this.routeSubs.unsubscribe();
        }
    }

    private getGroupsForCategory(cat: string) {
        this.showLoader = true;
        this.netowrk.getCategoryGroupsData(cat).subscribe(response => {
            //Check if data is not inserted for wrong search data
            if (cat == this.category && response.groups){
                this.categoryGroupsList = response.groups;
                this.onScrollGroups(true);
            }
        });
    }

    private getSearchData(cat: string, grp: string) {
        this.showLoader = true;
        this.netowrk.getCategoryGroupsSearchData(cat, grp, this.pageNumber).subscribe(response => {
            if (cat == this.category && grp == this.group){
                this.showLoader = false;
                for (var i=0; i<response.content.length; i++){
                    //added to recognize if result is from search page
                    response.content[i].searchCategory = cat;
                }
                this.categoryGroupSearchDataList = this.categoryGroupSearchDataList.concat(response.content);
                if (response.content.length > 0) {
                    this.display_category = response.content[0].category_loc ? response.content[0].category_loc : this.category;
                    this.display_group = response.content[0].group_loc ? response.content[0].group_loc : this.group;
                }
                if (response.metadata){
                    this.totalPages = response.metadata.totalPages;
                }
            } else {
                //commented because it can cause issue and remove relevant data
                //this.categoryGroupSearchDataList = [];
            }
        });
    }

    private getCoverImageForGroupTile(category: string, groups: string[]) {
        let tempDataList = [];
        let totalReqCount = groups.length;
        if (totalReqCount <= 0){
            this.showLoader = false;
            return;
        }
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
                } else {
                    tempDataList = [];
                    return;
                }
            });
        }
    }

    private onScrollGroups(firstTime: boolean) {
        if (this.currentGroupChunkStartIndex > this.categoryGroupsList.length){
            this.showLoader = false;
            return;
        }
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
        return (this.group !== '' || this.categoryGroupSearchDataList.length > 0);
    }

    public onLoadMoreData() {
        if (this.showLoader || (this.pageNumber >= this.totalPages-1)){
            return;
        }
        this.showLoader = true;
        this.pageNumber++;
        this.getSearchData(this.category, this.group);
    }

    public showImageTile(index: number){
        return this.imgDownloaded[index] || index < this.utility.imagesChunkSize;
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

    public getImageHeight(offsetWidth: number, data: any){
        var width = data.media.gif.regular.width;
        var height = data.media.gif.regular.height;
        height = height * (offsetWidth/width)
        return `${height}px`;
    }

    public getSanitizedGifUrl(data: any) {
        return data.media.gif.tiny.url;
    }
    public getGifMinHeight(data: any) {
        return `${data.media.gif.actual.height - 20}px`;
    }
    private getGifMinHeightCover(data: any) {
      return `${data.media.gif.actual.height + 40}px`;
    }
}
