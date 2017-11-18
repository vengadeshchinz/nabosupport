import { Component, ViewChild } from '@angular/core';
import { Platform,MenuController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { MapPage } from '../pages/map/map';
import { SigninPage } from '../pages/signin/signin';
import {MyaccountPage} from '../pages/myaccount/myaccount';
import{ AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import{ ContactusPage } from '../pages/contactus/contactus';
import{ ShopPage } from '../pages/shop/shop';
import { OfferalarmPage } from '../pages/offeralarm/offeralarm'; 
import { SecurityPage } from '../pages/security/security';
import{NotificationPage} from '../pages/notification/notification';

  
export interface PageInterface {
  title: string;
  component: any;
  icon: string;
}

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  rootPage:any = SigninPage;
pages:Array<{title:string,component:any,icon:any}>;
  @ViewChild(Nav) nav: Nav;

  //rootPage:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    
    this.pages = [
      { title: 'My Account', component: MyaccountPage, icon: 'ios-contact-outline' },
      { title: 'Notification', component: NotificationPage, icon: 'ios-notifications-outline' },
      { title: 'My Contacts', component: ContactPage, icon: 'ios-contacts-outline' },
      { title: 'Become a paid member', component: MapPage, icon: 'cash' },
      { title: 'Security devices', component: SecurityPage, icon: 'ios-nuclear-outline' },
      { title: 'Shop', component: ShopPage, icon: 'ios-cart-outline' },
      { title: 'Offer & Alarm', component: OfferalarmPage, icon: 'ios-pricetags-outline' },
      { title: 'About', component: AboutPage, icon: 'ios-information-circle-outline' },
      { title: 'Contact', component: ContactusPage, icon: 'ios-call-outline' },
      { title: 'Logout',  component: SigninPage, icon: 'log-out' }
      
    // { title: 'logout', component: null, icon: 'log-out' }
  
    ];
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
  openPage(page){
    this.nav.setRoot(page.component);
  }
}

