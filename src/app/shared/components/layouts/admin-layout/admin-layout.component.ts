import { Component, OnInit, AfterViewInit, ViewChild, HostListener } from '@angular/core';
import { 
  Router, 
  NavigationEnd, 
  RouteConfigLoadStart, 
  RouteConfigLoadEnd, 
  ResolveStart, 
  ResolveEnd 
} from '@angular/router';
import { Subscription } from "rxjs/Subscription";
import { MatSidenav } from '@angular/material';
import { MediaChange, ObservableMedia } from "@angular/flex-layout";
import { TranslateService } from 'ng2-translate/ng2-translate';
import { ThemeService } from '../../../services/theme.service';
import PerfectScrollbar from 'perfect-scrollbar';
import { LayoutService } from '../../../services/layout.service';
import {UserService} from '../../../../services/user.service';
import { DomSanitizer} from '@angular/platform-browser'
@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.template.html'
})
export class AdminLayoutComponent implements OnInit, AfterViewInit {
  public isModuleLoading: Boolean = false;
  private moduleLoaderSub: Subscription;
  private layoutConfSub: Subscription;
  private routerEventSub: Subscription;
  private mediaSub: Subscription;
  private isMobile;
  // private sidebarPS: PerfectScrollbar;
  private bodyPS: PerfectScrollbar;
  private headerFixedBodyPS: PerfectScrollbar;
  public layoutConf: any = {};
  private html1:any;

  constructor(
      private sanitizer: DomSanitizer,
    private router: Router,
    public translate: TranslateService,
    public themeService: ThemeService,
    private layout: LayoutService,
    private media: ObservableMedia,
    private userSvc:UserService
  ) {

    
   
   //this.html1 = this.sanitizer.bypassSecurityTrustHtml('<script type="text/javascript" defer="" src="https://salesiq.zoho.com/support.site2apps/float.ls?embedname=site2apps"></script><script type="text/javascript">var $zoho= $zoho || {livedesk:{values:{},ready:function(){$zoho.livedesk.chat.floatingwindow("all");}}};var d=document;s=d.createElement("script");s.type="text/javascript";s.defer=true;s.src="https://salesiq.zoho.com/support.site2apps/float.ls?embedname=site2apps";t=d.getElementsByTagName("script")[0];t.parentNode.insertBefore(s,t);</script>') ;
   //this.html1 = this.sanitizer.bypassSecurityTrustHtml('<script type="text/javascript">var $zoho=$zoho || {};$zoho.salesiq = $zoho.salesiq || {widgetcode:"823d5d709fb171cfb20f4943f84bd869be6e661fdc43ff4170f1df79d527cdf6f955d95f6ae4987be928d655b2632c07", values:{},ready:function(){}};var d=document;s=d.createElement("script");s.type="text/javascript";s.id="zsiqscript";s.defer=true;s.src="https://salesiq.zoho.com/widget";t=d.getElementsByTagName("script")[0];t.parentNode.insertBefore(s,t);<div id='+"'zsiqwidget'"+'></div></script>'); 
   //this.html1=this.sanitizer.bypassSecurityTrustHtml('<script type="text/javascript" >         window.ZohoHCAsap=window.ZohoHCAsap||function(a,b){ZohoHCAsap[a]=b;};(function(){var d=document;        var s=d.createElement("script");s.type="text/javascript";s.defer=true;        s.src="https://desk.zoho.com/portal/api/web/inapp/343197000000130047?orgId=679464527";        d.getElementsByTagName("head")[0].appendChild(s);        })(); </script>');
  // this.html1 = this.sanitizer.bypassSecurityTrustHtml('<script type="text/javascript" defer="" src="https://salesiq.zoho.com/support.mylinkedsolution1/float.ls?embedname=mylinkedsolution1"></script><script type="text/javascript">var $zoho= $zoho || {livedesk:{values:{},ready:function(){$zoho.livedesk.chat.floatingwindow("all");}}};var d=document;s=d.createElement("script");s.type="text/javascript";s.defer=true;s.src="https://salesiq.zoho.com/support.mylinkedsolution1/float.ls?embedname=mylinkedsolution1";t=d.getElementsByTagName("script")[0];t.parentNode.insertBefore(s,t);</script>') ;

   const fragment = document.createRange().createContextualFragment(this.html1);
   document.body.appendChild(fragment);
    // Close sidenav after route change in mobile
    this.routerEventSub = router.events.filter(event => event instanceof NavigationEnd)
    .subscribe((routeChange: NavigationEnd) => {
      if(this.isSm()) {
        this.closeSidebar()
      }
    });
    
    // Translator init
    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
  }
  ngOnInit() {
    this.layoutConf = this.layout.layoutConf;
    this.isMobile = this.isSm();
    this.layout.publishLayoutChange({
      isMobile: this.isMobile,
      sidebarStyle: this.isMobile ? 'closed' : 'full'
    })
    // FOR MODULE LOADER FLAG
    this.moduleLoaderSub = this.router.events.subscribe(event => {
      if(event instanceof RouteConfigLoadStart || event instanceof ResolveStart) {
        this.isModuleLoading = true;
      }
      if(event instanceof RouteConfigLoadEnd || event instanceof ResolveEnd) {
        this.isModuleLoading = false;
      }
    });
  
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isMobile = this.isSm();
    this.layout.publishLayoutChange({
      isMobile: this.isMobile,
      sidebarStyle: this.isMobile ? 'closed' : 'full'
    })
  }
  ngAfterViewInit() {
    this.layoutConfSub = this.layout.layoutConf$.subscribe(change => {
      this.initBodyPS(change)
    })
  }
  initBodyPS(layoutConf:any = {}) {
    if(layoutConf.navigationPos === 'side' && layoutConf.topbarFixed) {
      if (this.bodyPS) this.bodyPS.destroy();
      if (this.headerFixedBodyPS) this.headerFixedBodyPS.destroy();
      this.headerFixedBodyPS = new PerfectScrollbar('.rightside-content-hold', {
        suppressScrollX: true
      })
    } else {
      if (this.bodyPS) this.bodyPS.destroy();
      if (this.headerFixedBodyPS) this.headerFixedBodyPS.destroy();
      this.bodyPS = new PerfectScrollbar('.main-content-wrap', {
        suppressScrollX: true
      })
    }
  }
  ngOnDestroy() {
    if(this.moduleLoaderSub) {
      this.moduleLoaderSub.unsubscribe()
    }
    if(this.layoutConfSub) {
      this.layoutConfSub.unsubscribe()
    }
    if(this.routerEventSub) {
      this.routerEventSub.unsubscribe()
    }
  }
  closeSidebar() {
    this.layout.publishLayoutChange({
      sidebarStyle: 'closed'
    })
  }
  isSm() {
    return window.matchMedia(`(max-width: 959px)`).matches;
  }
}