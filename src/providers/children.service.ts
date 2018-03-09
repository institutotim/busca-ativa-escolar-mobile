import {Injectable} from "@angular/core";
import {Child} from "../entities/Child";
import {Observable} from "rxjs";
import {APIService} from "./api.service";
import {AuthHttp} from "angular2-jwt";
import {QueuedUpdatesService} from "./queued-updates.service";
import {LocalDataService} from "./local-data.service";
import {ConnectivityService} from "./connectivity.service";

@Injectable()
export class ChildrenService {

	constructor(
		public http: AuthHttp,
		public api: APIService,
	    public queue: QueuedUpdatesService,
	    public localData: LocalDataService,
	    public connectivity: ConnectivityService
	) {}

	getUserAttributions(userID: string, callback:Function = null) : Observable<Child[]> {

		if(!this.connectivity.isOnline()) {

			if(this.localData.isCached('attributions/' + userID)) {
				let data = this.localData.get('attributions/' + userID);
				data = Object.keys(data).map((k) => data[k]);

				console.log("[children_service] Returning offline data: ", data);
				if(callback) callback(data);
				return Observable.of(data);
			}

			if(callback) callback([], false);
			return Observable.of([]);

		}

		return this.api.post('children/search', {assigned_user_id: userID, current_step_type: 'BuscaAtivaEscolar\\CaseSteps\\Pesquisa'})
				.map((data) => {
					if(data && data.results) {
						if(callback) callback(data.results);
						return data.results;
					}

					if(callback) callback([], true);
					return [];
				})
				.map((data) => {
					this.localData.save('attributions/' + userID, data);
					this.localData.markAsCached('attributions', userID);

					return data;
				})
				.catch((error, caught) => {
					if(callback) callback([], false, error);
					return Observable.empty();
				})
	}

	getAlert(childID: string) : Observable<any> {

		if(!this.connectivity.isOnline()) {

			if(this.localData.isCached('children/' + childID + '/alert')) {
				let data = this.localData.get('children/' + childID + '/alert');
				return Observable.of(data);
			}

			console.warn("[children] Offline data not available for ", childID);

			return Observable.of([]);

		}

		return this.api.get('children/' + childID + '/alert')
			.map((data) => {
				this.localData.save('children/' + childID + '/alert', data);
				this.localData.markAsCached('children', childID);

				return data;
			})
	}

	getStepData(stepType: string, stepID: string) : Observable<any> {
		stepType = stepType.replace(/\\/g, encodeURIComponent('\\'));

		if(!this.connectivity.isOnline()) {

			if(this.localData.isCached('steps/' + stepType + '/' + stepID)) {
				let data = this.localData.get('steps/' + stepType + '/' + stepID);
				return Observable.of(data);
			}

			return Observable.of([]);

		}

		return this.api.get('steps/' + stepType + '/' + stepID + '?with=fields')
			.map((data) => {
				this.localData.save('steps/' + stepType + '/' + stepID, data);
				this.localData.markAsCached('steps', stepType + '/' + stepID);

				return data;
			})
	}

	updateStepFields(step: any, callback: Function = null, onError: Function = null) : any {
		let fields = {};
		let stepType = step.step_type.replace(/\\/g, encodeURIComponent('\\'));;

		for(let i in step.fields) {
			if(!step.fields.hasOwnProperty(i)) continue;
			if(step.fields[i] === null || step.fields[i] === undefined || step.fields[i] === '') continue;
			fields[i] = step.fields[i];
		}

		console.log("[children.update_step_fields] ", step.id, " fields=", fields);

		return this.api.post('steps/' + stepType + '/' + step.id, fields).subscribe(
			(response) => {
				if(!callback) return;
				callback(response);
			},
			(error:any) => {
				if(!onError) return;
				onError(error);
			}
		);
	}

	completeStep(step:any, callback:Function = null, onError:Function = null) : any {
		let stepType = step.step_type.replace(/\\/g, encodeURIComponent('\\'));;

		console.log("[children.complete_Step] ", step.id);

		return this.api.post('steps/' + stepType + '/' + step.id + '/complete', {}).subscribe(
			(response) => {
				if(!callback) return;
				callback(response);
			},
			(error:any) => {
				if(!onError) return;
				onError(error);
			}
		);
	}

	spawnAlert(data: any, callback: Function = null, onError:Function = null): any {
		console.log("[children.spawnAlert] ", data);

		let obs = this.api.post('children', data);

		if(callback) {
			return obs.subscribe(
				(response) => {
					if(!callback) return;
					callback(response);
					return response;
				},
				(error:any) => {
					if(!onError) return;
					onError(error);
					return error;
				}
			);
		}

		return obs;
	}

	renderGender(child: Child) : string {
		switch(child.gender) {
			case 'male': return 'masculino';
			case 'female': return 'feminino';
			case 'undefined': return 'gênero indefinido';
			default: case 'null': return 'gênero não disponível';
		}
	}

	renderAge(child: Child) : string {
		if(!child.age) return 'idade desconhecida';
		if(child.age === 1) return '1 ano';
		return child.age + ' anos';
	}

	renderRace(child: Child) : string {
		switch(child.race) {
			case 'indigena': return 'Indígena';
			case 'branca': return 'Branca';
			case 'preta': return 'Preta';
			case 'amarela': return 'Amarela';
			default: case 'null': return 'Desconhecida';
		}
	}

}