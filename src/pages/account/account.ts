import { Component } from '@angular/core';

import { AlertController, NavController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { SupportPage } from '../support/support';
import { UserData } from '../../providers/user-data';

import { ReqListPage } from '../req-list/req-list';
import { ConferenceData } from '../../providers/conference-data';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {
  username: string;
  doneReqList: any;
  unDoneReqList: any;
  placeList : any;

  constructor(public alertCtrl: AlertController, 
              public nav: NavController,
              public userData: UserData,
              public confData: ConferenceData) {
    this.getUsername();
    this.doneReqList = [];
    let data = [
      {"spos":12,"x":114.435527,"y":30.516725,"task_id":12,"stat":"available","sid":12,"eid":13,"time":"1h以上","price":1,"txt":"顺路快递","tag":"帮取快递","distance":328.7637,"epos":13},
      {"spos":8,"x":114.438505,"y":30.520194,"task_id":23,"stat":"available","sid":8,"eid":1,"time":"30min以内","price":1,"txt":"烫烫烫烫烫，饿死啦","tag":"帮带食堂饭菜","distance":221.5505,"epos":1},
      {"spos":7,"x":114.436915,"y":30.520046,"task_id":3,"stat":"available","sid":7,"eid":9,"time":"1h以内","price":1,"txt":"想吃","tag":"带食堂饭菜","distance":272.7715,"epos":9},
      {"spos":12,"x":114.435527,"y":30.516725,"task_id":22,"stat":"available","sid":12,"eid":2,"time":"30min以内","price":3,"txt":"hhh求取快递，急急急急急急急急","tag":"帮取快递","distance":328.7637,"epos":2},
      {"spos":4,"x":114.433645,"y":30.519735,"task_id":5,"stat":"available","sid":4,"eid":3,"price":2,"txt":"有人去图书馆还书吗？求顺带","tag":"帮还图书","distance":568.8447,"epos":3},
      {"spos":8,"x":114.438505,"y":30.520194,"task_id":6,"stat":"available","sid":8,"eid":6,"time":"1h以内","price":1,"txt":"有人回韵园宿舍吗求带饭呀","tag":"帮带食堂饭菜","distance":221.5505,"epos":6}
    ];
    this.placeList = this.confData.placeList;

    for (let i = 0; i < data.length; i++) {
              let req:any = data[i];
              req.type = req.tag;
              if (req.type == '帮带食堂饭菜' || req.type == '带食堂饭菜') req.thumbnail = "assets/img/food.jpg";
              if (req.type == '帮取快递') req.thumbnail = "assets/img/kuaidi.jpg";
              if (req.type == '帮买水果') req.thumbnail = "assets/img/fruit.jpg";
              if (req.type == '帮购商品') req.thumbnail = "assets/img/market.jpg";
              if (req.type == '帮还图书') req.thumbnail = "assets/img/book.jpg";          
              req.startplace = this.placeList[req.spos];
              req.endplace = this.placeList[req.epos];
              req.message = req.txt;
              this.doneReqList.push(req);
    }

    data = [
      {"spos":8,"x":114.438505,"y":30.520194,"task_id":19,"stat":"available","sid":8,"eid":4,"time":"1h以内","price":2,"txt":"连着上午和中午得课，没时间去食堂，求带饭","tag":"帮带食堂饭菜","distance":221.5505,"epos":4},
      {"spos":12,"x":114.435527,"y":30.516725,"task_id":16,"stat":"available","sid":12,"eid":4,"price":3,"txt":"实习中，完全取不了快递，亟待解救","tag":"帮取快递","distance":328.7637,"epos":4},
      {"spos":7,"x":114.436915,"y":30.520046,"task_id":17,"stat":"available","sid":7,"eid":1,"time":"1h以内","price":1,"txt":"23333要饭","tag":"帮带食堂饭菜","distance":272.7715,"epos":1},
      {"spos":5,"x":114.438747,"y":30.517168,"task_id":18,"stat":"available","sid":5,"eid":2,"time":"1h以内","price":1,"txt":"想吃西瓜，不愿出门带zz，有人拯救吗","tag":"帮买水果","distance":89.3807,"epos":2}
    ];
    
    this.unDoneReqList = [];
    for (let i = 0; i < data.length; i++) {
              let req:any = data[i];
              req.type = req.tag;
              if (req.type == '帮带食堂饭菜' || req.type == '带食堂饭菜') req.thumbnail = "assets/img/food.jpg";
              if (req.type == '帮取快递') req.thumbnail = "assets/img/kuaidi.jpg";
              if (req.type == '帮买水果') req.thumbnail = "assets/img/fruit.jpg";
              if (req.type == '帮购商品') req.thumbnail = "assets/img/market.jpg";
              if (req.type == '帮还图书') req.thumbnail = "assets/img/book.jpg";          
              req.startplace = this.placeList[req.spos];
              req.endplace = this.placeList[req.epos];
              req.message = req.txt;
              this.unDoneReqList.push(req);
    }

  }

  ngAfterViewInit() {
    this.getUsername();
  }

  updatePicture() {
    console.log('Clicked to update picture');
  }

  // Present an alert with the current username populated
  // clicking OK will update the username and display it
  // clicking Cancel will close the alert and do nothing
  changeUsername() {
    let alert = this.alertCtrl.create({
      title: 'Change Username',
      buttons: [
        'Cancel'
      ]
    });
    alert.addInput({
      name: 'username',
      value: this.username,
      placeholder: 'username'
    });
    alert.addButton({
      text: 'Ok',
      handler: (data: any) => {
        this.userData.setUsername(data.username);
        this.getUsername();
      }
    });

    alert.present();
  }

  getUsername() {
    this.userData.getUsername().then((username) => {
      this.username = username;
    });
  }

  changePassword() {
    console.log('Clicked to change password');
  }

  doneWork() {
    this.nav.push(ReqListPage, {title:"已完成跑腿", list: this.doneReqList});
  }

  unDoneWork() {
    this.nav.push(ReqListPage, {title:"未完成跑腿", list: this.unDoneReqList});
  }

  logout() {
    this.userData.logout();
    this.nav.setRoot(LoginPage);
  }

  support() {
    this.nav.push(SupportPage);
  }
}
