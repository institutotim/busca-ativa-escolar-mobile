import {Component, Inject, OnInit} from '@angular/core';

import {AlertController, LoadingController, NavController} from 'ionic-angular';
import {AuthService} from "../../providers/auth.service";
import {Storage} from "@ionic/storage";
import {AuthHttp} from "angular2-jwt";
import {TabsPage} from "../tabs/tabs";
import {APIService} from "../../providers/api.service";
import {DashboardPage} from "../dashboard/dashboard";

@Component({
	selector: 'page-login',
	templateUrl: 'login.html'
})
export class LoginPage implements OnInit {

	loader: any;

	constructor(
		public navCtrl: NavController,
		public loadCtrl: LoadingController,
		public alertCtrl: AlertController,
		public auth: AuthService,
		public api: APIService,
	) {}

	ngOnInit() {

	}

	setLoading(message) {
		this.loader = this.loadCtrl.create({
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

	login(email: string, password: string) {
		this.setLoading("Autenticando...");
		this.auth.login(email, password).then(this.onLogin.bind(this), this.onError.bind(this));
	}

	onLogin(data: any) {
		this.setIdle();
		console.log("Logged in: ", data);
		this.navCtrl.setRoot(DashboardPage);
	}

	onError(data: any) {
		this.setIdle();

		if(data && data.error === 'invalid_credentials') {

			this.alertCtrl.create({
				title: 'Usuário ou senha inválidos!',
				subTitle: 'Verifique se os dados digitados estão corretos, e tente novamente.',
				buttons: ['OK']
			}).present();

		}

		console.error("Error: ", data);
	}

}
