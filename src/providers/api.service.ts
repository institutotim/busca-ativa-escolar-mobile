import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {AuthHttp} from "angular2-jwt";
import API_ROOT from "../env_api_root";

@Injectable()
export class APIService {

	constructor(public http: AuthHttp) {}

	getURI() {
		return API_ROOT + 'api/v1/';
	}

	getTokenURI() {
		return API_ROOT + 'api/auth/token';
	}

	post(path: string, data?: any, isAbsoluteURL: boolean = false) : Observable<any> {
		return this.http
			.post((!isAbsoluteURL ? this.getURI() : '') + path, data)
			.map((data) => {
				return data ? data.json() : Observable.empty();
			});
	}

	get(path:string) : Observable<any> {
		return this.http
			.get(this.getURI() + path)
			.map((data) => {
				return data ? data.json() : Observable.empty();
			});
	}

}