import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

//injectable allows us to inject other services into services
@Injectable()
//interceptors hook onto any outgoing http request we want it to, this helps with authorization
export class AuthInterceptor implements HttpInterceptor {

  //connstruct the auth service
  constructor(private authService: AuthService) {}
  //<any> gets any outoging request we want instead of certain types
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    //inject token into method
    const authToken = this.authService.getToken();
    //manipulate request to hold token
    //clones request
    const authRequest = req.clone({
      //set adds a new header to the already existing headers
        //bearer is on the front of all tokens and headers (see check-auth.js for a comment explaining)
      headers: req.headers.set("Authorization", "Bearer " + authToken)
    });
    console.log(authRequest);
    return next.handle(authRequest);
  };
}
