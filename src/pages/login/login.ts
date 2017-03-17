import {Component} from '@angular/core';

import {NavController} from 'ionic-angular';
import {AuthService} from "../../providers/auth.service";
import {Storage} from "@ionic/storage";
import {AuthHttp} from "angular2-jwt";

@Component({
	selector: 'page-login',
	templateUrl: 'login.html'
})
export class LoginPage {

	constructor(public navCtrl: NavController, public storage:Storage, public auth: AuthService, public http: AuthHttp) {}

	login(email: string, password: string) {
		this.auth.login(email, password).then(this.onLogin.bind(this), this.onError.bind(this));
	}

	onLogin(data: Object) {
		console.log("Logged in: ", data);
	}

	onError(data: Object) {
		console.error("Error: ", data);
	}

	testAuthRequest() {
		this.http.get('http://api.busca-ativa-escolar.local/api/v1/user_preferences').toPromise().then(function( res) {
			console.log("[auth request response] ",  res);
		})
	}

}
