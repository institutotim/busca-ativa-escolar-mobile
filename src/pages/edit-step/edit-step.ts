import {Component, OnInit} from '@angular/core';

import {NavController, NavParams} from 'ionic-angular';
import {AuthService} from "../../providers/auth.service";
import {ChildrenService} from "../../providers/children.service";
import {Child} from "../../entities/Child";
import {StaticDataService} from "../../providers/static-data.service";
import {UtilsService} from "../../providers/utils.service";
import {Form, FormBuilderService} from "../../providers/form-builder.service";
import {Observable} from "rxjs";

@Component({
	selector: 'page-edit-step',
	templateUrl: 'edit-step.html'
})
export class EditStepPage implements OnInit {

	child: Child;
	step: any;
	form: Form;
	formTree: Array<any> = [];

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
	    public formBuilder: FormBuilderService,
	) {
		this.child = navParams.get('child');
	}

	ngOnInit() {
		this.children.getStepData(this.child.current_step_type, this.child.current_step_id).subscribe((data) => {
			this.step = data;
			this.fields = this.step.fields;
		});

		this.formBuilder.getForm('pesquisa')
			.subscribe((form) => {
				this.form = form;
				this.formTree = form.getTree();
			})
	}

	saveLocally() {

	}

	saveOnline() {
		this.children.updateStepFields(this.step);
	}
}
