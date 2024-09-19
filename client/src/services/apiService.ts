import axios from 'axios';

const apiUrl: string = "http://127.0.0.1:4242";
const frontUrl: string = "http://127.0.0.1:80";

async function apiService(
	{ method, path, token, options, params, onSuccess, onError }:
	{ method: string, path: string, token?: string, options?: object, params?: object, onSuccess: (data: any) => void, onError: (error: any) => void }
) {

	method = method.toLowerCase();

	try {
		const res = await axios({
			method: method,
			url: path.startsWith("http") ? path : apiUrl + path,
			credentials: "include",
			headers: {
				Authorization: "Bearer " + token,
				// referer: frontUrl,
				accept: "application/json",
			},
			...options,
			params,
		});
		console.log("apiService success => ", res.data)
		onSuccess(res.data);
	}
	catch (error: any) {
		//  redirect to "/login" if 401
		if (error.response.status === 401 && window.location.pathname !== "/")
			window.location.href = "/";
		console.log("apiService error => ", error.response)
		onError(error.response)
	}
}

export default apiService