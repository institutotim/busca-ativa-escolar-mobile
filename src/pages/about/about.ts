import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import {AuthHttp} from "angular2-jwt";

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(public navCtrl: NavController, public http: AuthHttp) {

  }

	testAuthRequest() {
		this.http.get('http://api.busca-ativa-escolar.local/api/v1/user_preferences').toPromise().then(function( res) {
			console.log("[auth request response] ",  res);
		})
	}

}
