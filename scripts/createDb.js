/* Script to generate empty "cities" table and trigger for "modified" field */

const sqlite = require("../app/db/index");
const db = new sqlite().db;

const tableQuery = `CREATE TABLE IF NOT EXISTS "cities" (
	"id" INTEGER PRIMARY KEY NOT NULL,
	"name" TEXT,
	"temp" TEXT,
	"wind" TEXT,
	"humidity" TEXT,
	"created" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"modified" TEXT,
	"deleted" TEXT
	);`;

const triggerQuery = `
	CREATE TRIGGER IF NOT EXISTS update_cities
		AFTER UPDATE
		ON "cities"
		FOR EACH ROW
	BEGIN
		UPDATE cities SET modified=CURRENT_TIMESTAMP WHERE id=OLD.id;
	END`;

const createTable = async () =>
	new Promise((resolve, reject) => {
		db.run(tableQuery, [], function (err) {
			if (err) reject(err);
			else {
				console.log("Table successfully created");
				resolve(true);
			}
		});
	});

const createTrigger = () =>
	new Promise((resolve, reject) => {
		db.run(triggerQuery, [], function (err) {
			if (err) reject(err);
			else {
				console.log("Table trigger successfully added");
				resolve(true);
			}
		});
	});

const run = async () => {
	const table = await createTable();
	if (table) {
		createTrigger();
	} else {
		console.error("Error creating cities table");
	}
};

run();
