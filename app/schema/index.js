const { gql } = require("apollo-server");

const typeDefs = gql`
	"City from local database"
	type City {
		id: ID
		name: String
		country: String
		temp: String
		wind: String
		humidity: String
	}

	"List of all the countries availabe"
	type Country {
		short: String
		long: String
		cities: [String]
	}

	type Query {
		"List of all countries and cities available"
		Countries(country: String): [Country]
		"List of all cities saved to database"
		Cities: [City]
	}

	type Mutation {
		AddCity(city: String!, country: String!): City
		RemoveCity(id: ID!): Boolean
		RefetchData: [City]
	}
`;

module.exports = {
	typeDefs
};
