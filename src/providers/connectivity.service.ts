import {Injectable, Pipe, PipeTransform} from "@angular/core";

@Injectable()
export class ConnectivityService {

	currentCallback = null;
	currentStatus = false;
	timer = null;
	onlineStatuses = [];

	constructor() {

	}

	setup() {

		if(navigator.connection) {
			this.onlineStatuses = [
				Connection.ETHERNET,
				Connection.WIFI,
				Connection.CELL_2G,
				Connection.CELL_3G,
				Connection.CELL_4G,
				Connection.CELL,
				Connection.UNKNOWN
			];
		}

		let status = this.isOnline();

		console.log("[connectivity] Valid online statuses: ", this.onlineStatuses.join(", "));
		console.log("[connectivity] Initial network status: ", (status ? 'ONLINE' : 'OFFLINE'), (navigator.connection ? navigator.connection.type : 'UNKOWN_DESKTOP'));

		this.timer = setInterval(() => {
			this.checkConnectionStatus();
		}, 500);
	}

	checkConnectionStatus() {
		let status = this.isOnline();

		if(status !== this.currentStatus) {
			console.log("[connectivity] Network status changed to: ", (status ? 'ONLINE' : 'OFFLINE'), (navigator.connection ? navigator.connection.type : 'UNKOWN_DESKTOP'));
			if(this.currentCallback) this.currentCallback(status);
		}

		this.currentStatus = status;
	}

	isOnline():boolean {
		if(navigator.connection) {
			return (this.onlineStatuses.indexOf(navigator.connection.type) !== -1);
		}

		return navigator.onLine;
	}

	onStatusChange(callback) {
		console.log("[connectivity] Set change callback: ", callback);
		this.currentCallback = callback;
	}

}