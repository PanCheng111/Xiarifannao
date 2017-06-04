import { Component, ViewChild } from '@angular/core';

import { Events, MenuController, Nav, Platform, PopoverController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { AboutPage } from '../pages/about/about';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { MapPage } from '../pages/map/map';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs/tabs';
//import { TutorialPage } from '../pages/tutorial/tutorial';
//import { SchedulePage } from '../pages/schedule/schedule';
import { SpeakerListPage } from '../pages/speaker-list/speaker-list';
import { SupportPage } from '../pages/support/support';
//import { MeetingListPage} from '../pages/meeting-list/meeting-list';
import { MenuPopoverPage } from '../pages/menu-popover/menu-popover';
import { ReqCreatePage } from '../pages/req-create/req-create';

import { ConferenceData } from '../providers/conference-data';
import { UserData } from '../providers/user-data';

export interface PageInterface {
  title: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
  tabComponent?: any;
}

@Component({
  templateUrl: 'app.template.html'
})
export class ConferenceApp {
  // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

  // List of pages that can be navigated to from the left menu
  // the left menu only works after login
  // the login page disables the left menu
  appPages: PageInterface[] = [
   // { title: '会议流程', component: TabsPage, tabComponent: SchedulePage, icon: 'calendar' },
    { title: '跑腿主页', component: TabsPage, tabComponent: HomePage, index: 0, icon: 'home' },
    { title: '发布任务', component: TabsPage, tabComponent: ReqCreatePage, index: 1, icon: 'cloud-upload' },
    { title: '我的账户', component: TabsPage, tabComponent: AccountPage, index: 2, icon: 'information-circle' }
  ];
  // loggedInPages: PageInterface[] = [
  //   { title: '账户', component: AccountPage, icon: 'person' },
  //   { title: '登出', component: LoginPage, icon: 'log-out', logsOut: true },
  //   { title: '服务器', component: SupportPage, icon: 'hammer' },
  // ];
  // loggedOutPages: PageInterface[] = [
  //   { title: '登录', component: LoginPage, icon: 'log-in' },
  //   { title: '注册', component: SignupPage, icon: 'person-add' },
  //   { title: '服务器', component: SupportPage, icon: 'hammer' },
  // ];
  rootPage: any;

  constructor(
    public events: Events,
    public userData: UserData,
    public menu: MenuController,
    public platform: Platform,
    public storage: Storage,
    public confData: ConferenceData,
    public splashScreen: SplashScreen,
    public popoverCtrl: PopoverController
  ) {
    // Check if the user has already seen the tutorial
    //this.storage.get('hasSeenTutorial')

    //隐藏边栏
    this.menu.enable(false);
    this.storage.get('hasLogin')
      .then((hasServerAddr) => {
        if (!hasServerAddr) {
          this.rootPage = LoginPage;
        } else {
          this.rootPage = TabsPage;
        }
        this.platformReady()
      })

    // load the conference data
    confData.load();
    //confData.loadPlace();

    // decide which menu items should be hidden by current login status stored in local storage
    // this.userData.hasLoggedIn().then((hasLoggedIn) => {
    //   this.enableMenu(hasLoggedIn === true);
    // });

   // this.listenToLoginEvents();
  }

  openPage(page: PageInterface) {
    // the nav component was found using @ViewChild(Nav)
    // reset the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    if (page.index) {
      this.nav.setRoot(page.component, { tabIndex: page.index }).catch(() => {
        console.log("Didn't set nav root");
      });
    } else {
      this.nav.setRoot(page.component).catch(() => {
        console.log("Didn't set nav root");
      });
    }

    if (page.logsOut === true) {
      // Give the menu time to close before changing to logged out
      setTimeout(() => {
        this.userData.logout();
      }, 1000);
    }
  }

  presentPopover(event: Event) {
    let popover = this.popoverCtrl.create(MenuPopoverPage);
    popover.present({ ev: event });
  }
  // openTutorial() {
  //   this.nav.setRoot(TutorialPage);
  // }

  // listenToLoginEvents() {
  //   this.events.subscribe('user:login', () => {
  //     this.enableMenu(true);
  //   });

  //   this.events.subscribe('user:signup', () => {
  //     this.enableMenu(true);
  //   });

  //   this.events.subscribe('user:logout', () => {
  //     this.enableMenu(false);
  //   });
  // }

  // enableMenu(loggedIn: boolean) {
  //   this.menu.enable(loggedIn, 'loggedInMenu');
  //   this.menu.enable(!loggedIn, 'loggedOutMenu');
  // }

  platformReady() {
    // Call any initial plugins when ready
    this.platform.ready().then(() => {
      this.splashScreen.hide();
    });
  }

  isActive(page: PageInterface) {
    let childNav = this.nav.getActiveChildNav();

    // Tabs are a special case because they have their own navigation
    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'primary';
      }
      return;
    }

    if (this.nav.getActive() && this.nav.getActive().component === page.component) {
      return 'primary';
    }
    return;
  }
}
