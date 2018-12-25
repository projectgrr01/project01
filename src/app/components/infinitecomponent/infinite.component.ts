import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Masonry, MasonryGridItem } from 'ng-masonry-grid'; // import necessary datatypes
import { Router, NavigationStart, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UtilityService } from '../../commons/services/utility.service';

declare var $: any;
declare var window: any;

@Component({
    selector: 'app-infinite-component',
    template: `
            <ng-masonry-grid id="infinite-component"
                    [useAnimation]="false"
                    (onNgMasonryInit)="onNgMasonryInit($event)"

                    infiniteScroll
                    [infiniteScrollDistance]="1" [infiniteScrollThrottle]="20" 
                    [immediateCheck]="true" (scrolled)="dataScrolled()">
                <ng-masonry-grid-item #masonryItem id="{{'home-masonry-item-'+i}}"
                    [class.loaded]="showImageTile(i)" class="cardx loaded" *ngFor="let data of dataList;let i = index;">
                    <a class="img" *ngIf="dataBelogsToThisView(data)" routerLink="{{getEscapedUrl(data)}}" [queryParams]="getGetParams()">
                        <img [attr.height]="getImageHeight(masonryItem.offsetWidth, data)" [attr.src]="getSanitizedGifUrl(data)" (load)="showThisImg(i)">
                    </a>
                    <div class="inside">
                        <h3>{{getCategory(data)}} </h3>
                        <div class="description">{{getGroup(data)}} </div>
                    </div>
                </ng-masonry-grid-item>
            </ng-masonry-grid>
            `,
        styleUrls: ['../../../../node_modules/ng-masonry-grid/ng-masonry-grid.css']
})

export class InfiniteComponent implements OnInit, OnDestroy {
    @Input() dataList: Array<any> = [];
    @Output() loadMoreData: EventEmitter<boolean> = new EventEmitter();
    
    private _masonry: Masonry;
    private routeSubs: any = null;
    private routeEndSubs: any = null;

    public currentCategory = '';
    public imgDownloaded: Array<boolean> = [];

    constructor(private router: Router,
                private route: ActivatedRoute,
                private utility: UtilityService) {
                    this.dataList = [];
                    this.imgDownloaded = [];
                    this.routeSubs = this.router.events.pipe(
                        filter (event => event instanceof NavigationStart)
                    )
                    .subscribe((event:NavigationStart) => {
                        this.dataList = [];
                        this.imgDownloaded = [];
                        if (typeof($) !== 'undefined') {
                            $('.cardx').remove();
                            $('#home-infinite-component').html("");
                            $('#search-infinite-component').html("");
                        }
                    });
                    this.routeEndSubs = this.route.params.subscribe(params => {
                        if (this.currentCategory != params['category']){
                            this.dataList = [];
                            this.imgDownloaded = [];
                            if (typeof($) !== 'undefined') {
                                $('.cardx').remove();
                                $('#home-infinite-component').html("");
                                $('#search-infinite-component').html("");
                            }
                        }
                        this.currentCategory = params['category'];
                    });
                }

    public ngOnInit(){
        if (typeof($) !== 'undefined') {
            $('#infinite-component').html("");
        }
    }

    public ngOnDestroy(){
        if(this.routeSubs != null){
            this.routeSubs.unsubscribe();
        }
        if(this.routeEndSubs != null){
            this.routeEndSubs.unsubscribe();
        }
    }
    
    public onNgMasonryInit($event: Masonry) {
        this._masonry = $event;
    }

    public dataScrolled(): void {
        this.loadMoreData.emit(true);
    }

    public dataBelogsToThisView(data: any): boolean {
        var inList = (this.dataList.indexOf(data) > -1);
        return inList;
    }

    public reorderItems() {
        if (this._masonry) {
            this._masonry.reOrderItems();
        }
    }

    public showImageTile(index: number){
        return this.imgDownloaded[index] || index < this.utility.imagesChunkSize;
    }

    public getImageHeight(offsetWidth: number, data: any){
        var width = data.media.gif.regular.width;
        var height = data.media.gif.regular.height;
        height = height * (offsetWidth/width)
        return `${height}px`;
    }

    public getEscapedUrl(data: any) {
        return escape('/gifs/' + data.giftuid);
    }

    public getGetParams(){
        //{ 'u': 'app_client'}
        if (this.utility.account == "public"){
            return "";
        }
        return {'u':this.utility.account};
    }

    public getGroupSearchLink(data: any) {
        return '/search/' + data.category + '/' + data.group;
    }
    
    public showThisImg(index: number) {
        setTimeout(function(that){
            that.imgDownloaded[index] = true;
        }, 200, this);
    }
    
    public getCategory(data: any): string {
        return data.category_loc ? data.category_loc : data.category;
    }
    
    public getGroup(data: any): string {
        return data.group_loc ? data.group_loc : data.group;
    }
    
    public getSanitizedGifUrl(data: any) {
        //return this.sanitization.bypassSecurityTrustStyle(`url(${data.media.gif.regular.url})`);
        return data.media.gif.regular.url;
    }
    
    public getGifMinHeight(data: any) {
        return `${data.media.gif.regular.height}px`;
    }
    
    public getGifMinHeightCover(data: any) {
      return `${data.media.gif.regular.height}px`;
    }
}
