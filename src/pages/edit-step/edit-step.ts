import {Component, OnInit} from '@angular/core';

import {Events, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {AuthService} from "../../providers/auth.service";
import {ChildrenService} from "../../providers/children.service";
import {Child} from "../../entities/Child";
import {StaticDataService} from "../../providers/static-data.service";
import {UtilsService} from "../../providers/utils.service";
import {Form, FormBuilderService} from "../../providers/form-builder.service";
import {Observable} from "rxjs";
import {MyAttributionsPage} from "../my-attributions/my-attributions";
import {ConnectivityService} from "../../providers/connectivity.service";
import {QueuedUpdatesService} from "../../providers/queued-updates.service";

@Component({
	selector: 'page-edit-step',
	templateUrl: 'edit-step.html'
})
export class EditStepPage implements OnInit {

	child: Child;
	step: any;
	form: Form;
	formTree: Array<any> = [];

	fields = {};

	loader: any;

	constructor(
		public navCtrl: NavController,
		public events: Events,
		public toastCtrl: ToastController,
		public loadCtrl: LoadingController,
		public navParams: NavParams,
		public auth: AuthService,
		public children: ChildrenService,
	    public utils: UtilsService,
	    public staticData: StaticDataService,
	    public formBuilder: FormBuilderService,
	    public connectivity: ConnectivityService,
	    public queue: QueuedUpdatesService
	) {
		this.child = navParams.get('child');
	}

	ngOnInit() {

		let alreadyLoaded = 0;
		this.setLoading("Carregando dados...");

		this.children.getStepData(this.child.current_step_type, this.child.current_step_id)
			.subscribe((data) => {

				this.step = data;
				this.fields = this.step.fields;

				console.log("Step data loaded: ", data);

				if(++alreadyLoaded === 2) this.setIdle();

			});

		this.formBuilder.getForm('pesquisa')
			.subscribe((form) => {

				this.form = form;
				this.formTree = form.getTree();

				console.log("Form loaded: ", form);

				if(++alreadyLoaded === 2) this.setIdle();

			})
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

	saveLocally(shouldComplete = false) {
		this.setLoading("Armazenando...");

		if(shouldComplete) {
			this.step.shouldComplete = true;
		}

		return this.queue.queueChildUpdate(this.step.id, this.step).then((res) => {
			console.log("[edit_step] save.offline => ", this.step, res);

			this.setIdle();

			this.toastCtrl.create({
				cssClass: 'toast-success',
				message: 'Dados armazenados com sucesso!',
				duration: 6000,
				showCloseButton: true,
				closeButtonText: 'OK'
			}).present().catch(() => {});

			this.fields = {};
		});
	}

	saveOnline() {

		this.form.rebuild(this.formTree, this.fields);

		if(!this.connectivity.isOnline()) {
			return this.saveLocally();
		}

		this.setLoading("Salvando...");

		this.children.updateStepFields(this.step, (response) => {

			this.setIdle();

			console.log("[edit_step] saveOnline => ", response);

			if(this.handleValidationErrors(response)) {
				return;
			}

			this.toastCtrl.create({
				message: 'Dados salvos com sucesso',
				duration: 3000
			}).present().catch(() => {});

		});
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

	completeStep() {

		this.setLoading("Concluindo etapa...");

		this.children.completeStep(this.step, (response) => {

			console.log("[edit_step] completeStep => ", response);

			this.setIdle();

			if(this.handleValidationErrors(response)) {
				return;
			}

			this.toastCtrl.create({
				cssClass: 'toast-success',
				message: 'Etapa concluída com sucesso!',
				duration: 6000,
				showCloseButton: true,
				closeButtonText: 'OK'
			}).present().catch(() => {});

			this.events.publish('stepCompleted');

			this.navCtrl.popTo(MyAttributionsPage);

		})
	}

	saveAndComplete() {

		this.form.rebuild(this.formTree, this.fields);

		if(!this.connectivity.isOnline()) {
			return this.saveLocally(true);
		}

		this.setLoading("Salvando...");

		this.children.updateStepFields(this.step, (response) => {

			console.log("[edit_step] saveAndComplete.save => ", response);

			this.setIdle();

			if(this.handleValidationErrors(response)) {
				return;
			}

			setTimeout(() => {
				this.completeStep();
			}, 500);

		});
	}
}
