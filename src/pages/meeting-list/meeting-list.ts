import { Component } from '@angular/core';

import { ActionSheet, ActionSheetController, Config, NavController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { ConferenceData } from '../../providers/conference-data';
import { SessionDetailPage } from '../session-detail/session-detail';
import { SpeakerDetailPage } from '../speaker-detail/speaker-detail';
import { UserData } from '../../providers/user-data';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-meeting-list',
  templateUrl: 'meeting-list.html'
})
export class MeetingListPage {
  actionSheet: ActionSheet;
  speakers: any[] = [];
  currentPath: string = "/";
  meetingsList: any[] = [];

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController,
    public confData: ConferenceData,
    public config: Config,
    public user: UserData,
    public inAppBrowser: InAppBrowser
  ) { }

  ionViewDidLoad() {
    this.getMeetingsList();
  }
  
  getMeetingsList() {
    this.confData.getMeetings().then((observabler:any)=> {
      observabler.subscribe((meetingData:any) => {
        this.meetingsList = meetingData;
        console.log("ionViewDidLoad, " + this.meetingsList);
      });
    });
  }


  selectMeeting(meeting: any) {
    this.user.setSelectedMeeting(meeting);
    this.confData.sendCheckIn(meeting).then((observabler : any) => {
      observabler.subscribe((value: any) => {
        if (value == 'success') this.navCtrl.push(TabsPage);
          else console.log(value.state);
      })
    });
    
  }

}
