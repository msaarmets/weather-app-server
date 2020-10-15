const sqlite = require("../db");
const cityList = require("../city.list.json");

const Cities = async () => {
	// Get the list of all cities
	const db = new sqlite();
	let list = await db.getAllCities();
	db.close();
	return list;
};

const Countries = (parent, args, context, info) => {
	let list = [];
	cityList.forEach(el => {
		// Exclude duplicates
		if (!list.includes(el.country)) {
			// If "country" argument is provided use it as a filter
			if (args.country && args.country === el.country) {
				list.push(el.country);
			}
			// Else return all countries
			else if (!args.country) {
				list.push(el.country);
			}
		}
	});

	return list.map(el => {
		return { name: el };
	});
};

module.exports = {
	Cities,
	Countries
};
