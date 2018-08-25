import { Component, OnInit, ViewChildren, QueryList, AfterViewInit, Sanitizer } from '@angular/core';
import { networkService } from './commons/services/network-service';
import { DomSanitizer } from '@angular/platform-browser';
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

  //Convert these anonymous arrays into class arrays
  categories: any[] = [];
  dataList: any[] = [];
  showLoader: boolean = true;

  constructor (private network: networkService,
              private sanitization: DomSanitizer) {
  }

  ngOnInit(): void {
    this.network.getMenuCategories().subscribe(response => {
      this.categories = response.categories;
    });

    this.network.getDefaultData(0).subscribe(response => {
      window.test = response;
      this.dataList = response.content;
      this.showLoader = false;
    })
  }

  ngAfterViewInit() {
    this.categoryItems.changes.subscribe(t => {
      this.categoryItemsRendred();
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
