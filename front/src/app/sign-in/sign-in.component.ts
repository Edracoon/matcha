import { Component, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';

import { LoginUser } from '../models/LoginUser';
import { InputErrors } from '../utils/InputErrors';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

    // We decorate the variable to let know the parent that this will be a catchable event
  @Output()
  isSignin = new EventEmitter<boolean>();
  loginUser: LoginUser = new LoginUser();
  inputErrors = new InputErrors();
  errors: any = {};

  constructor() { }

  ngOnInit(): void { }

  enterSubmit(event: KeyboardEvent) {
    if (event.key === "Enter")
      this.submitSignin();
  }

  submitSignin() {
    console.log("submitLogin ->", this.loginUser);
    this.errors.username = this.inputErrors.username(this.loginUser.username);
    this.errors.password = this.inputErrors.password(this.loginUser.password);

    // Check if there is an error, if so, return
    for (let prop in this.errors) {
      if (this.errors[prop] !== "")
        return ;
    }

    // If no errors then submit it for real
    console.log("-- wow no errors for sign in ! --");
  }

  closeForm() {
    this.isSignin.emit(false);
  }
}
