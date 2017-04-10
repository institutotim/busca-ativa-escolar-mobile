import {Component} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';

import {TabsPage} from '../pages/tabs/tabs';
import {LoginPage} from "../pages/login/login";
import {AuthService} from "../providers/auth.service";
import {APIService} from "../providers/api.service";


@Component({
	templateUrl: 'app.html'
})
export class MyApp {

	rootPage : any;

	constructor(
		platform: Platform,
		auth: AuthService,
	    api: APIService,
	) {
		platform.ready().then(() => {
			StatusBar.styleDefault();
			Splashscreen.hide();

			auth.loadSessionFromStorage().then((session) => {
				if(auth.isLoggedIn()) {
					console.log("Already logged in! ", auth.getUser());
					return this.rootPage = TabsPage;
				}

				return this.rootPage = LoginPage;

			})

		});
	}

}
