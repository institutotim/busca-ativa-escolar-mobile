import {Component, OnInit} from '@angular/core';

import {Events, LoadingController, NavController} from 'ionic-angular';
import {AuthService} from "../../providers/auth.service";
import {ChildrenService} from "../../providers/children.service";
import {MyAttributionsPage} from "../my-attributions/my-attributions";
import {SpawnAlertPage} from "../spawn-alert/spawn-alert";
import {LoginPage} from "../login/login";
import {TabsPage} from "../tabs/tabs";

@Component({
	selector: 'page-dashboard',
	templateUrl: 'dashboard.html'
})
export class DashboardPage implements OnInit {

	loader: any;
	user: any;

	constructor(
		public navCtrl: NavController,
		public events: Events,
		public auth: AuthService,
		public loadingCtrl: LoadingController,
		public children: ChildrenService
	) {}

	ngOnInit() {

		this.user = this.auth.getUser();

		this.loader = this.loadingCtrl.create({
			content: 'Carregando atribuições...'
		});
	}

	openMyAttributions() {
		console.log("[dashboard] Go: MyAttributionsPage");
		this.navCtrl.setRoot(TabsPage, {tab: TabsPage.TAB_MY_ATTRIBUTIONS});
	}

	openSpawnAlert() {
		console.log("[dashboard] Go: SpawnAlertPage");
		this.navCtrl.setRoot(TabsPage, {tab: TabsPage.TAB_SPAWN_ALERT});
	}

	isAgenteComunitario() {
		return (this.auth.isLoggedIn() && this.auth.getUser().type === 'agente_comunitario');
	}

	logout() {
		this.auth.logout();
		this.navCtrl.setRoot(LoginPage);
	}

	setLoading(message) {
		this.loader = this.loadingCtrl.create({
			content: message,
		});

		this.loader.onDidDismiss(() => {
			this.loader = null;
		});

		this.loader.present();
	}

	setIdle() {
		if(!this.loader) return;
		this.loader.dismiss();
	}

}
