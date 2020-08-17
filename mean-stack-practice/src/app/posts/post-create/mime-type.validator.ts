import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

//validates mime type of images uploads (promise and Observable are return types)
export const mimeType = (control: AbstractControl): Promise<{ [key: string]: any }> | Observable< { [key: string]: any } > => {
  //add check to see if string or not for editing mode or create mode
  if (typeof(control.value) === 'string') {
    return of(null);
  }
  //extract file
  const file = control.value as File;
  const fileReader = new FileReader();
  //convert into observable
  const frObs = Observable.create( (observer: Observer< { [key: string]: any } >) => {
    fileReader.addEventListener('loadend', () => {
      //mime type validation
      const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0,4);
      //read pattern
      let header = '';
      let isValid = false;
      for (let i = 0; i < arr.length; i++){
        //convert to hexadecimal string values
        header += arr[i].toString(16);
      }
      //"random" numbers/letters correspond to file types in javascript
      switch (header) {
        case "89504e47":
          isValid = true;
          break;
        case "ffd8ffe0":
        case "ffd8ffe1":
        case "ffd8ffe2":
        case "ffd8ffe3":
        case "ffd8ffe8":
          isValid = true;
          break;
        default:
          isValid = false; // Or you can use the blob.type as fallback
          break;
      }
      //if file is valid type...
      if (isValid){
        observer.next(null);
      } else {
        observer.next({invalidMimType: true})
      }
      //let any subscribers know that we are done
      observer.complete();
    });
    //start process
    fileReader.readAsArrayBuffer(file);
  });
  //return observable;
  return frObs;
};
