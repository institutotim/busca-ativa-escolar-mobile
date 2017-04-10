import {Component, Inject, OnInit} from '@angular/core';

import {LoadingController, NavController} from 'ionic-angular';
import {AuthService} from "../../providers/auth.service";
import {Storage} from "@ionic/storage";
import {AuthHttp} from "angular2-jwt";
import {TabsPage} from "../tabs/tabs";
import {APIService} from "../../providers/api.service";

@Component({
	selector: 'page-login',
	templateUrl: 'login.html'
})
export class LoginPage implements OnInit {

	loader: any;

	constructor(
		public navCtrl: NavController,
		public loadingCtrl: LoadingController,
		public auth: AuthService,
		public api: APIService,
	) {}

	ngOnInit() {
		this.loader = this.loadingCtrl.create({
			content: "Autenticando..."
		});
	}

	login(email: string, password: string) {
		this.loader.present();
		//this.auth.login(email, password).then(this.onLogin.bind(this), this.onError.bind(this));
	}

	onLogin(data: Object) {
		this.loader.dismiss();
		console.log("Logged in: ", data);
		this.navCtrl.setRoot(TabsPage);
	}

	onError(data: Object) {
		this.loader.dismiss();
		console.error("Error: ", data);
	}

}
