import {Injectable, Pipe, PipeTransform} from "@angular/core";
import {UtilsService} from "./utils.service";

@Injectable()
export class MasksService {

	constructor(public utils: UtilsService) {}

	CEP = {mask: [/\d/,/\d/,/\d/,/\d/,/\d/,'-',/\d/,/\d/,/\d/]};
	CPF = {mask: [/\d/,/\d/,/\d/,'.',/\d/,/\d/,/\d/,'.',/\d/,/\d/,/\d/,'-',/\d/,/\d/]};

	BRPhone = {
		mask: (rawValue) => {
			if(this.utils.stripPunctuation(rawValue).length <= 10) { // 8-digit landline
				return ['(',/\d/,/\d/,')',' ',/\d/,/\d/,/\d/,/\d/,'-',/\d/,/\d/,/\d/,/\d/];
			}

			// 9-digit cellphone
			return ['(',/\d/,/\d/,')',' ',/\d/,/\d/,/\d/,/\d/,/\d/,'-',/\d/,/\d/,/\d/,/\d/];
		}
	};

	None = {mask: false};

}