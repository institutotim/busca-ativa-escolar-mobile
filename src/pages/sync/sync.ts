import {Component, OnInit} from '@angular/core';

import {AlertController, Events, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {AuthService} from "../../providers/auth.service";
import {ChildrenService} from "../../providers/children.service";
import {StaticDataService} from "../../providers/static-data.service";
import {UtilsService} from "../../providers/utils.service";
import {ConnectivityService} from "../../providers/connectivity.service";
import {QueuedUpdatesService} from "../../providers/queued-updates.service";
import {Storage} from "@ionic/storage";

import * as Parallel from 'async-parallel';
import {FormBuilderService} from "../../providers/form-builder.service";


@Component({
	selector: 'page-sync',
	templateUrl: 'sync.html'
})
export class SyncPage implements OnInit {

	loader: any;
	lastFullSync: Date = null;

	constructor(
		public navCtrl: NavController,
		public alertCtrl: AlertController,
		public events: Events,
		public toastCtrl: ToastController,
		public loadCtrl: LoadingController,
		public navParams: NavParams,
		public auth: AuthService,
		public children: ChildrenService,
	    public storage: Storage,
	    public utils: UtilsService,
	    public staticData: StaticDataService,
	    public connectivity: ConnectivityService,
	    public queue: QueuedUpdatesService,
	    public formBuilder: FormBuilderService
	) {

	}

	ngOnInit() {
		this.setIdle();

		this.storage.get("last_full_sync").then((data) => {
			if(!data) return false;
			this.lastFullSync = new Date(data);
		})
	}

	getLastFullSync() {
		if(!this.lastFullSync) return "Nunca sincronizado";
		return this.lastFullSync.toISOString();
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

	doFullDownload() {

		this.setLoading("Baixando informações...");

		let current = 0;

		let downloads = [
			{name: 'Dados estáticos', closure: async () => this.staticData.refresh().toPromise()},
			{name: 'Formulário de alerta', closure: async () => this.formBuilder.getForm("alerta").toPromise()},
			{name: 'Formulário de pesquisa', closure: async () => this.formBuilder.getForm("pesquisa").toPromise()},
			{name: 'Minhas atribuições', closure: async () => this.children.getUserAttributions(this.auth.userID).toPromise().then((assignments) => {

				console.log("[sync] Downloading children data...");

				let subcurrent = 0;
				let subtotal = assignments.length;

				assignments = assignments.filter((item) => {
					return (!!item && !!item.id);
				});

				return Parallel.pool(1, async () => {
					let assignment = assignments.shift();

					subcurrent = subtotal - assignments.length;

					this.loader.setContent("Baixando (" + current + "/" + total + "): Atribuição " + subcurrent + " de " + subtotal + "...");

					console.log("[sync] #", assignment.id, "...");

					return this.children.getAlert(assignment.id).toPromise().then(() => {
						console.log("\t [sync] #", assignment.id, "\t ALERT OK");
						return this.children.getStepData(assignment.current_step_type, assignment.current_step_id).toPromise().then(() => {
							console.log("\t [sync] #", assignment.id, "\t CURRENT STEP OK");
							return true;
						});
					})
				});

			})},

		];

		let total = downloads.length;

		Parallel.pool(1, async () => {
			let task = downloads.shift();

			current = total - downloads.length;

			this.loader.setContent("Baixando (" + current + "/" + total + "): " + task.name);
			await task.closure();
			return true;
		}).then((responses) => {
			console.log("[sync] Sync completed, responses: ", responses);
			console.log("[sync] Tasks remaining: ", downloads.length);

			this.setIdle();
			this.lastFullSync = new Date();
			this.storage.set("last_full_sync", this.lastFullSync.toISOString());
		}).catch((error) => {

			console.error("[sync] Errors found: ", error);

			this.setIdle();
			this.lastFullSync = new Date();
			this.storage.set("last_full_sync", this.lastFullSync.toISOString());
		})

	}

	doFullUpload() {

		let queuedAlerts = this.queue.getAlerts();
		let queuedUpdates = this.queue.getChildUpdates();

		queuedUpdates = Object.keys(queuedUpdates).map((k) => queuedUpdates[k]);

		let failedAlerts = [];
		let failedUpdates = [];

		let total = queuedAlerts.length + queuedUpdates.length;
		let current = 0;

		this.setLoading("Enviando dados...");

		Parallel.pool(1, async () => {

			current++;

			this.loader.setContent("Enviando dados (" + current + "/" + total + ") ...");

			if(queuedAlerts.length > 0) {
				let alert = queuedAlerts.shift();

				console.log("[sync.upload] Upload alert: ", alert);

				await this.children.spawnAlert(alert).toPromise()
					.then((data) => {
						if(data.status !== 'ok') {
							console.warn("\tFailed: ", data);
							alert.failure = {reason: data.reason, messages: data.messages};
							failedAlerts.push(alert);
							return;
						}

						console.log("\tResponse: ", data)
					})
					.catch((err) => {
						console.warn("\tFailed: ", err);
						failedAlerts.push(alert);
					});

				return true;

			}

			if(queuedUpdates.length > 0) {
				let update = queuedUpdates.shift();

				console.log("[sync.upload] Upload update: ", update);

				await this.children.updateStepFields(update).toPromise()
					.then((data) => {
						if(data.status !== 'ok') {
							console.warn("\tFailed: ", data);

							update.failure = {reason: data.reason, messages: data.messages};

							failedUpdates.push(update);
							return;
						}

						console.log("\tResponse: ", data)
					})
					.catch((err) => {
						console.warn("\tFailed: ", err);
						failedUpdates.push(alert);
					});

				return true;
			}

			console.log("[sync.upload] Completed! Failed: ", failedAlerts, failedUpdates);


		}).then((responses) => {

			this.queue.queuedAlerts = queuedAlerts.concat(failedAlerts);
			this.queue.queuedChildUpdates = queuedUpdates.concat(failedUpdates);
			this.queue.persist();

			console.log("[sync.upload] Upload completed, responses: ", responses);
			this.setIdle();

		}).catch((error) => {

			this.queue.queuedAlerts = queuedAlerts.concat(failedAlerts);
			this.queue.queuedChildUpdates = queuedUpdates.concat(failedUpdates);
			this.queue.persist();

			console.error("[sync.upload] Errors found: ", error);
			this.setIdle();

		})

	}

	clearQueues() {
		let confirmPrompt = this.alertCtrl.create({
			title: 'Tem certeza?',
			message: 'Ao confirmar, todos os dados que ainda não foram enviados à plataforma serão apagados!',
			buttons: [
				{
					text: 'Cancelar',
					handler: () => {

					}
				},
				{
					text: 'Confirmar',
					handler: () => {
						this.queue.clear();
					}
				}
			]
		});

		confirmPrompt.present();
	}

}
