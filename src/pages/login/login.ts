import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { NavController, MenuController, ToastController } from 'ionic-angular';
import { PopoverController } from 'ionic-angular';

import { MeetingListPage } from '../meeting-list/meeting-list';
import { SignupPage } from '../signup/signup';
import { TabsPage } from '../tabs/tabs';
import { UserData } from '../../providers/user-data';
import { PopoverPage } from '../about-popover/about-popover';
import { ConferenceData } from '../../providers/conference-data';


@Component({
  selector: 'page-user',
  templateUrl: 'login.html'
})
export class LoginPage {
  login: {username?: string, password?: string} = {};
  submitted = false;

  constructor(public navCtrl: NavController, 
    public menu: MenuController, 
    public userData: UserData,
    public confData: ConferenceData,
    public toastCtrl: ToastController,
    public popoverCtrl: PopoverController) { }

  onLogin(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      this.confData.checkLogin(this.login.username, this.login.password).then((obversabler:any)=>{
        obversabler.subscribe((value:any)=>{
          console.log("login obversabler = " + value);
          if (value == 'success') {
            this.userData.login(this.login.username);
            this.navCtrl.push(MeetingListPage);
          }
          else {
                let toast = this.toastCtrl.create({
                    message: '用户名或密码错误!',
                    duration: 3000
                });
                toast.present();
                this.login = {};
          }
        });        
      });
    }
  }

  onSignup() {
    this.navCtrl.push(SignupPage);
  }

  presentPopover(event: Event) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({ ev: event });
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }

  ionViewDidLeave() {
    // enable the root left menu when leaving the tutorial page
    //this.menu.enable(true);
  }

}
