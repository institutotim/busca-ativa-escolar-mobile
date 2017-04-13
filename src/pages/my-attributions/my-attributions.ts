import {Component, OnInit} from '@angular/core';

import {Events, Loading, LoadingController, NavController} from 'ionic-angular';
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

	loader: any;

	constructor(
		public navCtrl: NavController,
		public events: Events,
		public auth: AuthService,
		public loadingCtrl: LoadingController,
		public children: ChildrenService
	) {}

	ngOnInit() {

		this.loader = this.loadingCtrl.create({
			content: 'Carregando atribuições...'
		});

		this.refreshAttributions();

		this.events.subscribe('stepCompleted', () => {
			this.refreshAttributions();
		})
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

	protected refreshAttributions() {
		this.setLoading("Carregando atribuições...");

		this.attributions = this.children.getUserAttributions(this.auth.getUserID(), (response) => {
			this.setIdle();
		});
	}

	openChild(child: Child) {
		this.navCtrl.push(ChildViewPage, {
			child: child
		});
	}

}
