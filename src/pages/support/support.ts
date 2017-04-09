import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { UserData } from '../../providers/user-data';
import { AlertController, NavController, ToastController, MenuController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-user',
  templateUrl: 'support.html'
})
export class SupportPage {

  submitted: boolean = false;
  supportMessage: string;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public userData: UserData,
    public nav: NavController,
    public menu: MenuController
  ) {

  }

  ionViewDidEnter() {
    this.userData.getServerAddr().then((value)=>{
       if (value) this.supportMessage = value;
    });
    // let toast = this.toastCtrl.create({
    //   message: 'This does not actually send a support request.',
    //   duration: 3000
    // });
    // toast.present();
  }

  submit(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      this.userData.setServerAddr(this.supportMessage);
      this.supportMessage = '';
      this.submitted = false;

      let toast = this.toastCtrl.create({
        message: '已保存服务器地址.',
        duration: 3000
      });
      toast.present();
    }
    this.nav.setRoot(LoginPage);
  }

  // If the user enters text in the support question and then navigates
  // without submitting first, ask if they meant to leave the page
  ionViewCanLeave(): boolean | Promise<boolean> {
    // If the support message is empty we should just navigate
    if (!this.supportMessage || this.supportMessage.trim().length === 0) {
      return true;
    }

    return new Promise((resolve: any, reject: any) => {
      let alert = this.alertCtrl.create({
        title: '确定离开该界面吗?',
        message: '确定离开该界面吗? 您填写的服务器地址将不会保存。'
      });
      alert.addButton({ text: '留下', handler: reject });
      alert.addButton({ text: '离开', role: 'cancel', handler: resolve });

      alert.present();
    });
  }
}
