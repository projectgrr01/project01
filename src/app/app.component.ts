import { Component, OnInit, ViewChildren, QueryList, AfterViewInit, Sanitizer } from '@angular/core';
import { networkService } from './commons/services/network-service';
import { DomSanitizer } from '@angular/platform-browser';
import { concat } from 'rxjs/operators';
//import 'rxjs/add/observable/fromEvent'

interface Window { MyNamespace: any; }
interface MyWindow extends Window {
  test: any;
}

declare var window: MyWindow;
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', '../assets/css/styles.css']
})

export class AppComponent implements OnInit, AfterViewInit {

  @ViewChildren('categoryItems') categoryItems: QueryList<any>;

  // Convert these anonymous arrays into class arrays
  categories: any[] = [];
  dataList: any[] = [];
  showLoader = true;
  currentPage = 0;

  constructor (private network: networkService,
              private sanitization: DomSanitizer) {
  }

  ngOnInit(): void {
    this.network.getMenuCategories().subscribe(response => {
      this.categories = response.categories;
    });

    this.currentPage = 0;
    this.dataList = [];
    this.populateGridData();
  }

  ngAfterViewInit() {
    this.categoryItems.changes.subscribe(t => {
      this.categoryItemsRendred();
    });
  }

  private onScroll(): void {
    this.populateGridData();
  }

  private populateGridData() {
    this.showLoader = true;
    this.network.getTrendingData(this.currentPage).subscribe(response => {
      this.currentPage++;
      this.dataList = this.dataList.concat(response.content);
      window.test = this.dataList;
      this.showLoader = false;
    });
  }

  private categoryItemsRendred() {
    $('ul.menu.flex').flexMenu();
  }

  private getSanitizedGifUrl(data: any) {
    return this.sanitization.bypassSecurityTrustStyle(`url(${data.media.regular.url})`)
  }
  private getGifMinHeight(data: any) {
    return `${data.media.actual.height - 20}px`;
  }
}
