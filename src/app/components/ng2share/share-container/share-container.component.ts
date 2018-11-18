import { Inject } from '@angular/core';
import { WINDOW } from '@ng-toolkit/universal';
import { Component, Input, OnInit, ViewEncapsulation}
        from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Properties } from '../properties.utils'
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'share-container',
  templateUrl: './share-container.component.html',
  styleUrls: ['./share-container.component.css'],
  animations: [
          trigger('expandedState', [
            state('expanded', style({
              width: '*',
              height: '*'
            })),
            state('collapsed', style({
              width: '0',
              height: '0'
            })),
            transition('collapsed <=> expanded', animate('100ms ease-in'))
          ])
        ]
})
export class ShareContainerComponent implements OnInit {
  // Primary platforms that appear
  @Input() platforms = ['twitter', 'facebook'];
  // Secondary Platforms that appear when expanded
  @Input() secondaryPlatforms =  ['googlePlus', 'reddit', 'pinterest', 'linkedin'];
  // Wether or not the component is expendable
  @Input() expandable:boolean = true;
  // tells if the text must be enabled on primary platforms
  @Input() textEnabled:boolean = false;
  // Text added to the vanilla message, ex: 'your creation' will result in
  // 'Tweet your creation' for twitter or 'Share your creation' for fb
  @Input() addedText: string;
  // This should be set up directly in the meta tags as this is good practice
  // Use this input only if you have multiple content to share per url.
  // So in case you need this the input should be like the following object (you can omitt some fields)
  // {title:'my title', description:'my desc',img:' an image', via:'Ced_VDB', hashtags:'someHashTag'}
  @Input() properties: Properties = {};
  @Input() shortenUrl: String = '';
  // horizontal layout or vertical layout (_accessed via getter & setter)
  _direction: String = 'horizontal';
  // state of the secondary platform expandable pannel
  expandedState: String = 'collapsed';

  constructor(@Inject(WINDOW) private window: Window, private sanitization: DomSanitizer) {}


  ngOnInit(){
    this.fetchProperties();
  }
  expand(){
    this.expandedState = (this.expandedState == 'collapsed' ? 'expanded' : 'collapsed');
  }
  fetchProperties(){
    this.properties.url = this.properties.url || this.getMetaContent('og:url') || this.window.location.href.toString();
    this.properties.title = this.properties.title || this.getMetaContent('og:title') || document.title;
    this.properties.description = this.properties.description || this.getMetaContent('og:description');
    this.properties.image = this.properties.image || this.getMetaContent('og:image');
    this.properties.via = this.properties.via || this.getMetaContent('n2s:via');
    this.properties.hashtags = this.properties.hashtags || this.getMetaContent('n2s:hashtags');
    for(let p in this.properties){
      if (this.properties.hasOwnProperty(p)) {
          this.properties[p] = encodeURIComponent(this.properties[p]);
      }
    }
  }
  getMetaContent(property: string) {
    let elem = document.querySelector(`meta[property='${property}']`);
    if(elem)
      return elem.getAttribute("content");
    return "";
  }
  // safe check to prevent missuses
  @Input()
  set direction(direction){
    if(direction === 'vertical')
      this._direction = direction;
    else
      this._direction = 'horizontal';
  }

  get direction(){
    return this._direction;
  }

  public getWhatsappShareableUrl() {
    return this.sanitization.bypassSecurityTrustResourceUrl('https://api.whatsapp.com/send?text=' + this.shortenUrl);
  }

  public getDownloadableUrl() {
    return this.sanitization.bypassSecurityTrustResourceUrl(this.shortenUrl.toString());
  }
}
