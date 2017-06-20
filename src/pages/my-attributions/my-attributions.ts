import {Component, OnInit} from '@angular/core';

import {Events, Loading, LoadingController, NavController} from 'ionic-angular';
import {AuthHttp} from "angular2-jwt";
import {AuthService} from "../../providers/auth.service";
import {Observable} from "rxjs";
import {ChildrenService} from "../../providers/children.service";
import {Child} from "../../entities/Child";
import {ChildViewPage} from "../child-view/child-view";
import {LocalDataService} from "../../providers/local-data.service";
import {ConnectivityService} from "../../providers/connectivity.service";

@Component({
	selector: 'page-my-attributions',
	templateUrl: 'my-attributions.html'
})
export class MyAttributionsPage implements OnInit {

	attributions = []; //: Observable<Child[]>;

	loader: any;

	constructor(
		public navCtrl: NavController,
		public events: Events,
		public auth: AuthService,
		public loadingCtrl: LoadingController,
		public children: ChildrenService,
		public localData: LocalDataService,
		public connectivity: ConnectivityService,
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

	isAvailable(child: Child) : boolean {
		if(this.connectivity.isOnline()) return true;
		return this.localData.isMarkedAsCached("children", child.id);
	}

	protected refreshAttributions() {
		this.setLoading("Carregando atribuições...");

		this.children.getUserAttributions(this.auth.getUserID(), (response) => {
			this.setIdle();
		}).subscribe((attributions) => {
			this.attributions = attributions;
		})
	}

	openChild(child: Child) {

		if(!this.isAvailable(child)) {
			// TODO: show alert
			return;
		}

		this.navCtrl.push(ChildViewPage, {
			child: child
		});
	}

}
