const sqlite = require("../db");
const cityList = require("../city.list.json");

const Cities = async () => {
	const db = new sqlite();

	// Get the list of all cities
	let list = await db.sqlQuery(
		"SELECT",
		"SELECT id, name, country, temp, wind, humidity FROM cities",
		[]
	);

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
