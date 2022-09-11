import Config from "../Config.js";

/* Temporary file */

app.get("/all-countries", (req, res) => {
	let	headers = new Headers();
	headers.append("X-CSCAPI-KEY", Config.API_COUNTRY_KEY);
	let	requestOptions = {
		method: "GET",
		headers: headers,
		redirect: "follow",
	};
	fetch("https://api.countrystatecity.in/v1/countries", requestOptions)
	.then((response) => response.json())
	.then((result) => {
		result = result.map((value) => {
			return { value: value.iso2, label: value.name };
		});
		res.send(result);
	})
	.catch((error) => console.log("error", error));
});
  
app.get("/all-cities/:country", (req, res) => {
	const country = req.params.country;
	let headers = new Headers();
	headers.append("X-CSCAPI-KEY", Config.API_COUNTRY_KEY);
	let requestOptions = {
	method: 'GET',
	headers: headers,
	redirect: 'follow'
	};
	fetch(`https://api.countrystatecity.in/v1/countries/${country}/cities`, requestOptions)
	.then(response => response.json())
	.then(result => {
		result = result.map((value) => {
			return { value: value.id, label: value.name };
		});
		res.send(result);
	});
});