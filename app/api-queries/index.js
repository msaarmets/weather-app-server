const { API_URL } = require("../constants");
const axios = require("axios");

// Get the weather data from API by city and country
const getCityWeather = (city, country) =>
	new Promise(async (resolve, reject) => {
		try {
			const response = await axios.get(`${API_URL}&q=${city}, ${country}`);

			if (response.status === 200) {
				resolve(response.data);
			} else {
				console.error("Error getting weather information");
				reject(new Error("Error getting weather information"));
			}
		} catch (e) {
			const err = e.toJSON();
			console.error("getCityWeather error: ", err);
			if (e.response && e.response.data.message === "city not found") {
				reject(new Error("City not found "));
			} else if (e.response.status === 429) {
				reject(
					new Error(
						"API calls per minute limit exceeded. Please try again later."
					)
				);
			}
			reject(new Error(`Weather API error: ${err.message}`));
		}
	});

module.exports = {
	getCityWeather
};