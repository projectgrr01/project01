import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { networkService } from '../../commons/services/network-service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html'
})

export class SearchComponent implements OnInit, OnDestroy {
    private category: string;
    private categoryGroupsList: string[];
    private currentGroupElements: number = 10;
    private routeSubscriber: any;
    private dataList: any;

    constructor(private route: ActivatedRoute,
                private netowrk: networkService,
                private sanitization: DomSanitizer) { }

    ngOnInit() {
        this.routeSubscriber = this.route.params.subscribe(params => {
            this.category = params['category']; // (+) converts string 'id' to a number

            this.getGroupsForCategory(this.category);
            // In a real app: dispatch action to load the details here.
        });
    }

    ngOnDestroy() {
        this.routeSubscriber.unsubscribe();
    }

    private getGroupsForCategory(category: string) {
        this.netowrk.getCategoryGroupsData(category).subscribe(response => {
            this.getCoverImageForGroupTile(category, response.groups);
        });
    }

    private getCoverImageForGroupTile(category: string, groups: string[]) {
        this.dataList = [];
        for (let group of groups) {
            /* var grpdata = responseImg.content[0];
                var groupList = {"groupx":grpdata.group,"img":grpdata.media.tiny.url,
                "width":grpdata.media.regular.width,"height":grpdata.media.regular.height};
				console.log(groupList);
                $scope.dataget.push(groupList);
                 */
            this.netowrk.getCategoryGroupsCoverData(category, group).subscribe(response => {
                this.dataList.push(response.content[0]);
            })
        }
    }

    private onScroll() {

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
}
