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
	const weatherData = await getCityWeather(args.city, args.country);

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
	const res = await db.getCityById(id);

	db.close();

	return res.length === 0
		? {}
		: {
				id: res[0].id,
				name: res[0].name,
				country: res[0].country,
				temp: res[0].temp,
				wind: res[0].wind,
				humidity: res[0].humidity
		  };
};

const RemoveCity = async (parent, args, context, info) => {
	try {
		const db = new sqlite();
		const res = await db.sqlQuery("DELETE", "DELETE FROM cities WHERE id=?", [
			args.id
		]);
		if (res === 1) {
			return true;
		} else {
			return new Error("City is already deleted from database");
		}
	} catch (e) {
		return new Error(e.message);
	} finally {
		db.close();
	}
};

const RefetchData = async () => {
	const db = new sqlite();
	// Get the list of all cities in the database
	const cities = await db.getAllCities();

	// Get the weather information for every city and save the data to the database
	const updateCities = () =>
		new Promise((resolve, reject) =>
			cities.forEach(async (city, index) => {
				try {
					const data = await getCityWeather(city.name, city.country);
					await db.sqlQuery(
						"UPDATE",
						"UPDATE cities SET temp = ?,  wind = ?,  humidity = ? WHERE id = ?;",
						[data.temp, data.windSpeed, data.humidity, city.id]
					);
					return;
				} catch (e) {
					console.error("Error updating weather information: ", e);
					reject(e);
				} finally {
					if (index === cities.length - 1) resolve();
				}
			})
		);

	await updateCities();

	// Get the updated data from database and return it
	const res = await db.getAllCities();
	db.close();
	return res;
};

module.exports = {
	AddCity,
	RemoveCity,
	RefetchData
};
