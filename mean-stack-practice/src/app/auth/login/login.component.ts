import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLoading = false;

  constructor() { }

  ngOnInit() {
  }

  onLogin(form: NgForm){
    console.log(form.value);
  }

}
