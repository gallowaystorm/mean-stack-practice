import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  constructor(private authService: AuthService) {}

  ngOnInit(){
    //to auto authenticate user if they have previously logged in within expiration time
    this.authService.autoAuthUser();
  }
}

