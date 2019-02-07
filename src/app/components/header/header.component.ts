import { Component, OnInit, ViewChildren, QueryList, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { NetworkService } from '../../commons/services/network-service';
import { UtilityService } from '../../commons/services/utility.service';
import { environment } from '../../../environments/environment';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { DialogComponent } from './DialogComponent';

declare var $: any;

@Component({
    selector: 'app-header',
    template: `<div class="header">
            <div class="container">
                <div class="logo"> <a [routerLink]="['/']"><img src="/assets/images/gifkarologo.png" /> </a> </div>
                <div class="logo invitekaro"> <a href="//invitekaro.gifkaro.com/index.html" target="_blank"><img src="/assets/images/invitekaro_small.gif" /> </a> </div>
                <div class="logo right">
                    <div (click)="openDialog()"><img src="/assets/images/plus_128x128.png"></div>
                    <div (click)="openDialog()"><img src="/assets/images/contact_128x128.png"></div>
                    <div (click)="toggleSettings()"><img src="/assets/images/{{settingImage}}"></div>
                </div>
                <div class="search">
                    <input type="search" name="search" placeholder="Search Gif's"
                        [(ngModel)]="searchkey" (keyup.enter)="clickSearchBtn()" />
                    <a #searchBtn class="searchBtn" [routerLink]="'/search-result/' + searchkey">
                        <img src="/assets/images/search_128x128.png"></a>
                </div>
			</div>
			<div class="container">
				<app-setting *ngIf="settingImage == 'cross_128x128.png'" (languageSelected)="changeLanguage($event)"></app-setting>
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
    public settingImage = 'line_ver_01.png';

    constructor(private network: NetworkService,
                private utility: UtilityService,
                private dialog: MatDialog) {}

    ngOnInit(): void {
        this.getCategoryItems();
    }

    ngAfterViewInit() {
        this.categoryItems.changes.subscribe(t => {
          this.categoryItemsRendred();
        });
    }

    public getCategoryItems() {
        this.network.getMenuCategories().subscribe(response => {
            this.categories = response.categories;
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

    public changeLanguage(lang: string) {
    	try{
        	if (environment.supportedLanguages.indexOf(lang) > -1) {
        	    localStorage['lang'] = lang;
        	    this.utility.language = lang;
        	    this.toggleSettings();
        	    this.getCategoryItems();
        	} else {
        	    console.log('Unsupported language');
        	}
		} catch (e){}
    }
    
    public openDialog() {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            id: 1,
            description: 'Coming Soon!'
        };

        this.dialog.open(DialogComponent, dialogConfig);
    }

    public toggleSettings() {
        this.settingImage = this.settingImage === 'line_ver_01.png' ? 'cross_128x128.png' : 'line_ver_01.png';
    }

    public getSearchUrl(category: String): String {
        try {
            return '/search/' + category[environment.defaultLanguage].replace(' ', '-');
        } catch (e) {}
    }
}
