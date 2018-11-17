import { Component, OnInit, ViewChildren, QueryList, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { NetworkService } from '../../commons/services/network-service';
import { UtilityService } from '../../commons/services/utility.service';

declare var $: any;

@Component({
    selector: 'app-header',
    template: `<div class="header">
            <div class="container">
                <div class="logo"> <a [routerLink]="['/']"><img src="/assets/images/gifkarologo.png" /> </a> </div>
                <div class="logo right" style="
                ">
                <a href="#"><img src="/assets/images/plus_128x128.png"></a>
                <a href="#"><img src="/assets/images/contact_128x128.png"></a>
                <a href="#"><img src="/assets/images/line_ver_01.png">
                </a>
                </div>
                <div class="search">
                    <input type="search" name="search" placeholder="Search Gif's"
                        [(ngModel)]="searchkey" (keyup.enter)="clickSearchBtn()" />
                    <a #searchBtn class="searchBtn" [routerLink]="'/search-result/' + searchkey">
                        <img src="/assets/images/search_128x128.png"></a>
                </div>
            </div>
            <!--nav-->
            <div class="tops-nav" >
            <div class="container">
                <div class="menux">
                <ul class="menu flex">
                    <li #categoryItems *ngFor="let category of categories">
                    <a [routerLink]="getSearchUrl(category)" routerLinkActive="router-link-active"
                        [innerHTML]="getCategoryText(category)"></a>
                    </li>
                </ul>
                <div class="clearfix"> </div>
                </div>
            </div>
            <!--// nav-->
            </div>
        </div>`
})

export class HeaderComponent implements OnInit, AfterViewInit {

    @ViewChildren('categoryItems') public categoryItems: QueryList<any>;
    @ViewChild('searchBtn') public searchBtn: ElementRef;

    categories: any[] = [];
    public searchkey = '';

    constructor(private network: NetworkService,
                private utility: UtilityService) {}

    ngOnInit(): void {
        this.network.getMenuCategories().subscribe(response => {
            this.categories = response.categories;
        });
    }

    ngAfterViewInit() {
        this.categoryItems.changes.subscribe(t => {
          this.categoryItemsRendred();
        });
    }

    public getCategoryText(category: any): string {
        return category[this.utility.language];
    }

    private categoryItemsRendred() {
        if (typeof($) !== 'undefined') {
            $('ul.menu.flex').flexMenu();
        }
    }

    public clickSearchBtn() {
        this.searchBtn.nativeElement.click();
    }

    public getSearchUrl(category: String): String {
        return '/search/' + category[this.utility.language].replace(' ', '-');
    }
}
