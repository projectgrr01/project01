import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-infinite-component',
    template: `
            <div id="columns" class="cards-wrap" infiniteScroll
                [infiniteScrollDistance]="1" [infiniteScrollThrottle]="50" (scrolled)="dataScrolled()">
                <div class="card cardx" *ngFor="let data of dataList" [style.height]="getGifMinHeightCover(data)">
                    <a class="img" [attr.href]="getEscapedUrl(data)" [style.background-image]="getSanitizedGifUrl(data)"
                        [style.height]="getGifMinHeight(data)"></a>
                    <div class="inside">
                        <h3>{{data.category}} </h3>
                        <div class="description">{{data.group}} </div>
                    </div>
                </div>
            </div>`
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
