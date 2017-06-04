import { Component } from '@angular/core';
import { ConferenceData } from '../../providers/conference-data';
import { NavParams } from 'ionic-angular';
import { AlertController, NavController } from 'ionic-angular';

@Component({
  selector: 'page-req-detail',
  templateUrl: 'req-detail.html'
})
export class ReqDetailPage {
  conferenceDate = '2047-05-17';
  req: any = {};

  constructor(public confData: ConferenceData, 
              public navParams: NavParams,
              public navCtrl: NavController,
              public alertCtrl: AlertController) {
    this.req = navParams.data;
  }

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: '你确定?',
      message: this.req.message,
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
            this.navCtrl.pop();
          }
        }
      ]
    });
    confirm.present();
  }

  ionViewDidLoad() {

    // this.confData.getMeetingInfo().then((obversabler:any)=>{
    //   //fun.then((obversabler:any)=>{
    //     obversabler.subscribe((meetingData:any)=>{
    //       this.meeting = meetingData;
    //     });
    // //  });
    // });
  }

}
