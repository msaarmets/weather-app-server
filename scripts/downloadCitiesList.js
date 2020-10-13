/** Script to download cities list from OpenWeather */

const http = require("http");
const zlib = require("zlib");
const fs = require("fs");
const path = require("path");

const url = "http://bulk.openweathermap.org/sample/city.list.json.gz";
const filePath = path.resolve(__dirname, "../app/", "city.list.json");

const file = fs.createWriteStream(filePath);

// Download the file
http.get(url, function (response) {
	const { statusCode } = response;

	if (statusCode !== 200) {
		console.error(`Request Failed.\nStatus Code: ${statusCode}`);
		response.resume();
		return;
	}

	try {
		const gunzip = zlib.createGunzip();
		response
			.pipe(gunzip) // unzip
			.pipe(file) // save to filePath
			.on("finish", () => console.log("Cities list downloaded"))
			.on("error", e => console.error("Error downloading cities list: ", e));
	} catch (e) {
		console.error("error downloading file: ", e);
	}
});
