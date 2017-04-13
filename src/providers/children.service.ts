import {Injectable} from "@angular/core";
import {Child} from "../entities/Child";
import {Observable} from "rxjs";
import {APIService} from "./api.service";
import {AuthHttp} from "angular2-jwt";

@Injectable()
export class ChildrenService {

	constructor(public http: AuthHttp, public api: APIService) {}

	getUserAttributions(userID: string, callback:Function = null) : Observable<Child[]> {
		return this.api
				.post('children/search', {assigned_user_id: userID, current_step_type: 'BuscaAtivaEscolar\\CaseSteps\\Pesquisa'})
				.map((data) => {
					if(callback) callback(data.results);
					return data.results;
				})
	}

	getAlert(childID: string) : Observable<any> {
		return this.api.get('children/' + childID + '/alert')
	}

	getStepData(stepType: string, stepID: string) : Observable<any> {
		stepType = stepType.replace(/\\/g, encodeURIComponent('\\'));
		return this.api.get('steps/' + stepType + '/' + stepID + '?with=fields');
	}

	updateStepFields(step: any, callback: Function = null) : any {
		let fields = {};
		let stepType = step.step_type.replace(/\\/g, encodeURIComponent('\\'));;

		for(let i in step.fields) {
			if(!step.fields.hasOwnProperty(i)) continue;
			if(step.fields[i] === null || step.fields[i] === undefined || step.fields[i] === '') continue;
			fields[i] = step.fields[i];
		}

		console.log("[children.update_step_fields] ", step.id, " fields=", fields);

		return this.api.post('steps/' + stepType + '/' + step.id, fields).subscribe((response) => {
			if(!callback) return;
			callback(response);
		});
	}

	completeStep(step:any, callback:Function = null) : any {
		let stepType = step.step_type.replace(/\\/g, encodeURIComponent('\\'));;

		console.log("[children.complete_Step] ", step.id);

		return this.api.post('steps/' + stepType + '/' + step.id + '/complete', {}).subscribe((response) => {
			if(!callback) return;
			callback(response);
		});
	}

	spawnAlert(data: any, callback: Function = null): any {
		console.log("[children.spawnAlert] ", data);

		return this.api.post('children', data).subscribe((response) => {
			if(!callback) return;
			callback(response);
		});
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