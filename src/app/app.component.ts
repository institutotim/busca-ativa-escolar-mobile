import {Component} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';

import {TabsPage} from '../pages/tabs/tabs';
import {LoginPage} from "../pages/login/login";
import {AuthService} from "../providers/auth.service";
import {APIService} from "../providers/api.service";
import {DashboardPage} from "../pages/dashboard/dashboard";
import {ConnectivityService} from "../providers/connectivity.service";


@Component({
	templateUrl: 'app.html'
})
export class MyApp {

	rootPage : any;

	constructor(
		platform: Platform,
		auth: AuthService,
	    api: APIService,
	    connectivity: ConnectivityService
	) {
		platform.ready().then(() => {
			console.log("---------- APP START ----------");
			
			StatusBar.styleDefault();
			Splashscreen.hide();

			connectivity.setup();

			auth.loadSessionFromStorage().then((session) => {
				if(auth.isLoggedIn()) {
					console.log("Already logged in! ", auth.getUser());
					return this.rootPage = DashboardPage;
				}

				return this.rootPage = LoginPage;

			})

		});
	}

}
