import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-infinite-component',
    template: `
            <ng-masonry-grid
                    [masonryOptions]="{ transitionDuration: '0s', gutter: 10 }"
                    [useAnimation]="false"
                    [useImagesLoaded]="true"
                    [scrollAnimationOptions]="{ animationEffect: 'effect-0', minDuration : 0, maxDuration : 0 }"
                    infiniteScroll
                    [infiniteScrollDistance]="1" [infiniteScrollThrottle]="50" (scrolled)="dataScrolled()">
                <ng-masonry-grid-item id="{{'masonry-item-'+i}}" class="cardx" *ngFor="let data of dataList;let i = index;">
                    <a class="img" [attr.href]="getEscapedUrl(data)" [style.background-image]="getSanitizedGifUrl(data)"
                        [style.height]="getGifMinHeight(data)"></a>
                    <div class="inside">
                        <h3>{{data.category}} </h3>
                        <div class="description">{{data.group}} </div>
                    </div>
                </ng-masonry-grid-item>
            </ng-masonry-grid>
            `,
        styleUrls: ['../../../../node_modules/ng-masonry-grid/ng-masonry-grid.css']
})

export class InfiniteComponent {
    @Input() dataList: any;
    @Output() loadMoreData: EventEmitter<boolean> = new EventEmitter();

    constructor(private sanitization: DomSanitizer) { }

    public dataScrolled(): void {
        this.loadMoreData.emit(true);
    }

    public getEscapedUrl(data: any) {
        return escape('/gifs/' + data.giftuid);
    }
    public getGroupSearchLink(data: any) {
        return '/search/' + data.category + '/' + data.group;
    }
    public getSanitizedGifUrl(data: any) {
        return this.sanitization.bypassSecurityTrustStyle(`url(${data.media.gif.regular.url})`);
    }
    public getGifMinHeight(data: any) {
        return `${data.media.gif.actual.height - 20}px`;
    }
    public getGifMinHeightCover(data: any) {
      return `${data.media.gif.actual.height + 40}px`;
    }
}
