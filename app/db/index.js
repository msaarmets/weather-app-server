const path = require("path");
const sqlite3 = require("sqlite3").verbose();
// Use different database for unit tests
const dbFilename =
	process.env.NODE_ENV == "test" ? "sqlite3_test.db" : "sqlite3.db";

class sqlite {
	constructor() {
		const dbPath = path.resolve(__dirname, dbFilename);
		this.db = new sqlite3.Database(dbPath, err => {
			if (err) {
				console.error(err.message);
			}
			console.log("Connected to the database");
		});
	}

	/** Method to make universal queries */

	sqlQuery = (type, query, params) => {
		return new Promise((resolve, reject) => {
			try {
				switch (type) {
					case "SELECT":
						this.db.all(query, params, (err, rows) => {
							if (err) throw err;
							else resolve(rows);
						});
						break;
					case "INSERT":
						this.db.run(query, params, function (err) {
							if (err) throw err;
							else resolve(this.lastID);
						});
						break;
					case "UPDATE":
					case "DELETE":
						this.db.run(query, params, function (err) {
							if (err) throw err;
							else resolve(this.changes);
						});
						break;
				}
			} catch (e) {
				reject(e);
			}
		});
	};

	close = () => this.db.close();

	/** Most used queries as methods */

	getAllCities = () => {
		return new Promise(async (resolve, reject) => {
			const res = await this.sqlQuery(
				"SELECT",
				"SELECT id, name, country, temp, wind, humidity FROM cities",
				[]
			);
			resolve(res);
		});
	};

	getCityById = id => {
		return new Promise(async (resolve, reject) => {
			const res = await this.sqlQuery(
				"SELECT",
				"SELECT id, name, country, temp, wind, humidity FROM cities WHERE id=?",
				[id]
			);
			resolve(res);
		});
	};
}

module.exports = sqlite;
