import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';
import { UserData } from '../../providers/user-data';
import { NavController, MenuController } from 'ionic-angular';

import { AboutPage } from '../about/about';
import { MapPage } from '../map/map';
//import { SchedulePage } from '../schedule/schedule';
import { SpeakerListPage } from '../speaker-list/speaker-list';
import { SupportPage } from '../support/support';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // set the root pages for each tab
  //tab1Root: any = SchedulePage;
  tab2Root: any = SpeakerListPage;
  tab3Root: any = MapPage;
  tab4Root: any = AboutPage;
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
