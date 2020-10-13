const cityList = require("../city.list.json");

const resolvers = {
	Query: {
		countries: (parent, args, context, info) => {
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
		}
	},
	Country: {
		cities(parent, args, context, info) {
			// Return cities by Country argument
			return cityList.filter(el => {
				return el.country === parent.name;
			});
		}
	}
};

module.exports = {
	resolvers
};
