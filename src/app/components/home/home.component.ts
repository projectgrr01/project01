import { WINDOW } from '@ng-toolkit/universal';
import { Component, OnInit, ViewChildren, QueryList, AfterViewInit, Sanitizer , Inject} from '@angular/core';
import { NetworkService } from '../../commons/services/network-service';
import { DomSanitizer } from '@angular/platform-browser';

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
  totalPages = Number.MAX_SAFE_INTEGER;

  constructor (private network: NetworkService,
              private sanitization: DomSanitizer) {
  }

  ngOnInit(): void {
    this.currentPage = 0;
    this.dataList = [];
    this.populateGridData();
  }

  ngAfterViewInit() { }

  public onLoadMoreData(): void {
    if (this.showLoader || this.currentPage >= this.totalPages){
      return;
    }
    this.populateGridData();
  }

  private populateGridData() {
    this.showLoader = true;
    this.network.getTrendingData(this.currentPage).subscribe(response => {
      this.currentPage++;
      this.dataList = this.dataList.concat(response.content);
      this.showLoader = false;
    });
  }

  public getSanitizedGifUrl(data: any) {
    return this.sanitization.bypassSecurityTrustStyle(`url(${data.media.regular.url})`);
  }

  public getGifMinHeight(data: any) {
    return `${data.media.actual.height - 20}px`;
  }
  
  public getGifMinHeightCover(data: any) {
    return `${data.media.actual.height + 40}px`;
  }
}
