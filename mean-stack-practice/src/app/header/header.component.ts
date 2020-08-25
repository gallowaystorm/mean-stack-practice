import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{

  userIsAuthenticated = false;
  //to subscribe to observable made in auth-service.ts
  private authListenerSubscription: Subscription

  constructor(private authService: AuthService){}

  ngOnInit(){
    //for auto authentication
    this.userIsAuthenticated = this.authService.getIsAuth();
    //subscribe to listener for status of auth
    this.authListenerSubscription = this.authService.getAuthStatusListener()
      .subscribe( isAuthenticated  => {
        //set based off result of above call to authService
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  //for logout
  onLogout(){
    this.authService.logoutUser();
  }

  ngOnDestroy(){
    //unsubscribe to listener
    this.authListenerSubscription.unsubscribe();
  }

}
