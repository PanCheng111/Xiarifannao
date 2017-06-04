import { Component } from '@angular/core';

import { ActionSheet, ActionSheetController, Config, NavController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { ConferenceData } from '../../providers/conference-data';
//import { SessionDetailPage } from '../session-detail/session-detail';
import { SpeakerDetailPage } from '../speaker-detail/speaker-detail';
import { ReqDetailPage } from '../req-detail/req-detail';
import { NavParams } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'req-list.html'
})
export class ReqListPage {
  actionSheet: ActionSheet;
  speakers: any[] = [];
  currentPath: string = "/";
  filesList: any[] = [];
  reqList: any[] = [];
  title: String;

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController,
    public confData: ConferenceData,
    public config: Config,
    public inAppBrowser: InAppBrowser,
    public navParams: NavParams
  ) { 
    this.title = navParams.data.title;
    this.reqList = navParams.data.list;
  }

  ionViewDidLoad() {
    // this.confData.getSpeakers().subscribe((speakers: any[]) => {
    //   this.speakers = speakers;
    // });
    //this.getReqList();
  }

  goToReqDetail(req: any) {
    this.navCtrl.push(ReqDetailPage, req);
  }


  goToSpeakerTwitter(speaker: any) {
    this.inAppBrowser.create(`https://twitter.com/${speaker.twitter}`, '_blank');
  }

  openSpeakerShare(speaker: any) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Share ' + speaker.name,
      buttons: [
        {
          text: 'Copy Link',
          handler: ($event: Event) => {
            console.log('Copy link clicked on https://twitter.com/' + speaker.twitter);
            if ((window as any)['cordova'] && (window as any)['cordova'].plugins.clipboard) {
              (window as any)['cordova'].plugins.clipboard.copy('https://twitter.com/' + speaker.twitter);
            }
          }
        },
        {
          text: 'Share via ...'
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    actionSheet.present();
  }

  openContact(speaker: any) {
    let mode = this.config.get('mode');

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Contact ' + speaker.name,
      buttons: [
        {
          text: `Email ( ${speaker.email} )`,
          icon: mode !== 'ios' ? 'mail' : null,
          handler: () => {
            window.open('mailto:' + speaker.email);
          }
        },
        {
          text: `Call ( ${speaker.phone} )`,
          icon: mode !== 'ios' ? 'call' : null,
          handler: () => {
            window.open('tel:' + speaker.phone);
          }
        }
      ]
    });

    actionSheet.present();
  }
}
