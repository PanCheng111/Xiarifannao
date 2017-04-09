import { Component } from '@angular/core';
import { ConferenceData } from '../../providers/conference-data';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  conferenceDate = '2047-05-17';
  meeting: any = {};

  constructor(public confData: ConferenceData) { }

  ionViewDidLoad() {
    this.confData.getMeetingInfo().then((obversabler:any)=>{
      //fun.then((obversabler:any)=>{
        obversabler.subscribe((meetingData:any)=>{
          this.meeting = meetingData;
        });
    //  });
    });
  }

}
