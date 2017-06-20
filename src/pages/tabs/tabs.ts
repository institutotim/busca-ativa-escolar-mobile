import {Component, OnInit, ViewChild} from '@angular/core';

import {AuthService} from "../../providers/auth.service";
import {NavController, NavParams, Tabs} from "ionic-angular";
import {LoginPage} from "../login/login";
import {MyAttributionsPage} from "../my-attributions/my-attributions";
import {APIService} from "../../providers/api.service";
import {SpawnAlertPage} from "../spawn-alert/spawn-alert";
import {ConnectivityService} from "../../providers/connectivity.service";
import {SyncPage} from "../sync/sync";
import {AppSettingsService} from "../../providers/settings.service";

@Component({
	templateUrl: 'tabs.html'
})
export class TabsPage implements OnInit {

	static TAB_SPAWN_ALERT = 0;
	static TAB_MY_ATTRIBUTIONS = 1;
	static TAB_SYNC = 2;

	// this tells the tabs component which Pages
	// should be each tab's root Page
	tab1Root: any = SpawnAlertPage;
	tab2Root: any = MyAttributionsPage;
	tab3Root: any = SyncPage;

	_isOnline = true;

	@ViewChild("tabs") tabs: Tabs;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
        public auth: AuthService,
        public api: APIService,
        public connectivity: ConnectivityService,
        public settings: AppSettingsService,
	) {
		api.setNavController(navCtrl);
	}

	ngOnInit() {

	}

	isOnline() {
		return this.connectivity.isOnline();
	}

	isProduction() {
		return this.settings.isProductionEndpoint();
	}

	ionViewDidEnter() {
		let tab = this.navParams.get('tab');

		if(tab) {
			console.log("Selecting tab: ", tab);
			this.tabs.select(tab);
		}
	}

	isAgenteComunitario() {
		return (this.auth.isLoggedIn() && this.auth.getUser().type === 'agente_comunitario');
	}

	logout() {
		this.auth.logout();
		this.navCtrl.setRoot(LoginPage);
	}

}
