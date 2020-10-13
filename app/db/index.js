const path = require("path");
const dbPath = path.resolve(__dirname, "sqlite3.db");
const sqlite3 = require("sqlite3").verbose();

class sqlite {
	constructor() {
		this.db = new sqlite3.Database(dbPath, err => {
			if (err) {
				console.error(err.message);
			}
			console.log("Connected to the database.");
		});
	}
}

module.exports = sqlite;
