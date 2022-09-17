import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { User } from '../models/User';
import { RegisterUser } from '../models/RegisterUser';
import { SignInUser } from '../models/SignInUser';
import { Config } from '../Config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: User | undefined = undefined;
  logged: boolean = false;
  apiUrl: String = `http://${Config.API_HOST}:${Config.API_PORT}/`;
  constructor(private http: HttpClient) { }

  postRegister(registerUser: RegisterUser) {
    this.http.get(this.apiUrl + "country/countries/").subscribe((r) => {
        console.log("here", r);
    });
    this.http.post(this.apiUrl + "auth/sign-up/", registerUser).subscribe((res) => {
      console.log(res);
    });
    console.log('postRegister ->', this.apiUrl + "country/countries/", registerUser);
  }

  postSignIn(signInUser: SignInUser) {

  }
}
