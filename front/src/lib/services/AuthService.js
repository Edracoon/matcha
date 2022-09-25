import axios from 'axios'

import RegisterUser from '../models/RegisterUser.js';
import SignInUser from '../models/SignInUser.js';
import { Config } from '../Config.js';

const apiUrl = `http://${Config.API_HOST}:${Config.API_PORT}/`;

export default class AuthService {

	/**
	 * Method to register an user
	 * @param {RegisterUser} registerUser
	 */
	static async postRegister(registerUser) {
		let response = undefined;
		console.log('postRegister ->', apiUrl + "auth/sign-up", registerUser);
		try {
			response = await axios({
				url: `${apiUrl}auth/sign-up`,
				method: 'POST',
				data: registerUser
			});
		}
		catch (err) { console.log('Error occured in postRegister ->', err) }
		if (!response) {
			console.error('Error occured in postRegister ->', response);
			return ;
		}
		// if succeed set local storage etc .........
		console.log('postRegister response =', response);
	}

	/**
	 * Method to sign in an user
	 * @param {SignInUser} signInUser
	 */
	static postSignIn(signInUser) {

	}
}
