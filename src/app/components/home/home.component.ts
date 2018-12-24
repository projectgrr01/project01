import { WINDOW } from '@ng-toolkit/universal';
import { Component, OnInit, ViewChildren, QueryList, AfterViewInit, Sanitizer , Inject, OnDestroy} from '@angular/core';
import { NetworkService } from '../../commons/services/network-service';
import { DomSanitizer } from '@angular/platform-browser';
import { UtilityService } from '../../commons/services/utility.service';
import { ActivatedRoute } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: []
})

export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {

  // Convert these anonymous arrays into class arrays
  dataList: any[] = [];
  showLoader = true;
  currentPage = 0;
  totalPages = Number.MAX_SAFE_INTEGER;
  public routeSubscriber: any;

  constructor (private network: NetworkService,
              private sanitization: DomSanitizer,
              private route: ActivatedRoute,
              private utility: UtilityService) {
  }

  ngOnInit(): void {
    this.routeSubscriber = this.route.params.subscribe(params => {
        this.utility.account = this.route.snapshot.queryParamMap.get('u');
        
        this.currentPage = 0;
        this.dataList = [];
        this.populateGridData();

    });
  }

  ngOnDestroy() {
      this.routeSubscriber.unsubscribe();
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
