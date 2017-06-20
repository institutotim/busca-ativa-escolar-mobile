import {Injectable, Pipe, PipeTransform} from "@angular/core";
import {Storage} from "@ionic/storage";

@Injectable()
export class QueuedUpdatesService {

	hasLoadedFromStorage = false;
	queuedAlerts = [];
	queuedChildUpdates = {};

	constructor(public storage: Storage) {
		if(this.hasLoadedFromStorage) return;

		this.storage.get("queued_alerts").then((data) => {
			if(!data) return;
			this.queuedAlerts = JSON.parse(data);
		});

		this.storage.get("queued_child_updates").then((data) => {
			if(!data) return;
			this.queuedChildUpdates = JSON.parse(data);
		});

		this.hasLoadedFromStorage = true;
	}

	queueAlert(data:any) : Promise<Object> {
		this.queuedAlerts.push(data);
		return this.storage.set("queued_alerts", JSON.stringify(this.queuedAlerts));
	}

	queueChildUpdate(childID:any, data:any) : Promise<Object> {
		this.queuedChildUpdates[childID] = data;
		return this.storage.set("queued_child_updates", JSON.stringify(this.queuedChildUpdates));
	}

	persist() {
		this.storage.set("queued_alerts", JSON.stringify(this.queuedAlerts));
		this.storage.set("queued_child_updates", JSON.stringify(this.queuedChildUpdates));
	}

	clear() {
		this.queuedAlerts = [];
		this.queuedChildUpdates = {};
		this.persist();
	}

	getAlerts():any {
		return this.queuedAlerts;
	}

	getChildUpdates():any {
		return this.queuedChildUpdates;
	}

}