import { Component, OnInit, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { networkService } from '../../commons/services/network-service';

declare var $: any;

@Component({
    selector: 'app-header',
    template: `<div class="header">
            <div class="container">
            <div class="logo"> <a href="/"><img src="/assets/images/logo.png"  style="width:80px" /> </a> </div>
            <div class="search">
                <input type="search" name="search" placeholder="Search Gif's"  ng-model="searchkey" />
                <a class="searchBtn" href="/search-result/{{searchkey}}"><i class="fa fa-search" aria-hidden="true"></i></a> </div>
            </div>
            <!--nav-->
            <div class="tops-nav" >
            <div class="container">
                <div class="menux">
                <ul class="menu flex">
                    <li #categoryItems *ngFor="let category of categories">
                    <a [routerLink]="getSearchUrl(category)" routerLinkActive="router-link-active">{{category}}</a>
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

    @ViewChildren('categoryItems') categoryItems: QueryList<any>;

    categories: any[] = [];

    constructor(private network: networkService) {}

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

    private categoryItemsRendred() {
      $('ul.menu.flex').flexMenu();
    }

    private getSearchUrl(category: String): String {
        return '/search/' + category.replace(' ', '-');
    }
}
