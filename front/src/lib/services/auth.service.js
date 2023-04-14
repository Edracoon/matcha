import axios from 'axios'
import { Config } from '../Config.js';

const apiUrl = `http://${Config.API_HOST}:${Config.API_PORT}/`;

export default class AuthService {

	/**
	 * Method to SignUp an user
	 * @param {SignUpUser} SignUpUser
	 */
	static async postSignUp(signUpUser) {
		try {
			const res = await axios({
				url: `${apiUrl}auth/sign-up`,
				method: 'POST',
				data: signUpUser
			});
			// Success
			console.log('AuthService.postSignUp() ->', res);
		}
		catch (err) {
			console.log('AuthService.postSignUp() ->', err);
		}
	}

	/**
	 * Method to sign in an user
	 * @param {SignInUser} signInUser
	 */
	static async postSignIn(signInUser) {
		try {
			const res = await axios({
				url: `${apiUrl}auth/sign-up`,
				method: 'POST',
				data: signInUser
			});
			// Success
			console.log('AuthService.postSignIn() ->', res);
		}
		catch (err) {
			console.log('AuthService.postSignIn() ->', err);
		}
	}
}
