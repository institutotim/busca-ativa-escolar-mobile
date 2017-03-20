import {Component, OnInit} from '@angular/core';

import {NavController, NavParams} from 'ionic-angular';
import {AuthService} from "../../providers/auth.service";
import {ChildrenService} from "../../providers/children.service";
import {Child} from "../../entities/Child";

@Component({
	selector: 'page-edit-step',
	templateUrl: 'edit-step.html'
})
export class EditStepPage implements OnInit {

	child: Child;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public auth: AuthService,
		public children: ChildrenService,
	) {
		this.child = navParams.get('child');
	}

	ngOnInit() {

	}

	saveLocally() {

	}

	saveOnline() {

	}
}
