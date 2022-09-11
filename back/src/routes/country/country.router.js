import express from "express";
import countryController from "./country.controller.js";

const countryRouter = express.Router();

countryRouter.get("/country/countries", countryController.allCountries);
countryRouter.get("/country/cities/:country_code", countryController.allCitiesFromCountry);

export default countryRouter;