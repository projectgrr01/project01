import { Component, OnInit, ViewChildren, QueryList, AfterViewInit, Sanitizer } from '@angular/core';
import { networkService } from '../../commons/services/network-service';
import { DomSanitizer } from '@angular/platform-browser';

interface Window { MyNamespace: any; }
interface MyWindow extends Window {
  test: any;
}

declare var window: MyWindow;
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: []
})

export class HomeComponent implements OnInit, AfterViewInit {

  // Convert these anonymous arrays into class arrays
  dataList: any[] = [];
  showLoader = true;
  currentPage = 0;

  constructor (private network: networkService,
              private sanitization: DomSanitizer) {
  }

  ngOnInit(): void {
    this.currentPage = 0;
    this.dataList = [];
    this.populateGridData();
  }

  ngAfterViewInit() { }

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

  private getSanitizedGifUrl(data: any) {
    return this.sanitization.bypassSecurityTrustStyle(`url(${data.media.regular.url})`)
  }
  private getGifMinHeight(data: any) {
    return `${data.media.actual.height - 20}px`;
  }
}
