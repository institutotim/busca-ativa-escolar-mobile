import {Component, OnInit} from '@angular/core';

import {NavController, NavParams, ViewController} from 'ionic-angular';
import {AuthService} from "../../providers/auth.service";
import {ChildrenService} from "../../providers/children.service";
import {Child} from "../../entities/Child";
import {ChildViewPage} from "../child-view/child-view";
import {AuthHttp} from "angular2-jwt";
import {APIService} from "../../../providers/api.service";

@Component({
	selector: 'page-entity-picker',
	templateUrl: 'entity-picker.html'
})
export class EntityPickerModal implements OnInit {

	public items: Array<any> = [];
	public query: string = '';

	constructor(
		public navCtrl: NavController,
	    public params: NavParams,
	    public api: APIService,
	    public http: AuthHttp,
		public viewCtrl: ViewController
	) {}

	ngOnInit() {
		console.log("[modal.entity_picker] Created: ", this.params);

		if(this.params.get('prefill') === true) {
			this.fetchItems(null);
		}
	}

	fetchItems($event) {
		let loader = this.params.get('items');

		console.log("[modal.entity_picker] Fetching using callback: ", loader, 'query=', this.query);

		let result = loader(this.query);
		if(!result) return null;

		return result.subscribe((items) => {
			console.log("\t[modal.entity_picker] Rendering items: ", items);
			this.items = items;
		});
	}

	renderItem(item: any) {
		return this.params.get('render')(item);
	}

	cancel() {
		return this.viewCtrl.dismiss();
	}

	selectItem(item: any) {
		return this.viewCtrl.dismiss(item);
	}

}
