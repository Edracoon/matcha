import express from "express";
import countryController from "./country.controller.js";

const countryRouter = express.Router();

countryRouter.get("/country/all-countries", countryController.allCountries);
countryRouter.get("/country/all-cities/:country", countryController.allCitiesFromCountry);

export default fakerRouter;