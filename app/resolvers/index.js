const cityList = require("../city.list.json");
const { AddCity } = require("./mutations");
const { Cities, Countries } = require("./queries");

const resolvers = {
	Query: {
		Countries,
		Cities
	},
	Mutation: {
		AddCity
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
