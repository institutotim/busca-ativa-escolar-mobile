export class Child {
	id: string;
	name: string;

	tenant_id: string;

	mother_name: string;
	father_name: string;

	risk_level: string;
	gender: string;
	age: number;
	race: string;

	current_case_id: string;

	current_step_type: string;
	current_step_id: string;

	is_late: boolean;

	alert_status: string;
	deadline_status: string;
	child_status: string;

	coords: {
		latitude: string,
		longitude: string
	};

	map_region: string;
	map_geocoded_address: any;

	created_at: string;
	updated_at: string;

}