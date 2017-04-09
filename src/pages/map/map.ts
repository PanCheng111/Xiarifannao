import { Component, ViewChild, ElementRef } from '@angular/core';

import { ConferenceData } from '../../providers/conference-data';

import { Platform } from 'ionic-angular';


declare var google: any;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  usersList:any[]
  groups:any[] = [];
  shownUsers: Number = 0;

  @ViewChild('mapCanvas') mapElement: ElementRef;
  constructor(public confData: ConferenceData, public platform: Platform) {
  }

  ionViewDidLoad() {
      this.confData.getUsersAttendList().then((obversabler:any) => {
        obversabler.subscribe((value:any)=> {
          this.usersList = value;
          if (value) this.shownUsers = value.length;
          for (let i = 0; i < value.length; i++) {
            let flag = false;
            for (let j = 0; j < this.groups.length; j++)
              if (this.groups[j].name == value[i].group.name) {
                flag = true;
                this.groups[j].usersList.push(value[i]);
              }
            if (!flag) {
              this.groups.push({
                name: value[i].group.name,
                usersList : [value[i]]
              });
            }
          }
        });
      });
      // this.confData.getMap().subscribe((mapData: any) => {
      //   let mapEle = this.mapElement.nativeElement;

      //   let map = new google.maps.Map(mapEle, {
      //     center: mapData.find((d: any) => d.center),
      //     zoom: 16
      //   });

      //   mapData.forEach((markerData: any) => {
      //     let infoWindow = new google.maps.InfoWindow({
      //       content: `<h5>${markerData.name}</h5>`
      //     });

      //     let marker = new google.maps.Marker({
      //       position: markerData,
      //       map: map,
      //       title: markerData.name
      //     });

      //     marker.addListener('click', () => {
      //       infoWindow.open(map, marker);
      //     });
      //   });

      //   google.maps.event.addListenerOnce(map, 'idle', () => {
      //     mapEle.classList.add('show-map');
      //   });

      // });

  }
}
