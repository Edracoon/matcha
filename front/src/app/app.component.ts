import { Component, OnInit } from '@angular/core';
import { RegisterUser } from './models/RegisterUser';

import { RegisterComponent } from './components/register/register.component';
import { SignInComponent } from './components/sign-in/sign-in.component';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	title: String = "matcha";
	isSignin: boolean = false;
	isRegister: boolean = false;

	registerUser: RegisterUser = new RegisterUser();
	constructor() { }

	ngOnInit(): void {
		
	}

	showSignin() {
		console.log("showSignin");
		this.isSignin = true;
		this.isRegister = false;
	}

	showRegister() {
		console.log("showRegister");
		this.isRegister = true;
		this.isSignin = false;
	}

	closeForm(value: boolean) {
		this.isRegister = value;
		this.isSignin = value;
	}
}