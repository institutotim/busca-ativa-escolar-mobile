import {Injectable, Pipe, PipeTransform} from "@angular/core";
import {Storage} from "@ionic/storage";

@Injectable()
export class LocalDataService {

	hasLoadedFromStorage = false;

	cached = {};
	cacheFlags = {};

	constructor(public storage: Storage) {
		if(this.hasLoadedFromStorage) return;

		this.storage.get("cached").then((data) => {
			if(!data) return;
			this.cached = JSON.parse(data);
		});

		this.storage.get("cache_flags").then((data) => {
			if(!data) return;
			this.cacheFlags = JSON.parse(data);
		});

		this.hasLoadedFromStorage = true;
	}

	persist() : Promise<Object> {
		this.storage.set("cache_flags", JSON.stringify(this.cacheFlags));
		return this.storage.set("cached", JSON.stringify(this.cached));
	}

	save(path:string, data: any) {
		console.log("[local_data] Saved: ", path, data);
		this.cached[path] = Object.assign({}, data);
		this.persist();
	}

	markAsCached(repository:string, identifier:string) {
		if(!this.cacheFlags[repository]) this.cacheFlags[repository] = {};
		this.cacheFlags[repository][identifier] = true;
	}

	isMarkedAsCached(repository:string, identifier:string) : boolean {
		if(!this.cacheFlags[repository]) return false;
		return !!this.cacheFlags[repository][identifier];
	}

	isCached(path:string) : boolean {
		return this.cached.hasOwnProperty(path);
	}

	get(path:string) : any {
		console.log("[local_data] Retrieved from cache: ", path, this.cached[path]);
		return this.cached[path]
	}

}