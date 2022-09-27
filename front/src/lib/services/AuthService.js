import axios from 'axios'

import SignUpUser from '../models/SignUpUser.js';
import SignInUser from '../models/SignInUser.js';
import { Config } from '../Config.js';

const apiUrl = `http://${Config.API_HOST}:${Config.API_PORT}/`;

export default class AuthService {

	/**
	 * Method to SignUp an user
	 * @param {SignUpUser} SignUpUser
	 */
	static async postSignUp(signUpUser) {
		let response = undefined;
		console.log('postSignUp ->', apiUrl + "auth/sign-up", signUpUser);
		try {
			response = await axios({
				url: `${apiUrl}auth/sign-up`,
				method: 'POST',
				data: signUpUser
			});
		}
		catch (err) { console.log('Error occured in postSignUp ->', err) }
		if (!response) {
			console.error('Error occured in postSignUp ->', response);
			return ;
		}
		// if succeed set local storage etc .........
		console.log('postSignUp response =', response);
	}

	/**
	 * Method to sign in an user
	 * @param {SignInUser} signInUser
	 */
	static postSignIn(signInUser) {

	}
}
