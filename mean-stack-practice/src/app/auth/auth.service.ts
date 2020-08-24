import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from '../auth/auth-data.model';

@Injectable({ providedIn: 'root' })
export class AuthService{

  private token: string;

  constructor(private http: HttpClient) {}

  //for sending back the token
  getToken() {
    return this.token;
  }

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

  loginUser(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    //the values inbetween <> are what is expected back
    this.http.post<{ token: string }>('http://localhost:3000/api/user/login', authData)
    //subscribe to response
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        console.log(response);
      });
  }


}
