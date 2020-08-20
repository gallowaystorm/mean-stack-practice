import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from '../auth/auth-data.model';

@Injectable({ providedIn: 'root' })
export class AuthService{

  constructor(private http: HttpClient) {}

  //send request for new user
  createUser(email: string, password: string){
    //creating what is in the auth throught the auth-data.model.ts file and importing it
    const authData: AuthData = {email: email, password: password};
    this.http.post('http://localhost:3000/api/user/signup', authData)
    //subscibing to it
    .subscribe(response => {
      console.log(response);
    });
  }
}
