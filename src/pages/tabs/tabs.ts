import { Component } from '@angular/core';

import {AuthService} from "../../providers/auth.service";
import {NavController} from "ionic-angular";
import {LoginPage} from "../login/login";
import {MyAttributionsPage} from "../my-attributions/my-attributions";
import {APIService} from "../../providers/api.service";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = MyAttributionsPage;
  tab2Root: any;
  tab3Root: any;

  constructor(
  	public navCtrl : NavController,
    public auth : AuthService,
    public api: APIService,
  ) {
  	api.setNavController(navCtrl);
  }

  logout() {
	  this.auth.logout();
	  this.navCtrl.setRoot(LoginPage);
  }

}
