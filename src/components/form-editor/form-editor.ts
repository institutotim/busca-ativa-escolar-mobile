import {Component, Input} from '@angular/core';

import {Form} from "../../providers/form-builder.service";

@Component({
	selector: 'form-editor',
	templateUrl: 'form-editor.html'
})
export class FormEditor {

	@Input() form: Form;
	@Input() formTree: Array<any>;
	@Input() fields: any;

	constructor() {}

}
