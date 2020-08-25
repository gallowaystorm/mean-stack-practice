import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLoading = false;

  constructor(public authService: AuthService) { }

  ngOnInit() {
  }

  onLogin(form: NgForm){
    //check if form is valid
    if (form.invalid) {
      return
    }
    this.isLoading = true;
    //send request
    this.authService.loginUser(form.value.email, form.value.password);
  }

}
