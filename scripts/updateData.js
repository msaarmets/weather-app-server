require("dotenv").config();
const { RefetchData } = require("../app/resolvers/mutations");

// Refetch weather data of cities in database
// This script can be run as a cron job every 15 minutes
RefetchData();
