import { WINDOW } from '@ng-toolkit/universal';
import { Component, OnInit, ViewChildren, QueryList, AfterViewInit, Sanitizer , Inject} from '@angular/core';
import { NetworkService } from './commons/services/network-service';
import { DomSanitizer } from '@angular/platform-browser';

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

export class AppComponent {

  constructor (private network: NetworkService,
              private sanitization: DomSanitizer) {
  }
}
