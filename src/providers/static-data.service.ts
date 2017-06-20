import {Injectable, OnInit} from "@angular/core";
import {Child} from "../entities/Child";
import {Observable} from "rxjs";
import {APIService} from "./api.service";
import {AuthHttp} from "angular2-jwt";
import {UtilsService} from "./utils.service";
import {LocalDataService} from "./local-data.service";
import {ConnectivityService} from "./connectivity.service";

@Injectable()
export class StaticDataService {

	constructor(
		public http: AuthHttp,
		public api: APIService,
		public utils: UtilsService,
		public connectivity: ConnectivityService,
		public localData: LocalDataService,
	) {}

	data: any;

	refresh() : Observable<any> {

		if(this.data) {
			return Observable.of(this.data);
		}

		if(!this.connectivity.isOnline()) {
			if(this.localData.isCached('static_data')) {
				let data = this.localData.get('static_data');
				console.log("[static_data] Loaded from local storage: ", data);

				this.data = data;
				return Observable.of(this.data);
			}

			return Observable.of(null);
		}


		console.log("[static_data] Fetching static data...");

		return this.api
			.get('static/static_data')
			.map((data) => {
				this.data = data.data;

				console.log("[static_data] Data loaded: ", this.data);

				return this.data;
			})
			.map((data) => {
				this.localData.save('static_data', this.data);
				this.localData.markAsCached('static_data', 'static_data');

				return this.data;
			})
	}

	get(key: string) : Observable<any> {

		return this.refresh()
			.map((data) => {
				console.log("[static_data] Resolving for ", key, this.data[key]);
				return this.data[key];
			})
			.catch((error, caught) => {
				return Observable.empty();
			})
	}

}