import {Injectable, Pipe, PipeTransform} from "@angular/core";

@Injectable()
export class UtilsService {

	deref(obj: any, s: string, i:number = 0) {
		if (i === undefined) i = 0;
		if (i < s.length) return this.deref(obj[s[i]], s, i + 1);
		return obj;
	}

	objectToArray(obj: any) : Array<any> {
		let arr = [];

		for(let i in obj) {
			if(!obj.hasOwnProperty(i)) continue;
			arr.push(obj[i]);
		}

		return arr;
	}

	stripPunctuation = (input) => {
		if(!input) return '';
		return input.replace(/[^\w\s]/g, "").replace(/[_]/g, "").replace(/\s+/g, "");
	}

}