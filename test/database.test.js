const expect = require("chai").expect;
const fs = require("fs");
const path = require("path");
const databaseFile = "sqlite3_test.db";
const databaseFilePath = path.resolve(__dirname, "../app/db", databaseFile);
const sqlite = require("../app/db");
const createDbTables = require("../scripts/createDb");

const deleteDbFile = () =>
	fs.unlink(databaseFilePath, err => {
		if (err) {
			console.error(err);
			return;
		}
	});

describe("Database tests", () => {
	let db;
	// Create empty database before running any tests
	before(function () {
		db = new sqlite();
	});
	// After tests has ended cleanup the database
	after(function () {
		db.sqlQuery("DELETE", "DELETE FROM cities", []);
		db.close();
	});

	it("should create sqlite3_test.db", function (done) {
		fs.stat(databaseFilePath, function (err, stats) {
			if (err) {
				console.log(err);
				return false;
			}

			expect(stats.isFile()).to.be.true;
			done();
		});
	});

	it("should create empty cities table", async function () {
		await createDbTables();
		const cities = await db.getAllCities();
		expect(cities.length).to.equal(0);
	});

	it("should return one row from database", async function () {
		await db.sqlQuery(
			"INSERT",
			`INSERT INTO cities (name, country, temp, wind, humidity) VALUES (?,?,?,?,?)`,
			["Tallinn", "EE", "12.2", "3.3", "65"]
		);
		const cities = await db.getAllCities();
		expect(cities.length).to.equal(1);
	});
});

module.exports = {
	deleteDbFile
};
