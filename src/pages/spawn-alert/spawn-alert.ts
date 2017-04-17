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

		this.form.rebuild(this.formTree, this.fields);

		this.isError = false;
		this.setLoading("Enviando alerta...");

		this.children.spawnAlert(this.fields, (response) => {

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
