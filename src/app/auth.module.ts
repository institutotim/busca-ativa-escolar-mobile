import { NgModule } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import {AuthService} from "../providers/auth.service";

function authHttpServiceFactory(http: Http, options: RequestOptions) {
	return new AuthHttp(new AuthConfig(), http, options);
}

export function getAuthHttp(http, auth: AuthService) {
	return new AuthHttp(new AuthConfig({
		globalHeaders: [{'Accept': 'application/json'}],
		tokenGetter: (() => auth.provideToken()),
	}), http);
}

@NgModule({
	providers: [
		{
			provide: AuthHttp,
			useFactory: getAuthHttp,
			deps: [Http, AuthService]
		}
	]
})
export class AuthModule {}