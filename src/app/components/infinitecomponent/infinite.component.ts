import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Masonry, MasonryGridItem } from 'ng-masonry-grid'; // import necessary datatypes
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';


@Component({
    selector: 'app-infinite-component',
    template: `
            <ng-masonry-grid
                    [masonryOptions]= "{transitionDuration: '0s', gutter: 10, horizontalOrder: true }"
                    [useAnimation]= "false"
                    [useImagesLoaded]= "true"
                    (onNgMasonryInit)="onNgMasonryInit($event)"
                    
                    infiniteScroll
                    [infiniteScrollDistance]="1" [infiniteScrollThrottle]="20" 
                    [immediateCheck]="true" (scrolled)="dataScrolled()">
                <ng-masonry-grid-item id="{{'masonry-item-'+i}}" 
                    [class.loaded]="imgDownloaded[i]" class="cardx" *ngFor="let data of dataList;let i = index;">
                    <a class="img" routerLink="{{getEscapedUrl(data)}}">
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

export class InfiniteComponent {
    @Input() dataList: Array<any> = [];
    @Output() loadMoreData: EventEmitter<boolean> = new EventEmitter();
    
    _masonry: Masonry;
    masonryItems: any[]; // NgMasonryGrid Grid item list
    private routeSubs: any = null;

    public imgDownloaded: Array<boolean> = [];

    constructor(private sanitization: DomSanitizer,
                private router: Router) {
                    this.routeSubs = this.router.events.pipe(
                        filter (event => event instanceof NavigationStart)
                    )
                    .subscribe((event:NavigationStart) => {
                        this.removeAllItems();
                    });
                }

    public ngOnDestroy(){
        if(this.routeSubs != null){
            this.routeSubs.unsubscribe();
        }
    }

    public dataScrolled(): void {
        this.loadMoreData.emit(true);
    }

    onNgMasonryInit($event: Masonry) {
        this._masonry = $event;
    }
    removeAllItems() {
        if (this._masonry) {
            this._masonry.removeAllItems()
                .subscribe( (items: MasonryGridItem) => {
                    // remove all items from the list
                    this.masonryItems = [];
                });
        }
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
