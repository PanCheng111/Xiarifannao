import { Component } from '@angular/core';

import { ActionSheet, ActionSheetController, Config, NavController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { ConferenceData } from '../../providers/conference-data';
//import { SessionDetailPage } from '../session-detail/session-detail';
import { SpeakerDetailPage } from '../speaker-detail/speaker-detail';


@Component({
  selector: 'page-speaker-list',
  templateUrl: 'speaker-list.html'
})
export class SpeakerListPage {
  actionSheet: ActionSheet;
  speakers: any[] = [];
  currentPath: string = "/";
  filesList: any[] = [];

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController,
    public confData: ConferenceData,
    public config: Config,
    public inAppBrowser: InAppBrowser
  ) { }

  ionViewDidLoad() {
    // this.confData.getSpeakers().subscribe((speakers: any[]) => {
    //   this.speakers = speakers;
    // });
    this.getFolderList();
  }
  
  getFolderList() {
    this.confData.getFiles(this.currentPath).then((observabler:any)=> {
      observabler.subscribe((fileData:any) => {
        this.filesList = fileData.pathsInfo;
        console.log("ionViewDidLoad, " + this.filesList);
        this.filesList.push({
          name: '返回上一级',
          type: 'folder',
          path: '../'
        })
        this.filesList.forEach(function(file) {
              if (file.type == 'folder') file.show = false;
                else file.show = true;
              file.thumbnail = 'assets/img/icon_file/' + file.type + '.png';
              if (!file.type || file.name.startsWith('.') || (file.name.indexOf('.') == -1 && file.type != 'folder'))
                file.thumbnail = 'assets/img/icon_file/file.png';
        });
      });
    });
  }

  // goToSessionDetail(session: any) {
  //   this.navCtrl.push(SessionDetailPage, session);
  // }

  goToSpeakerDetail(speakerName: any) {
    this.navCtrl.push(SpeakerDetailPage, speakerName);
  }

  goToFileDetail(file: any) {
    if (file.name == '返回上一级') {
      this.currentPath = this.currentPath.substr(0, this.currentPath.lastIndexOf('/'));
      this.getFolderList();
    } 
    else if (file.type == 'folder') {
      this.currentPath = file.path;
      this.getFolderList();
    }
    else this.navCtrl.push(SpeakerDetailPage, file);
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
