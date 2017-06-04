import { Component } from '@angular/core';
import { ConferenceData } from '../../providers/conference-data';
import { NavParams, AlertController, NavController } from 'ionic-angular';

@Component({
  selector: 'page-req-create',
  templateUrl: 'req-create.html'
})
export class ReqCreatePage {
  conferenceDate = '2047-05-17';
  req: any = {};
  placeList: [any];

  constructor(public confData: ConferenceData, 
              public navParams: NavParams,
              public navCtrl: NavController,
              public alertCtrl: AlertController) {
    //this.req = navParams.data;
    this.placeList = this.confData.placeList;
  }

  ionViewDidLoad() {
    this.placeList = this.confData.placeList;
  }

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: '你确定发布跑腿任务?',
      message: this.req.type,
      buttons: [
        {
          text: '取消',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: '确定',
          handler: () => {
            console.log('Agree clicked');
            this.req.stat = "inavailable";
            this.req = {};
            //this.navCtrl.pop();
          }
        }
      ]
    });
    confirm.present();
  }

}
