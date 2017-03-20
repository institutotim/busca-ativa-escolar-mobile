import {Component, OnInit} from '@angular/core';

import {NavController, NavParams} from 'ionic-angular';
import {AuthHttp} from "angular2-jwt";
import {AuthService} from "../../providers/auth.service";
import {Observable} from "rxjs";
import {ChildrenService} from "../../providers/children.service";
import {Child} from "../../entities/Child";
import {StaticDataService} from "../../providers/static-data.service";
import {EditStepPage} from "../edit-step/edit-step";

@Component({
	selector: 'page-child-view',
	templateUrl: 'child-view.html'
})
export class ChildViewPage implements OnInit {

	child: Child;
	alert: any = {fields: {}};
	causes = {};
	fields = {
		name: 'Nome',
		gender: 'Gênero',
		race: 'Raça / etnia',
		dob: 'Data de nascimento',
		rg: 'RG',

		cpf: 'CPF',
		nis: 'NIS',
		alert_cause_id: 'Causa do alerta',

		mother_name: 'Nome da mãe',
		mother_rg: 'RG da mãe',
		mother_phone: 'Telefone da mãe',

		father_name: 'Nome do pai',
		father_rg: 'RG do pai',
		father_phone: 'Telefone do pai',

		place_address: 'Endereço',
		place_cep: 'CEP',
		place_reference: 'Referência',
		place_neighborhood: 'Bairro',
		place_city: 'Cidade',
		place_uf: 'UF',
		place_phone: 'Telefone',
		place_mobile: 'Celular',
	};

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public auth: AuthService,
		public children: ChildrenService,
		public staticData: StaticDataService,
	) {
		this.child = navParams.get('child');
	}

	ngOnInit() {
		this.children
			.getAlert(this.child.id)
			.subscribe(
				(alert) => { this.alert = alert}
			);

		this.staticData.get('AlertCause').subscribe((causes) => {
			this.causes = causes;
		});
	}

	renderLabel(field: string) : string {
		return this.fields[field] ? this.fields[field] : field;
	}

	renderAlertCause(cause_id: string) : string {
		if(!this.causes) return '';
		let cause = this.causes[parseInt(cause_id, 10)];
		if(!cause) return '';
		return cause.label;
	}

	renderCity(city: any) : string {
		if(!city) return '';
		return city.name + ' / ' + city.uf;
	}

	editCurrentStep() {
		this.navCtrl.push(EditStepPage, {child: this.child});
	}

	navigateToAddress() {
		let mapURI = 'maps:?q=' + encodeURIComponent(`${this.alert.fields.place_address} ${this.alert.fields.place_neighborhood} ${this.alert.fields.place_city.name} ${this.alert.fields.place_city.uf}`);
		console.log("[child-view] Map URI: ", mapURI);
		window.open(mapURI, '_blank')
	}
}
