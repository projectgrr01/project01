import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { networkService } from '../../commons/services/network-service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html'
})

export class SearchComponent implements OnInit, OnDestroy {
    category: String;
    private routeSubscriber: any;
    private dataList: any;

    constructor(private route: ActivatedRoute,
                private netowrk: networkService) { }

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

    private getGroupsForCategory(category: String) {
        this.netowrk.getCategoryGroupsData(category).subscribe(response => {
            this.dataList = response.groups;
            console.log(this.dataList);
        });
    }
}
