import { Component } from '@angular/core';

import { NavController, NavParams, MenuController } from 'ionic-angular';

import { SessionDetailPage } from '../session-detail/session-detail';


@Component({
  selector: 'page-speaker-detail',
  templateUrl: 'speaker-detail.html'
})
export class SpeakerDetailPage {
  file: any;
  pdfSrc: string = '';
  screenState : boolean = false;

  constructor(
    public navCtrl: NavController, 
    public menu: MenuController,
    public navParams: NavParams) {
    this.file = this.navParams.data;
    if (this.file.type == 'pdf') {
      this.pdfSrc = 'http://localhost:3000/api/upload' + this.file.path;
    }
    else {
      let filename = this.file.path.substr(0, this.file.path.lastIndexOf('.')) + '.pdf';
      this.pdfSrc = 'http://localhost:3000/api/upload_pdf' + filename;
    }
  }

  fullScreen() {
    this.menu.enable(this.screenState);
    this.screenState = !this.screenState;
  }

  ionViewDidLeave() {
    this.menu.enable(true);
    this.screenState = false;
  }
}
