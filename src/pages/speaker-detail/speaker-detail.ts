import { Component, ViewChild } from '@angular/core';

import { NavController, NavParams, MenuController, Content } from 'ionic-angular';
import { UserData } from '../../providers/user-data';


@Component({
  selector: 'page-speaker-detail',
  templateUrl: 'speaker-detail.html'
})
export class SpeakerDetailPage {
  file: any;
  pdfSrc: any;
  screenState : boolean = false;
  originalSize : boolean = false;
  pdf: any;
  @ViewChild(Content) content: Content;

  constructor(
    public navCtrl: NavController, 
    public menu: MenuController,
    public navParams: NavParams,
    public user: UserData) {
    this.file = this.navParams.data;
    this.menu.enable(false);
    this.user.getServerAddr().then((serverAddr:any)=> {
      let tmpSrc = '';
      if (this.file.type == 'pdf') {
        tmpSrc = serverAddr + '/api/upload' + this.file.path;
      }
      else { 
        let filename = this.file.path.substr(0, this.file.path.lastIndexOf('.')) + '.pdf';
        tmpSrc = serverAddr + '/api/upload_pdf' + filename;
      }
      this.user.getCachedPdfData(tmpSrc).then((value : any)=> {
        if (value != null) this.pdfSrc = value;
          else this.pdfSrc = tmpSrc;
      });
    });
  }

  // ionViewDidEnter() {
  //   // the root left menu should be disabled on the tutorial page
  //   this.menu.enable(false);
  // }

  callBackFn(pdf: PDFDocumentProxy) {
    this.pdf = pdf;
    if (this.pdfSrc instanceof String) 
      this.pdf.getData().then((value: Uint8Array) => {
        this.user.cachePdfData(this.pdfSrc, value);
      });
    // this.pdf.getPage(1).then((page: PDFPageProxy) => {
    //   let pdfViewport: PDFPageViewport = page.getViewport(1.0);
    //   console.log("small page: width=" + pdfViewport.width + " height="+ pdfViewport.height);
    // });
  }

  fullScreen() {
    this.menu.enable(this.screenState);
    this.screenState = !this.screenState;
    //console.log(this.pdfViewer);
    // this.pdf.getPage(1).then((page: PDFPageProxy) => {
    //   let pdfViewport: PDFPageViewport = page.getViewport(1.0);
    //   pdfViewport.width += 100;
    //   console.log("full page: width=" + pdfViewport.width + " height="+ pdfViewport.height);
    // });
    this.navCtrl.push(SpeakerDetailPage, this.file);
    //this.pdfViewer.update();
  }

  ionViewDidLeave() {
    this.menu.enable(true);
    this.screenState = false;
  }
}
