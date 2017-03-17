import { Component } from '@angular/core';

import {AuthService} from "../../providers/auth.service";
import {NavController} from "ionic-angular";
import {LoginPage} from "../login/login";
import {MyAttributionsPage} from "../my-attributions/my-attributions";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = MyAttributionsPage;
  tab2Root: any;
  tab3Root: any;

  constructor(public navCtrl : NavController, public auth : AuthService) {}

  logout() {
	  this.auth.logout();
	  this.navCtrl.setRoot(LoginPage);
  }

}
