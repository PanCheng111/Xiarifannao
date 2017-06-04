import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';
import { UserData } from '../../providers/user-data';
import { NavController, MenuController } from 'ionic-angular';

import { AboutPage } from '../about/about';
import { MapPage } from '../map/map';
//import { SchedulePage } from '../schedule/schedule';
import { SpeakerListPage } from '../speaker-list/speaker-list';
import { SupportPage } from '../support/support';
import { HomePage } from '../home/home';
import { AccountPage } from '../account/account';
import { ReqCreatePage } from '../req-create/req-create';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // set the root pages for each tab
  //tab1Root: any = SchedulePage;
  tab2Root: any = HomePage;
  tab3Root: any = ReqCreatePage;
  tab4Root: any = AccountPage;
  mySelectedIndex: number;

  constructor(navParams: NavParams, 
          public navCtrl: NavController, 
          public menu: MenuController, 
          public userData: UserData) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(true);
  }
}
