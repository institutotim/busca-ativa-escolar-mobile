import {Component} from '@angular/core';

import {AuthService} from "../../providers/auth.service";
import {NavController} from "ionic-angular";
import {LoginPage} from "../login/login";
import {MyAttributionsPage} from "../my-attributions/my-attributions";
import {APIService} from "../../providers/api.service";
import {SpawnAlertPage} from "../spawn-alert/spawn-alert";

@Component({
	templateUrl: 'tabs.html'
})
export class TabsPage {
	// this tells the tabs component which Pages
	// should be each tab's root Page
	tab1Root: any = SpawnAlertPage;
	tab2Root: any = MyAttributionsPage;
	tab3Root: any;

	constructor(public navCtrl: NavController,
	            public auth: AuthService,
	            public api: APIService,
	) {
		api.setNavController(navCtrl);
	}

	isAgenteComunitario() {
		return (this.auth.isLoggedIn() && this.auth.getUser().type === 'agente_comunitario');
	}

	logout() {
		this.auth.logout();
		this.navCtrl.setRoot(LoginPage);
	}

}
