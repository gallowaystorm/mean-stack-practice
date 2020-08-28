import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorComponent } from './error/error.component';

@Injectable()
//interceptors hook onto any outgoing http request we want it to, this helps with errors
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private dialog: MatDialog) {}

  //<any> gets any outoging request we want instead of certain types
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    //handle returns error observable screen
    return next.handle(req)
    //adds operator to stream
    .pipe(
      catchError( (error: HttpErrorResponse) => {
        //for default error message
        let errorMessage = "An unknown error occurred!"
        //check if error message exists
        if (error.error.message) {
          errorMessage = error.error.message;
        }
        //calls error component
        this.dialog.open(ErrorComponent, {data: { message:  errorMessage}});
        //generates new observable
        return throwError(error);
      })
    );
  }
}
