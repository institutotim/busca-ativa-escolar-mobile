import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {AuthHttp} from "angular2-jwt";
import API_ROOT from "../env_api_root";
import {NavController} from "ionic-angular";
import {LoginPage} from "../pages/login/login";

@Injectable()
export class APIService {

	public nav: NavController;

	constructor(public http: AuthHttp) {}

	getURI() {
		return API_ROOT + 'api/v1/';
	}

	getTokenURI() {
		return API_ROOT + 'api/auth/token';
	}

	setNavController(nav: NavController) {
		this.nav = nav;
	}

	post(path: string, data?: any, isAbsoluteURL: boolean = false) : Observable<any> {
		return this.http
			.post((!isAbsoluteURL ? this.getURI() : '') + path, data)
			.map((data) => {
				return data ? data.json() : Observable.empty();
			})
			.catch((error) => {
				console.error("[core.api] Exception caught: ", error);

				if(error === 'login_required' && error.reason === 'login_required') {
					this.nav.setRoot(LoginPage);
					return Observable.empty();
				}

				return Observable.throw(error);
			})
	}

	get(path:string) : Observable<any> {
		return this.http
			.get(this.getURI() + path)
			.map((data) => {
				return data ? data.json() : Observable.empty();
			})
			.catch((error) => {
				console.error("[core.api] Exception caught: ", error);

				if(error !== 'login_required' && error.reason !== 'login_required') {
					return Observable.throw(error);
				}

				if(this.nav) {
					this.nav.setRoot(LoginPage);
				}

				return Observable.empty();

			})
	}

	handleError(err: any) {

	}

}