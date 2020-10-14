const { gql } = require("apollo-server");

const typeDefs = gql`
	type City {
		name: String
		temp: String
		wind: String
		humidity: String
	}
	type Country {
		name: String
		cities: [City]
	}
	type Query {
		countries(country: String): [Country]
	}
	type Mutation {
		addCity(city: String!, country: String!): City
	}
`;

module.exports = {
	typeDefs
};
