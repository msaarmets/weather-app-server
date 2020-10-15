const { createTestClient } = require("apollo-server-testing");
const server = require("../app/app");
const { deleteDbFile } = require("./database.test");
const chai = require("chai");
const chaiGraphQL = require("chai-graphql");
chai.use(chaiGraphQL);
const expect = chai.expect;

describe("GraphQL tests", function () {
	after(function () {
		// Close the server after the tests
		server.stop();
		// And delete the database file
		deleteDbFile();
	});

	it("Adds new city to the database", async function () {
		const { mutate } = createTestClient(server);
		const response = await mutate({
			mutation: `mutation { AddCity(city: "Tartu", country: "EE"){
				name
				country
				}
			}`
		});
		expect(response).to.be.graphQL({
			AddCity: {
				name: "Tartu",
				country: "EE"
			}
		});
	});

	it("Adds same city again and returns error", async function () {
		const { mutate } = createTestClient(server);
		const response = await mutate({
			mutation: `mutation { AddCity(city: "Tartu", country: "EE"){
				name
				country
				}
			}`
		});
		expect(response).to.be.graphQLError();
	});

	it("Returns 'Tartu' from database", async function () {
		const { query } = createTestClient(server);
		const response = await query({
			query: `{ Cities{
				id
				name
				country
				temp
				wind
				humidity
				} 
			}`
		});

		const data = response.data.Cities[0];

		expect(response).to.be.graphQLSubset({
			Cities: [
				{
					name: "Tartu",
					country: "EE"
				}
			]
		});
		expect(data).to.have.property("id");
		expect(data).to.have.property("temp");
		expect(data).to.have.property("wind");
		expect(data).to.have.property("humidity");
	});
});
