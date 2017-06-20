import {Injectable} from "@angular/core";
import DEFAULT_API_ROOT from "../env_api_root";
import {ConnectivityService} from "./connectivity.service";
import {Storage} from "@ionic/storage";

@Injectable()
export class AppSettingsService {

	public APIRoot: string = DEFAULT_API_ROOT;

	public productionAPIRoot = 'https://api.buscaativaescolar.org.br/';

	public availableAPIRoots = [
		'http://api.busca-ativa-escolar.local/',
		'https://api.buscaativaescolar.org.br/',
		'http://api.buscaativateste.conexaobrasil.org/',
	];

	constructor(
	    public storage: Storage,
	    public connectivity: ConnectivityService
	) {}

	isProductionEndpoint() {
		return this.APIRoot === this.productionAPIRoot;
	}

}