const sqlite = require("../db");
const { getCityWeather } = require("../api-queries");

const AddCity = async (parent, args, context, info) => {
	const db = new sqlite();

	// Check if this city already exists in database
	const exists = await db.sqlQuery(
		"SELECT",
		"SELECT id FROM cities WHERE name=? AND country=?",
		[args.city, args.country]
	);
	if (exists.length > 0) {
		db.close();
		return new Error(`${args.city} is already saved in database.`);
	}

	// Get weather data from API
	const data = await getCityWeather(args.city, args.country);
	let weatherData = {
		temp: data && data.main ? data.main.temp : "",
		humidity: data && data.main ? data.main.humidity : "",
		windSpeed: data && data.main ? data.wind.speed : ""
	};

	// Insert city to the database
	const id = await db.sqlQuery(
		"INSERT",
		`INSERT INTO cities (name, country, temp, wind, humidity) VALUES (?,?,?,?,?)`,
		[
			args.city,
			args.country,
			weatherData.temp,
			weatherData.windSpeed,
			weatherData.humidity
		]
	);

	// Get the values for the response
	const res = await db.sqlQuery(
		"SELECT",
		"SELECT id, name, country, temp, wind, humidity FROM cities WHERE id=?",
		[id]
	);

	db.close();

	return res.length === 0
		? {}
		: {
				id: res[0].id,
				name: res[0].name,
				temp: res[0].temp,
				wind: res[0].wind,
				humidity: res[0].humidity
		  };
};

module.exports = {
	AddCity
};
