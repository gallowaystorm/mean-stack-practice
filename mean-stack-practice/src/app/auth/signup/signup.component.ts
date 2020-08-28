import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service'
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  isLoading = false;
  //to handle subscription in ngoninit
  private authStatusSub: Subscription;

  constructor(public authService: AuthService) { }

  ngOnInit() {
    //for handline error
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus =>{
        this.isLoading = false;
      });
  }

  onSignup(form: NgForm){
    if (form.invalid){
      return
    }
    this.isLoading = true;
      //send request to create user
    this.authService.createUser(form.value.email, form.value.password);
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }
}
