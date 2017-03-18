import {Injectable} from "@angular/core";
import {Child} from "../entities/Child";
import {Observable} from "rxjs";
import {APIService} from "./api.service";
import {AuthHttp} from "angular2-jwt";

@Injectable()
export class ChildrenService {

	constructor(public http: AuthHttp, public api: APIService) {}

	getUserAttributions(userID: string) : Observable<Child[]> {
		return this.api
				.post('children/search', {assigned_user_id: userID})
			.map((data) => { return data.results; })
	}

	getAlert(childID: string) : Observable<any> {
		return this.api.get('children/' + childID + '/alert')
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