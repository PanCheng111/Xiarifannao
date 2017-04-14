import { Component, ViewChild } from '@angular/core';

import { Events, MenuController, Nav, Platform } from 'ionic-angular';
import { ViewController, NavController, App, ModalController } from 'ionic-angular';

import { SupportPage } from '../support/support';
import { LoginPage } from '../login/login';
import { AccountPage } from '../account/account';

@Component({
  template: `
    <ion-list>
      <button ion-item (click)="user()">账户</button>
      <button ion-item (click)="logout()">登出</button>
      <button ion-item (click)="support()">服务器</button>
    </ion-list>
  `
})
export class MenuPopoverPage {
  // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public app: App,
    public modalCtrl: ModalController
  ) { }

  support() {
    this.app.getRootNav().push(SupportPage);
    this.viewCtrl.dismiss();
  }

  logout() {
    this.app.getRootNav().push(LoginPage);
    this.viewCtrl.dismiss();    
  }

  user() {
    this.navCtrl.push(AccountPage);
  }

  close(url: string) {
    window.open(url, '_blank');
    this.viewCtrl.dismiss();
  }
}