import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable, of, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjIiLCJzdWIiOiJBZG1pblVzZXIiLCJBZG1pbiI6IjAiLCJVc2VyVHlwZSI6IiIsImp0aSI6IjIiLCJSb2xlIjoiMSIsIlBhcmVudElkIjoiMCIsIm5iZiI6MTUyODk2MDg4MywiZXhwIjoxNTI5MDQ3MjgzLCJpc3MiOiJIZWxsbyBQYXltZW50IEdhdGV3YXkiLCJhdWQiOiJIUEdTZXJ2ZXIifQ._PSx71wORik3ZnMYsGLpXIimn_QqGzGbbA4qjGqXtZo`
};

@Injectable({providedIn: 'root'})
export class CommonAPIFuncService {
  constructor(private http: HttpClient) {
  }

  get(url) {
    return this.http.get(url, {
      headers: httpOptions.headers
    });
  }

  post(url, data) {
    return this.http.post(url, data, httpOptions);
  }

  delete(url) {
    return this.http.delete(url, httpOptions);
  }

  put(url, data) {
    return this.http.put(url, data, httpOptions);
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      // return Observable.throw(error.json().error || error.message);
      return throwError(error);
      // return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  log(message: string) {
    // this.messageService.add('HeroService: ' + message);
  }


}
