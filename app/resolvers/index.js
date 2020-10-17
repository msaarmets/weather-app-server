const cityList = require("../city.list.json");
const { AddCity, RemoveCity, RefetchData } = require("./mutations");
const { Cities, Countries } = require("./queries");

const resolvers = {
	Query: {
		Countries,
		Cities
	},
	Mutation: {
		AddCity,
		RemoveCity,
		RefetchData
	},
	Country: {
		cities(parent, args, context, info) {
			// Filter cities by Country argument
			const list = cityList.filter(el => {
				return el.country === parent.short;
			});

			// Return the array of unique names sorted alphabetically
			const res = list.map(el => el.name);
			res.sort();
			return Array.from(new Set(res));
		}
	}
};

module.exports = {
	resolvers
};
