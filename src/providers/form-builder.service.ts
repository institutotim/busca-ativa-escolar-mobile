import {Injectable} from "@angular/core";
import {Child} from "../entities/Child";
import {Observable} from "rxjs";
import {APIService} from "./api.service";
import {AuthHttp} from "angular2-jwt";
import {UtilsService} from "./utils.service";
import {ModalController} from "ionic-angular";
import {EntityPickerModal} from "../pages/modals/entity-picker/entity-picker";
import {MasksService} from "./masks.service";
import {ConnectivityService} from "./connectivity.service";
import {LocalDataService} from "./local-data.service";

@Injectable()
export class FormBuilderService {

	forms: Object = {};

	constructor(
		public http: AuthHttp,
		public api: APIService,
		public utils: UtilsService,
		public masks: MasksService,
		public modals: ModalController,
		public connectivity: ConnectivityService,
		public localData: LocalDataService,
	) {}

	getForm(form: string) : Observable<Form> {

		if(!this.connectivity.isOnline()) {

			if(this.localData.isCached('forms/' + form)) {
				let data = this.localData.get('forms/' + form);

				this.forms[form] = new Form(form, data.form, this.utils, this.masks, this.modals, this.api, this.connectivity);

				return Observable.of(this.forms[form]);
			}

			return Observable.of({});

		}

		return this.api
			.get('integration/forms/' + form)
			.map((data) => {
				this.localData.save('forms/' + form, data);
				this.localData.markAsCached('forms', form);

				return data;
			})
			.map((data) => {
				this.forms[form] = new Form(form, data.form, this.utils, this.masks, this.modals, this.api, this.connectivity);
				return this.forms[form];
			})
			.catch((error, caught) => {
				return Observable.empty();
			})
	}

}

export class Form {

	tree: Array<any> = null;

	hiddenFieldTypes : Array<string> = [
		'model_field',
		'hidden',
	];

	constructor(
		public formName: string,
		public form : Object,
		public utils: UtilsService,
		public masks: MasksService,
		public modals: ModalController,
	    public api: APIService,
	    public connectivity: ConnectivityService,
	) {}

	shouldDisplay(group: string, field: string, data: any) : boolean {
		let f = this.form[group]['fields'][field];

		if(this.hiddenFieldTypes.indexOf(field) !== -1) return false;

		if(f.options.hide_if_offline) return this.connectivity.isOnline() || (!!data[f.options.hide_if_offline] && !this.connectivity.isOnline()) == true;
		if(f.options.show_if_true) return (!!data[f.options.show_if_true]) == true;
		if(f.options.show_if_false) return (!!data[f.options.show_if_false]) == false;
		if(f.options.show_if_equal) return (data[f.options.show_if_equal[0]] == f.options.show_if_equal[1]);
		if(f.options.show_if_in) return (f.options.show_if_in[1]).indexOf(data[f.options.show_if_in[0]]) !== -1;
		if(f.options.show_if_not_in) return (f.options.show_if_not_in[1]).indexOf(data[f.options.show_if_not_in[0]]) === -1;
		if(f.options.show_if_multiple_in) {
			let field = f.options.show_if_multiple_in[0];
			let accepted = f.options.show_if_multiple_in[1];

			if(!accepted || accepted.length <= 0) return false;
			if(!data[field] || data[field].length <= 0) return false;

			for(let i in accepted) {
				if(!accepted.hasOwnProperty(i)) continue;
				if(data[field].indexOf(accepted[i]) !== -1) return true;
			}

			return false;
		}
		if(f.options.show_if_same) return data[f.options.show_if_same[0]] == data[f.options.show_if_same[1]];
		
		return true;
	}

	getTree() : any {
		if(!this.tree) {
			this.tree = [];

			for(let i in this.form) {
				if(!this.form.hasOwnProperty(i)) continue;
				this.tree.push(this.form[i]);
			}
		}

		return this.tree;
	}

	getGroupFields(group: any) : Array<any> {
		return this.utils.objectToArray(group.fields);
	}

	getFieldOptions(field: any) {
		return this.utils.objectToArray(field.options.options);
	}

	getFieldLabel(group: string, field: string) : any {
		if(!this.form[group]) return 'err:invalid_group:' + group;
		if(!this.form[group]['fields'][field]) return 'err:invalid_field:' + field;
		return this.form[group]['fields'][field]['label'] || field;
	}

	getFieldPlaceholder(group: string, field: string) : any {
		if(!this.form[group]) return '';
		if(!this.form[group]['fields'][field]) return '';
		if(!this.form[group]['fields'][field]['options']) return '';

		return this.form[group]['fields'][field]['options']['placeholder'];
	}

	isMultipleChecked(field: any, option: any, data: any) : boolean {
		if(!data) return false;
		if(!data[field.name]) return false;
		if(!data[field.name].indexOf) return false;

		return (data[field.name].indexOf(option[field.options.key]) !== -1);
	}

	rebuild(tree: any, data: any): any {

		let output = {};

		for(let index in tree) {
			if(!tree.hasOwnProperty(index)) continue;

			let group = tree[index];
			let fields = group.fields;

			for(let field in fields) {
				if(!fields.hasOwnProperty(field)) continue;
				let f = fields[field];

				if(f.options && f.options.transform === "strip_punctuation") {
					output[field] = this.utils.stripPunctuation(data[field]);
					continue;
				}

				if(f.type === 'model_field') {
					if(!data[f.options.key]) continue;
					output[field] = data[f.options.key][f.options.field];
					continue;
				}

				output[field] = data[field];
			}

		}

		return output;
	}

	handleModelClick(field:any, data:any) {

		let modal = this.modals.create(EntityPickerModal, {
			title: 'Selecione: ' + field.label,
			items: (query) => {
				let searchParams = {};
				searchParams[field.options.search_by] = query;
				return this.api
					.post(field.options.source, searchParams, true)
					.map((items) => {
						if(!field.options.list_key) return items;
						return items[field.options.list_key];
					})
			},
			render: (item) => {
				return item[field.options.label];
			}
		});

		modal.onDidDismiss((item) => {

			if(!item) return;

			console.log("Selected: ", item, field.name, field.options.key, item[field.options.key]);

			data[field.name] = item[field.options.key];

			if(field.options.key_as) {
				data[field.options.key_as] = item;
			}

		});

		modal.present();

	}

	handleMultipleClick(field: any, option: any, data: any) {
		if(!data) data = {};
		if(!data[field.name]) data[field.name] = [];

		let value = option[field.options.key];
		let index = data[field.name].indexOf(value);

		if(index !== -1) {
			data[field.name].splice(index, 1); // Remove from list
			return;
		}

		data[field.name].push(value); // Add to list

	}

	getMask(field: any) : any {
		if(!field.options.mask) return this.masks.None;

		switch(field.options.mask) {
			case "cep": return this.masks.CEP;
			case "cpf": return this.masks.CPF;
			case "phone": return this.masks.BRPhone;
		}

		return this.masks.None;

	}

	renderModelValue(field: any, data: any) {
		if(!field.options.key_as || !field.options.label) {
			return data[field.name] || '';
		}

		if(!data[field.options.key_as]) {
			return '';
		}

		return data[field.options.key_as][field.options.label];
	}

}