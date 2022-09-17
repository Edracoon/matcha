import Config from "../../Config.js";
import fetch, { Headers } from 'node-fetch';

class countryController {

	allCountries(req, res) {
		console.log('country/countries');
		try {
			let headers = new Headers(); headers.append("X-CSCAPI-KEY", Config.API_COUNTRY_KEY);
			const requestOptions = {
				method: "GET",
				headers: headers,
				redirect: "follow",
			};

			fetch("https://api.countrystatecity.in/v1/countries", requestOptions)
			.then((response) => response.json()).then((result) => {
				result = result.map((value) => {
					return { value: value.iso2, label: value.name };
				});
				res.send(JSON.stringify(result));
			}).catch(e => console.log(e));
		}
		catch(error) {
			console.log("allCountries =>", error);
		}
	}

	allCitiesFromCountry(req, res) {
		try {
			const country = req.params.country_code;
			let headers = new Headers();
			headers.append("X-CSCAPI-KEY", Config.API_COUNTRY_KEY);
			const requestOptions = {
				method: 'GET',
				headers: headers,
				redirect: 'follow'
			};

			fetch(`https://api.countrystatecity.in/v1/countries/${country}/cities`, requestOptions)
			.then(response => response.json()).then(result => {
				result = result.map((value) => {
					return { value: value.id, label: value.name };
				});
				res.send(result);
			});
		}
		catch(error) {
			console.log("allCitiesFromCountry =>", error);
		}
	}

}

export default new countryController();