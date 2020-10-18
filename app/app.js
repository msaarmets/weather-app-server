require("dotenv").config();
const { ApolloServer } = require("apollo-server");
const { typeDefs } = require("./schema");
const { resolvers } = require("./resolvers");

const server = new ApolloServer({ typeDefs, resolvers });
const port = process.env.PORT || 4000;

server.listen(port).then(({ url }) => {
	console.log(`🚀  Server ready at ${url}`);
});

module.exports = server;
