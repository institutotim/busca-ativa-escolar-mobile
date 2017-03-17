export class User {
	id: string;
	type: string;

	name: string;
	email: string;

	tenant_id: string;
	group_id: string;
	city_id: string;

	institution: string;
	position: string;

	created_at: string;
	deleted_at: string;

	permissions: any;

	cpf: string;
	dob: string;
	work_phone: string;
	work_mobile: string;
	personal_mobile: string;
	skype_username: string;
	work_address: string;
	work_cep: string;
	work_neighborhood: string;
	work_uf: string;

	work_city: {
		id: string,
		name: string,
		uf: string,
	};

}

