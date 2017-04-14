import { Component, ViewChild, ElementRef } from '@angular/core';

import { ConferenceData } from '../../providers/conference-data';

import { Platform } from 'ionic-angular';
import * as io from "socket.io-client";

declare var google: any;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  usersList:any[];
  usersCheckIn:any[];
  groups:any[] = [];
  shownUsers: Number = 0;
  socket: any;

  @ViewChild('mapCanvas') mapElement: ElementRef;
  constructor(public confData: ConferenceData, public platform: Platform) {
  }

  doRefresh(refresher:any) {
    console.log('Begin async operation', refresher);
      this.groups = [];
      this.confData.getUsersAttendList().then((obversabler:any) => {
        obversabler.subscribe((value:any)=> {
          this.usersList = value.usersAttend;
          this.usersCheckIn = value.usersCheckIn;
          if (this.usersList) this.shownUsers = this.usersList.length;
          for (let i = 0; i < this.usersList.length; i++) {
            let flag = false;
            if (this.usersCheckIn.indexOf(this.usersList[i].userName) != -1) 
              this.usersList[i].showCheckIn = true;
            else this.usersList[i].showCheckIn = false;
            for (let j = 0; j < this.groups.length; j++)
              if (this.groups[j].name == this.usersList[i].group.name) {
                flag = true;
                this.groups[j].usersList.push(this.usersList[i]);
              }
            if (!flag) {
              this.groups.push({
                name: this.usersList[i].group.name,
                usersList : [this.usersList[i]]
              });
            }
          }
          refresher.complete();
        });
      });
  }

  ionViewDidLoad() {
      //this.socket = io('http://192.168.1.100:8080');
      
      this.confData.getUsersAttendList().then((obversabler:any) => {
        obversabler.subscribe((value:any)=> {
          this.usersList = value.usersAttend;
          this.usersCheckIn = value.usersCheckIn;
          if (this.usersList) this.shownUsers = this.usersList.length;
          for (let i = 0; i < this.usersList.length; i++) {
            let flag = false;
            if (this.usersCheckIn.indexOf(this.usersList[i].userName) != -1) 
              this.usersList[i].showCheckIn = true;
            else this.usersList[i].showCheckIn = false;
            for (let j = 0; j < this.groups.length; j++)
              if (this.groups[j].name == this.usersList[i].group.name) {
                flag = true;
                this.groups[j].usersList.push(this.usersList[i]);
              }
            if (!flag) {
              this.groups.push({
                name: this.usersList[i].group.name,
                usersList : [this.usersList[i]]
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
