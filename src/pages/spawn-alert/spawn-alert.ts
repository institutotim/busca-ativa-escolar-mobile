import {Component, OnInit} from '@angular/core';

import {Events, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {AuthHttp} from "angular2-jwt";
import {AuthService} from "../../providers/auth.service";
import {Observable} from "rxjs";
import {ChildrenService} from "../../providers/children.service";
import {Child} from "../../entities/Child";
import {StaticDataService} from "../../providers/static-data.service";
import {EditStepPage} from "../edit-step/edit-step";
import {Form, FormBuilderService} from "../../providers/form-builder.service";
import {QueuedUpdatesService} from "../../providers/queued-updates.service";
import {ConnectivityService} from "../../providers/connectivity.service";

@Component({
	selector: 'page-spawn-alert',
	templateUrl: 'spawn-alert.html'
})
export class SpawnAlertPage implements OnInit {

	loader: any;
	isLoaded = false;
	isError = false;

	step: any;
	form: Form;
	formTree: Array<any> = [];

	fields = {};

	constructor(
		public children: ChildrenService,
		public navCtrl: NavController,
		public toastCtrl: ToastController,
		public formBuilder: FormBuilderService,
		public events: Events,
		public loadCtrl: LoadingController,
		public auth: AuthService,
		public staticData: StaticDataService,
	    public connectivity: ConnectivityService,
	    public queue: QueuedUpdatesService
	) {

	}

	ngOnInit() {

		this.loadForm();

	}

	loadForm() {
		this.isError = false;
		this.setLoading("Carregando dados...");

		this.formBuilder.getForm('alerta')
			.subscribe((form) => {

					this.form = form;
					this.formTree = form.getTree();

					console.log("Form loaded: ", form);

					this.setIdle();

				},
				(error) => {
					this.handleError(error);
				}
			)
	}

	handleValidationErrors(response) {

		if(!response) {
			this.showErrorToast("Ocorreu um erro desconhecido ao enviar as informações. Verifique sua conexão com a internet e tente novamente.");
			return true;
		}

		if(response.status === 'ok') return false;

		if(response.reason === 'validation_failed') {

			let message = [];

			for(let i in response.messages) {
				if(!response.messages.hasOwnProperty(i)) continue;
				message.push(response.messages[i]);
			}

			this.showErrorToast("Há erros no preenchimento do formulário: \n" + message.join("\n"), 0, 'toast-error toast-validation-error');

			return true;
		}

		this.showErrorToast("Erro ao executar a ação: " + response.reason);

		return true;
	}

	showErrorToast(message, duration = 6000, cssClass = 'toast-error') {
		this.toastCtrl.create({
			cssClass: cssClass,
			message: message,
			duration: duration,
			showCloseButton: true,
			closeButtonText: 'OK'
		}).present().catch(() => {});
	}

	save() {

		let data = this.form.rebuild(this.formTree, this.fields);
		let requiredFields = ['name', 'mother_name', 'place_address', 'place_neighborhood', 'alert_cause_id'];

		if(this.connectivity.isOnline()) {
			requiredFields.push('place_city_id');
			requiredFields.push('place_uf');
		}

		for(let i in requiredFields) {
			let field = requiredFields[i];

			if(!data[field] || ("" + data[field]).length <= 0) {
				this.showErrorToast('Por favor, preencha todos os campos marcados como obrigatórios!');
				return;
			}
		}

		if(!this.connectivity.isOnline()) {

			this.isError = false;
			this.setLoading("Armazenando alerta...");

			data.place_city_id = this.auth.getUser().tenant.city_id;
			data.place_city_name = this.auth.getUser().tenant.city.name;
			data.place_uf = this.auth.getUser().tenant.city.uf;

			return this.queue.queueAlert(data).then((res) => {
				console.log("[spawn_alert] save.offline => ", data, res);

				this.setIdle();

				this.toastCtrl.create({
					cssClass: 'toast-success',
					message: 'Alerta armazenado com sucesso!',
					duration: 6000,
					showCloseButton: true,
					closeButtonText: 'OK'
				}).present().catch(() => {});

				this.fields = {};
			});


		}

		this.isError = false;
		this.setLoading("Enviando alerta...");

		this.children.spawnAlert(data, (response) => {

			console.log("[spawn_alert] save => ", response);

			this.setIdle();

			if(this.handleValidationErrors(response)) {
				return;
			}

			this.toastCtrl.create({
				cssClass: 'toast-success',
				message: 'Alerta criado com sucesso!',
				duration: 6000,
				showCloseButton: true,
				closeButtonText: 'OK'
			}).present().catch(() => {});

			this.fields = {};

		}, this.handleError)
	}

	handleError(error) {

		console.error("[spawn_alert] error: ", error);

		this.setIdle();
		this.isError = true;

		this.toastCtrl.create({
			cssClass: 'toast-error',
			message: 'Ocorreu um erro ao carregar o formulário de alerta. Verifique sua conexão com a internet e tente novamente. (err=' + error + ')',
			duration: 6000,
			showCloseButton: true,
			closeButtonText: 'OK'
		}).present().catch(() => {});
	}

	setLoading(message) {
		this.loader = this.loadCtrl.create({
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
}
