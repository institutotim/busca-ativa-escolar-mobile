import {Component, OnInit} from '@angular/core';

import {NavController} from 'ionic-angular';
import {AuthHttp} from "angular2-jwt";
import {AuthService} from "../../providers/auth.service";
import {Observable} from "rxjs";
import {ChildrenService} from "../../providers/children.service";
import {Child} from "../../entities/Child";
import {ChildViewPage} from "../child-view/child-view";

@Component({
	selector: 'page-my-attributions',
	templateUrl: 'my-attributions.html'
})
export class MyAttributionsPage implements OnInit {

	attributions: Observable<Child[]>;

	constructor(
		public navCtrl: NavController,
		public auth: AuthService,
		public children: ChildrenService
	) {}

	ngOnInit() {
		this.refreshAttributions();
	}

	protected refreshAttributions() {
		this.attributions = this.children.getUserAttributions(this.auth.getUserID());
	}

	openChild(child: Child) {
		this.navCtrl.push(ChildViewPage, {
			child: child
		});
	}

}
