import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

export const mimeType = (control: AbstractControl):
 Promise<{[key: string]: any}> |
 Observable<{[key: string]: any}>  => {
   // of: Adding an observable which will emit data
   if (typeof(control.value) === 'string') {
      return of(null);
   }
   const file = control.value as File;
   const fileReader = new FileReader();
   // tslint:disable-next-line: deprecation
   const frObs = Observable.create((observer: Observer<{ [key: string]: any }>) => {
    fileReader.addEventListener('loadend', () => {
      // Is it a vaild file or not
      const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
      // Read a pattern
      let header = '';
      let isValid = false;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16);
      }
      // Validation
      switch (header) {
        case '89504e47':
          isValid = true;
          break;
        case 'ffd8ffe0':
        case 'ffd8ffe1':
        case 'ffd8ffe2':
        case 'ffd8ffe3':
        case 'ffd8ffe8':
          isValid = true;
          break;
        default:
          isValid = false;
          break;
      }
      if (isValid) {
        observer.next(null);
      } else {
        observer.next({ invalidMimeType: true });
      }
      observer.complete();
    });
    // Reads in file
    fileReader.readAsArrayBuffer(file);
   });
   return frObs;
 };