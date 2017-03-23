import {Injectable, OnInit} from "@angular/core";
import {Child} from "../entities/Child";
import {Observable} from "rxjs";
import {APIService} from "./api.service";
import {AuthHttp} from "angular2-jwt";
import {UtilsService} from "./utils.service";

@Injectable()
export class StaticDataService {

	constructor(public http: AuthHttp, public api: APIService, public utils: UtilsService) {}

	data: any;

	get(key: string) : Observable<any> {
		if(this.data) {
			console.log("[static_data] Resolving cached data for ", key, this.data[key]);

			return Observable.of(this.data[key]);
		}

		console.log("[static_data] Fetching static data...");

		return this.api
			.get('static/static_data')
			.map((data) => {
				this.data = data.data;

				console.log("[static_data] Data loaded: ", this.data);
				console.log("[static_data] Resolving for ", key, this.data[key]);

				return this.data[key];
			})
	}

}