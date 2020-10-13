const { gql } = require("apollo-server");

const typeDefs = gql`
	type City {
		name: String
	}
	type Country {
		name: String
		cities: [City]
	}
	type Query {
		countries(country: String): [Country]
	}
`;

module.exports = {
	typeDefs
};
