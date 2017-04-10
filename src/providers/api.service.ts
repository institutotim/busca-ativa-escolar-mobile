import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {AuthHttp} from "angular2-jwt";

@Injectable()
export class APIService {

	constructor(public http: AuthHttp) {}

	getURI() {
		return 'http://api.busca-ativa-escolar.local/api/v1/';
	}

	getTokenURI() {
		return 'http://api.busca-ativa-escolar.local/api/auth/token';
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