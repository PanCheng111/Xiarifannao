import { Injectable } from '@angular/core';

import { Http } from '@angular/http';

import { UserData } from './user-data';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';


@Injectable()
export class ConferenceData {
  data: any;
  files: any;
  loginMessage: any;

  constructor(public http: Http, public user: UserData) { }

  load(): any {
    if (this.data) {
      return Observable.of(this.data);
    } else {
      return this.http.get('assets/data/data.json')
        .map(this.processData, this);
    }
  }

  loadFiles(path: string): any {
    return this.user.getServerAddr().then((serverAddr : string)=>{
      return this.http.get(serverAddr + '/api/manage/filesList/list?filePath=' + path).map((data: any)=>{
        this.files = data.json();
        console.log("filesList=" + this.files);
        return this.files;
      }, this);
    });
  }

  getFiles(path: string): any {
    return this.loadFiles(path);
  }

  checkLogin(username: string, password: string) : any {
    return this.user.getServerAddr().then((serverAddr : string) => {
      return this.http.get(serverAddr + '/api/doLogin?userName='+username+'&password='+password).map((data:any)=>{
        this.loginMessage = data.json().status;
        return this.loginMessage;
      }, this);
    });
  }

  getMeetings() : any {
    return this.user.getServerAddr().then((serverAddr : string) => {
      return this.http.get(serverAddr + '/api/manage/meetingsList/list').map((data:any)=>{
        let meetingsList = data.json();
        return meetingsList;
      }, this);
    });
  }

  getScheduleList() : any {
    return this.user.getServerAddr().then((serverAddr : string) => {
      return this.user.getSelectedMeeting().then((meeting:any)=>{
        return this.http.get(serverAddr + '/api/manage/MeetingsList/item?uid='+meeting._id).map((data:any)=>{
          let schedules = data.json().schedules;
          return schedules;
        }, this);
      })
    });
  }

  getUsersAttendList() : any {
      return this.user.getServerAddr().then((serverAddr : string) => {
        return this.user.getSelectedMeeting().then((meeting:any)=>{
          return this.http.get(serverAddr + '/api/manage/MeetingsList/item?uid='+meeting._id).map((data:any)=>{
            let usersAttend = {
              usersAttend: data.json().usersAttend,
              usersCheckIn : data.json().usersCheckIn
            };
            return usersAttend;
          }, this);
        })
      });
  }

  getMeetingInfo() : any {
      return this.user.getServerAddr().then((serverAddr : string) => {
        return this.user.getSelectedMeeting().then((meeting:any)=>{
          return this.http.get(serverAddr + '/api/manage/MeetingsList/item?uid='+meeting._id).map((data:any)=>{
            let meetingInfo = data.json();
            return meetingInfo;
          }, this);
        })
      });
  }

  sendCheckIn(meeting: any) {
      return this.user.getServerAddr().then((serverAddr: string) => {
        return this.user.getUsername().then((userName:string) => {
          return this.http.get(serverAddr + '/api/manage/meetingsList/checkIn?mid='+meeting._id+'&userName='+userName).map((data:any)=>{
            let info = data.json();
            return info;
          }, this);
        })
      });
  }

  sendCheckOut(meeting: any) {
      this.user.getServerAddr().then((serverAddr: string) => {
        this.user.getUsername().then((userName:string)=> {
          this.http.get(serverAddr + '/api/manage/meetingsList/checkOut?id='+meeting._id+'&userName='+userName).map((data:any)=>{
            let info = data.json();
            return info;
          }, this);
        })
      });
  }
  processData(data: any) {
    // just some good 'ol JS fun with objects and arrays
    // build up the data by linking speakers to sessions
    this.data = data.json();

    this.data.tracks = [];

    // loop through each day in the schedule
    this.data.schedule.forEach((day: any) => {
      // loop through each timeline group in the day
      day.groups.forEach((group: any) => {
        // loop through each session in the timeline group
        group.sessions.forEach((session: any) => {
          session.speakers = [];
          if (session.speakerNames) {
            session.speakerNames.forEach((speakerName: any) => {
              let speaker = this.data.speakers.find((s: any) => s.name === speakerName);
              if (speaker) {
                session.speakers.push(speaker);
                speaker.sessions = speaker.sessions || [];
                speaker.sessions.push(session);
              }
            });
          }

          if (session.tracks) {
            session.tracks.forEach((track: any) => {
              if (this.data.tracks.indexOf(track) < 0) {
                this.data.tracks.push(track);
              }
            });
          }
        });
      });
    });

    return this.data;
  }

  
  getTimeline(dayIndex: number, queryText = '', excludeTracks: any[] = [], segment = 'all') {
    return this.load().map((data: any) => {
      let day = data.schedule[dayIndex];
      day.shownSessions = 0;

      queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
      let queryWords = queryText.split(' ').filter(w => !!w.trim().length);

      day.groups.forEach((group: any) => {
        group.hide = true;

        group.sessions.forEach((session: any) => {
          // check if this session should show or not
          this.filterSession(session, queryWords, excludeTracks, segment);

          if (!session.hide) {
            // if this session is not hidden then this group should show
            group.hide = false;
            day.shownSessions++;
          }
        });

      });

      return day;
    });
  }

  filterSession(session: any, queryWords: string[], excludeTracks: any[], segment: string) {

    let matchesQueryText = false;
    if (queryWords.length) {
      // of any query word is in the session name than it passes the query test
      queryWords.forEach((queryWord: string) => {
        if (session.name.toLowerCase().indexOf(queryWord) > -1) {
          matchesQueryText = true;
        }
      });
    } else {
      // if there are no query words then this session passes the query test
      matchesQueryText = true;
    }

    // if any of the sessions tracks are not in the
    // exclude tracks then this session passes the track test
    let matchesTracks = false;
    session.tracks.forEach((trackName: string) => {
      if (excludeTracks.indexOf(trackName) === -1) {
        matchesTracks = true;
      }
    });

    // if the segement is 'favorites', but session is not a user favorite
    // then this session does not pass the segment test
    let matchesSegment = false;
    if (segment === 'favorites') {
      if (this.user.hasFavorite(session.name)) {
        matchesSegment = true;
      }
    } else {
      matchesSegment = true;
    }

    // all tests must be true if it should not be hidden
    session.hide = !(matchesQueryText && matchesTracks && matchesSegment);
  }

  getSpeakers() {
    return this.load().map((data: any) => {
      return data.speakers.sort((a: any, b: any) => {
        let aName = a.name.split(' ').pop();
        let bName = b.name.split(' ').pop();
        return aName.localeCompare(bName);
      });
    });
  }

  getTracks() {
    return this.load().map((data: any) => {
      return data.tracks.sort();
    });
  }

  getMap() {
    return this.load().map((data: any) => {
      return data.map;
    });
  }

}
