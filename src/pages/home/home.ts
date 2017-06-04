import { Component } from '@angular/core';

import { ActionSheet, ActionSheetController, Config, NavController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { ConferenceData } from '../../providers/conference-data';
//import { SessionDetailPage } from '../session-detail/session-detail';
import { SpeakerDetailPage } from '../speaker-detail/speaker-detail';
import { ReqDetailPage } from '../req-detail/req-detail';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  actionSheet: ActionSheet;
  speakers: any[] = [];
  currentPath: string = "/";
  filesList: any[] = [];
  reqList: any[] = [];
  placeList: any;

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController,
    public confData: ConferenceData,
    public config: Config,
    public inAppBrowser: InAppBrowser
  ) { 
    //this.placeList = this.confData.placeList;
    //this.getReqList();
  }

  ionViewDidLoad() {
    // this.confData.getSpeakers().subscribe((speakers: any[]) => {
    //   this.speakers = speakers;
    // });
    this.getReqList();
  }
  
  getReqList() {
    this.placeList = this.confData.placeList;
    // this.reqList = [
    //   {type: "帮带食堂饭菜", stat:"available", thumbnail:"assets/img/food.jpg", startplace: "东一食堂", endplace: "图书馆", message: "求从食堂带饭到图书馆", time:"期望时间：5 min"},
    //   {type: "帮取快递", stat:"available", thumbnail:"assets/img/kuaidi.jpg", startplace: "东一食堂", endplace: "图书馆", message: "求从食堂带饭到图书馆", time: "期望时间：10 min"},
    //   {type: "帮买水果", stat:"available", thumbnail:"assets/img/fruit.jpg", startplace: "东一食堂", endplace: "图书馆", message: "求从食堂带饭到图书馆", time: "期望时间：15 min"},
    //   {type: "帮购商品", stat:"available", thumbnail:"assets/img/market.jpg", startplace: "东一食堂", endplace: "图书馆", message: "求从食堂带饭到图书馆", time: "期望时间：15 min"},
    //   {type: "帮还图书", stat:"available", thumbnail:"assets/img/market.jpg", startplace: "东一食堂", endplace: "图书馆", message: "求从食堂带饭到图书馆", time: "期望时间：15 min"},
    // ]
    this.confData.getReqList(114.438428, 30.515387).subscribe((data:any) => {
        this.reqList = [];
        console.log("reqList:" + data);
        for (let i = 0; i < data.length; i++) {
              let req = data[i];
              req.type = req.tag;
              if (req.type == '帮带食堂饭菜' || req.type == '带食堂饭菜') req.thumbnail = "assets/img/food.jpg";
              if (req.type == '帮取快递') req.thumbnail = "assets/img/kuaidi.jpg";
              if (req.type == '帮买水果') req.thumbnail = "assets/img/fruit.jpg";
              if (req.type == '帮购商品') req.thumbnail = "assets/img/market.jpg";
              if (req.type == '帮还图书') req.thumbnail = "assets/img/book.jpg";          
              req.startplace = this.placeList[req.spos];
              req.endplace = this.placeList[req.epos];
              req.message = req.txt;
              this.reqList.push(req);
        }

      });
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

  goToReqDetail(req: any) {
    this.navCtrl.push(ReqDetailPage, req);
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
