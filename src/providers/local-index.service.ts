import {Injectable, OnInit} from "@angular/core";
import {ConnectivityService} from "./connectivity.service";
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";

@Injectable()
export class LocalIndexService {

	db:SQLiteObject = null;
	public isAvailable:Boolean = false;

	constructor(
		public connectivity: ConnectivityService,
	    public sqlite: SQLite
	) {

		if(!window['plugins'] || !window['plugins'].sqlDB) {
			console.error("[local_index_service] Failed to load SQLite plugin!");
			return;
		}

		window['plugins'].sqlDB.copy('schools.sqlite', 0, () => {

			console.info("[local_index_service] SQLite database copied! Opening...");

			this.openDatabase();

		}, (error) => {

			if(error.code === 516) {
				console.info("[local_index_service] SQLite database already copied! Opening...");
				this.openDatabase();
				return;
			}

			console.error("[local_index_service] Failed to copy SQLite database: ", error);
		});



	}

	openDatabase() {
		this.sqlite.create({name: 'schools.sqlite', location: 'default'}).then((db) => {

			console.info("[local_index_service] SQLite database ready: ", db);

			this.db = db;
			this.isAvailable = true;

			console.log("[local_index_service] Opened database: ", db);
		})
	}

	search(indexName: string, indexField: string, query: string, maxResults: number = 6) : Promise<any> {
		console.log("[local_index_service] Searching: ", indexName, indexField, query, maxResults);
		query = query + '*';

		return this.db.executeSql("SELECT * FROM " + indexName + " WHERE " + indexField + " MATCH ? LIMIT ?", [query, maxResults])
			.then((results) => {

				let data = [];

				for(let i = 0; i < results.rows.length; i++) {
					data.push(results.rows.item(i));
				}

				console.log("\t[local_index_service] Got results: ", results, data);

				return data;
			});
	}

}