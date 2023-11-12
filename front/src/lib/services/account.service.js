import axios from 'axios'
import { Config } from '../Config.js';

const apiUrl = `http://${Config.API_HOST}:${Config.API_PORT}/`;

export default class AccountService {


    static async getMyself() {
        try {
            const res = await axios({
                method: "get",
                url: `${apiUrl}account/myself`,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return res.data;
        } catch (err) {
            console.log('AuthService.getMyself() ->', err);
            return "error";
        }
    }

    static async postEmailCode(emailValidationCode) {
        try {
            const res = await axios({
                method: "post",
                url: `${apiUrl}auth/confirm-email`,
                data: {
                    emailValidationCode
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return true;
        } catch (err) {
            console.log('AuthService.postEmailCode() ->', err);
            return false;
        }
    }

    static async getRedirectUrl(currRoute) {
        try {
            const res = await axios({
                method: "get",
                url: `${apiUrl}account/myself`,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log(res.data)
            if (res.data.user.emailValidated === 0)
                return "/email-confirmation";
            else if (res.data.user.preferencesSet === 0)
                return "/preferences";
            else
                return currRoute;
        } catch (err) {
            console.log('AuthService.redirection() ->', err);
            localStorage.removeItem('token');
            return "/";
        }
    }
};