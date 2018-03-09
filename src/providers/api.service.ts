import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {AuthHttp} from "angular2-jwt";
import {NavController} from "ionic-angular";
import {LoginPage} from "../pages/login/login";
import {LocalDataService} from "./local-data.service";
import {ConnectivityService} from "./connectivity.service";
import {AppSettingsService} from "./settings.service";

@Injectable()
export class APIService {

	public nav: NavController;

	constructor(
		public http: AuthHttp,
	    public localData: LocalDataService,
	    public connectivity: ConnectivityService,
	    public settings: AppSettingsService,
	) {}

	getURI() {
		return this.settings.APIRoot + 'api/v1/';
	}

	getTokenURI() {
		return this.settings.APIRoot + 'api/auth/token';
	}

	setNavController(nav: NavController) {
		this.nav = nav;
	}

	post(path: string, data?: any, isAbsoluteURL: boolean = false) : Observable<any> {

		let requestID = ("POST " + this.getURI() + path + "?" + JSON.stringify(data));

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

		let requestID = ("GET " + this.getURI() + path);

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