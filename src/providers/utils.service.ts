import {Injectable} from "@angular/core";

@Injectable()
export class UtilsService {

	deref(obj: any, s: string, i:number = 0) {
		if (i === undefined) i = 0;
		if (i < s.length) return this.deref(obj[s[i]], s, i + 1);
		return obj;
	}

}