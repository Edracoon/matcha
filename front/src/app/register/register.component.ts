import { Component, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';

import { RegisterUser } from '../models/RegisterUser';
import { InputErrors } from '../utils/InputErrors';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  // We decorate the variable to let know the parent that this will be a catchable event
  @Output()
  isRegister = new EventEmitter<boolean>();
  registerUser = new RegisterUser();
  inputErrors = new InputErrors();
  errors: any = {};

  constructor() { }

  ngOnInit(): void { }

  enterSubmit(event: KeyboardEvent) {
    if (event.key === "Enter")
      this.submitRegister();
  }

  submitRegister() {
    console.log("submitRegister ->", this.registerUser);
    this.errors.firstname = this.inputErrors.firstname(this.registerUser.firstname);
    this.errors.lastname = this.inputErrors.lastname(this.registerUser.lastname);
    this.errors.email = this.inputErrors.email(this.registerUser.email);
    this.errors.username = this.inputErrors.username(this.registerUser.username);
    this.errors.password = this.inputErrors.password(this.registerUser.password);
    this.errors.password2 = this.inputErrors.password(this.registerUser.password2);
    if (this.registerUser.password !== this.registerUser.password2)
      this.errors.password2 = "Passwords are not the same !";
    
    // Check if there is an error, if so, return
    for (let prop in this.errors) {
      if (this.errors[prop] !== "")
        return ;
    }

    // If no errors then submit it for real
    console.log("-- wow no errors fpr register ! --");
  }

  closeForm() {
    this.isRegister.emit(false);
  }
}
