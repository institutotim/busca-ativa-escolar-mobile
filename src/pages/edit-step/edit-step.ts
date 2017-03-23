import {Component, OnInit} from '@angular/core';

import {NavController, NavParams} from 'ionic-angular';
import {AuthService} from "../../providers/auth.service";
import {ChildrenService} from "../../providers/children.service";
import {Child} from "../../entities/Child";
import {StaticDataService} from "../../providers/static-data.service";
import {UtilsService} from "../../providers/utils.service";

@Component({
	selector: 'page-edit-step',
	templateUrl: 'edit-step.html'
})
export class EditStepPage implements OnInit {

	child: Child;
	step: any;

	genders = [];
	races = [];
	fields = {};

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public auth: AuthService,
		public children: ChildrenService,
	    public utils: UtilsService,
	    public staticData: StaticDataService,
	) {
		this.child = navParams.get('child');
	}

	ngOnInit() {
		this.children.getStepData(this.child.current_step_type, this.child.current_step_id).subscribe((data) => {
			this.step = data;
			this.fields = this.step.fields;
		});

		this.staticData.get('Gender').subscribe((genders) => {
			this.genders = this.utils.objectToArray(genders);
			console.log("genders=", this.genders);
		});

		this.staticData.get('Race').subscribe((races) => {
			this.races = this.utils.objectToArray(races);
			console.log("races=", this.races);
		});
	}

	renderLabel(field: string) : string {
		return field;
	}

	saveLocally() {

	}

	saveOnline() {
		this.children.updateStepFields(this.step);
	}
}
