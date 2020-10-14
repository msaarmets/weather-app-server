const { gql } = require("apollo-server");

const typeDefs = gql`
	type City {
		id: ID
		name: String
		country: String
		temp: String
		wind: String
		humidity: String
	}
	type Country {
		name: String
		cities: [City]
	}
	type Query {
		Countries(country: String): [Country]
		Cities: [City]
	}
	type Mutation {
		AddCity(city: String!, country: String!): City
	}
`;

module.exports = {
	typeDefs
};
