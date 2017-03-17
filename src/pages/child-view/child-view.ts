import {Component, OnInit} from '@angular/core';

import {NavController, NavParams} from 'ionic-angular';
import {AuthHttp} from "angular2-jwt";
import {AuthService} from "../../providers/auth.service";
import {Observable} from "rxjs";
import {ChildrenService} from "../../providers/children.service";
import {Child} from "../../entities/Child";

@Component({
	selector: 'page-child-view',
	templateUrl: 'child-view.html'
})
export class ChildViewPage {

	child: Child;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public auth: AuthService,
		public children: ChildrenService
	) {
		this.child = navParams.get('child');
	}
}
