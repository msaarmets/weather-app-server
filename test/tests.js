process.env.NODE_ENV = "test";

// Set the order of test files run by mocha
require("./database.test");
require("./graphqlQueries.test");
