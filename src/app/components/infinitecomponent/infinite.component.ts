import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Masonry, MasonryGridItem } from 'ng-masonry-grid'; // import necessary datatypes
import { Router, NavigationStart, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

declare var $: any;

@Component({
    selector: 'app-infinite-component',
    template: `
            <ng-masonry-grid id="infinite-component"
                    [masonryOptions]= "{transitionDuration: '0s', gutter: 10, horizontalOrder: true }"
                    [useAnimation]= "false"
                    [useImagesLoaded]= "true"
                    (onNgMasonryInit)="onNgMasonryInit($event)"
                    
                    infiniteScroll
                    [infiniteScrollDistance]="1" [infiniteScrollThrottle]="20" 
                    [immediateCheck]="true" (scrolled)="dataScrolled()">
                <ng-masonry-grid-item id="{{'home-masonry-item-'+i}}" 
                    [class.loaded]="imgDownloaded[i]" class="cardx" *ngFor="let data of dataList;let i = index;">
                    <a class="img" *ngIf="dataBelogsToThisView(data)" routerLink="{{getEscapedUrl(data)}}">
                        <img [attr.src]="getSanitizedGifUrl(data)" (load)="showThisImg(i)">
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
    
    _masonry: Masonry;
    masonryItems: any[]; // NgMasonryGrid Grid item list
    private routeSubs: any = null;
    private routeEndSubs: any = null;

    public currentCategory = '';
    public imgDownloaded: Array<boolean> = [];

    constructor(private sanitization: DomSanitizer,
                private router: Router,
                private route: ActivatedRoute) {
                    this.dataList = [];
                    this.imgDownloaded = [];
                    this.routeSubs = this.router.events.pipe(
                        filter (event => event instanceof NavigationStart)
                    )
                    .subscribe((event:NavigationStart) => {
                        this.dataList = [];
                        this.imgDownloaded = [];
                        $('#home-infinite-component').html("");
                        $('#search-infinite-component').html("");
                        //this.removeAllItems();
                    });
                    this.routeEndSubs = this.route.params.subscribe(params => {
                        if (this.currentCategory != params['category']){
                            this.dataList = [];
                            this.imgDownloaded = [];
                            this.removeAllItems();
                            $('#home-infinite-component').html("");
                            $('#search-infinite-component').html("");
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
        this.removeAllItems();
    }

    public dataScrolled(): void {
        this.loadMoreData.emit(true);
    }

    public onNgMasonryInit($event: Masonry) {
        this._masonry = $event;
        this.removeAllItems();
    }
    public removeAllItems() {
        if (this._masonry) {
            try {
                this._masonry.removeAllItems()
                .subscribe( (items: MasonryGridItem) => {
                    // remove all items from the list
                    this.masonryItems = [];
                });
            } catch (e){}
        }
    }

    public dataBelogsToThisView(data: any): boolean {
        if (data.searchCategory){
            if (data.searchCategory == this.currentCategory){
                return true;
            }
            console.log("fasdfasdf");
            return false;
        }
        return true;
    }

    public getEscapedUrl(data: any) {
        return escape('/gifs/' + data.giftuid);
    }

    public getGroupSearchLink(data: any) {
        return '/search/' + data.category + '/' + data.group;
    }
    
    public showThisImg(index: number) {
        setTimeout(function(that){
            that.imgDownloaded[index] = true;
        }, 1000, this);
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
