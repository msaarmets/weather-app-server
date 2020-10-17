const sqlite = require("../db");
const cityList = require("../city.list.json");
const countryCodes = require("../utils/countryCodes.json");

const Cities = async () => {
	// Get the list of all cities from database
	const db = new sqlite();
	let list = await db.getAllCities();
	db.close();
	return list;
};

const Countries = (parent, args, context, info) => {
	let countries = {};

	// Generate object by country codes
	cityList.forEach(el => {
		countries[el.country] = countries[el.country] ? countries[el.country] : {};
		if (!countries[el.country]["short"])
			countries[el.country]["short"] = el.country;
		if (!countries[el.country]["long"])
			countries[el.country]["long"] = countryCodes[el.country];
	});

	if (args.country) {
		return [countries[args.country]];
	} else
		return Object.values(countries).map(country => ({
			short: country.short,
			long: country.long
		}));
};

module.exports = {
	Cities,
	Countries
};
