import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Storage} from "@ionic/storage";

@Injectable()
export class AuthService {

	userID : string;
	user : Object;
	token : string;

	expiresAt : {
		token: number,
		refresh: number
	};

	tokenURI : string = 'http://api.busca-ativa-escolar.local/api/auth/token';

	constructor(public http: Http, protected storage: Storage) {}

	provideToken() : Promise<string> {
		// Isn't even logged in
		if (!this.isLoggedIn()) return Promise.reject('login_required');

		// Check if session is valid
		if (!this.token || !this.userID || !this.user) return Promise.reject('login_required');

		// Has valid token
		if (!this.isTokenExpired()) return Promise.resolve(this.token);

		console.log("[auth::token.provide] Token expired! Refreshing...");

		// Is logged in, but both access and refresh token are expired
		if (this.isRefreshExpired()) {
			console.log("[auth::token.provide] Refresh token also expired! Logging out...");
			return Promise.reject('login_required');
		}

		// Is logged in, access token expired but refresh token still valid
		return this.refreshToken().then((session:any) => {
			console.log("[auth::token.provide] Refreshed, new tokens: ", session);
			return Promise.resolve(session.token);
		});
	}

	refreshToken() : Promise<string> {
		const tokenRequest = {
			grant_type: 'refresh',
			token: this.token
		};

		const options = {
			accept: 'application/json',
		};

		return this.http
			.post(this.tokenURI, tokenRequest, options)
			.toPromise()
			.then(this.handleAuthResponse.bind(this), this.handleAuthError.bind(this));
	}

	login(email, password) : Promise<Object> {

		const tokenRequest = {
			grant_type: 'login',
			email: email,
			password: password
		};

		const options = {
			accept: 'application/json',
		};

		return this.http
			.post(this.tokenURI, tokenRequest, options)
			.toPromise()
			.then(this.handleAuthResponse.bind(this), this.handleAuthError.bind(this));
	};

	handleAuthResponse(response) : Promise<Object> {

		if(response.status !== 200) {
			console.log("[auth::login] Rejecting Auth response! Status= ", response.status);
			return Promise.reject(response.data);
		}

		const data = response.json();

		if(!data|| !data.token) {
			return Promise.reject("invalid_token_response");
		}

		this.token = data.token;
		this.expiresAt = {
			token: (new Date()).getTime() + (3600 * 1000),
			refresh: (new Date()).getTime() + (1209600 * 1000)
		};

		this.setCurrentUser(data.user);
		this.saveSessionInStorage();

		return Promise.resolve(data);
	}

	setCurrentUser(userData:any) {
		this.userID = userData.id;
		this.user = userData;
	}

	loadSessionFromStorage() : Promise<Object> {

		return this.storage
			.ready()
			.then(() => {
				return this.storage.get('session')
			})
			.then((session) => {
				if(!session) return Promise.resolve({});

				session = JSON.parse(session);
				this.token = session.token;
				this.expiresAt = session.expiresAt;
				this.userID = session.userID;
				this.user = session.user;

				return Promise.resolve(session);
			});
	}

	saveSessionInStorage() {

		const session = {
			token: this.token,
			userID: this.userID,
			user: this.user,
			expiresAt: this.expiresAt
		};

		this.storage.set('session', JSON.stringify(session));

	}

	handleAuthError(response) {
		console.error("[auth::login] API error: ", response);
		throw (response.json()) ? response.json(): response;
	}

	getUser() : Object {
		if(!this.isLoggedIn()) return {};
		return this.user;
	}

	getUserID() : string {
		if(!this.isLoggedIn()) return null;
		return this.userID;
	}

	isLoggedIn() {
		return (this.token && this.userID && !this.isTokenExpired());
	}

	isTokenExpired() {
		let now = (new Date()).getTime();
		return (now >= this.expiresAt.token);
	}

	isRefreshExpired() {
		let now = (new Date()).getTime();
		return (now >= this.expiresAt.refresh);
	}

	logout() {

		console.log("[auth::logout] Logging out...");

		this.token = null;
		this.userID = null;
		this.expiresAt = null;
		this.user = null;

		this.saveSessionInStorage();

	}

}
