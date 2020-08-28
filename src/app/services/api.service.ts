import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders} from '@angular/common/http';
import { throwError, Observable, of } from 'rxjs';
import { retry, catchError, tap, map } from 'rxjs/operators';
import { Post } from '../post';
import { User } from '../user';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

const httpOptions = {
  headers: new HttpHeaders(environment.options)
};

@Injectable({
  providedIn: 'root'
})
export class DataService {
  newDate = Date.now()
  saveDate: Date;
   first: string = "";
   prev: string = "";
   next: string = "";
   last: string = "";
  serverApiUrl: string= environment.apiUrl;

  constructor(private httpClient: HttpClient, private authService:AuthService) { }
  //SIMPLE CRUD FUNCTIONS
  //GET
  sendGetRequest(api: string) {
    return this.httpClient.get(this.serverApiUrl + api, httpOptions).
      pipe(retry(3), catchError(this.handleError));
  }
  //GET FIRST 4 
  sendGetFirstFourRequest(api: string) {
    // Add safe, URL encoded _page and _limit parameters 
    return this.httpClient.get(this.serverApiUrl + api,{ params: new HttpParams({ fromString: "_page=1&_limit=4" }), observe: "response" })
      .pipe(retry(3), catchError(this.handleError));
  }
  //GET/:id
   sendGetByIdRequest(itemId: number, api: string) {
    return this.httpClient.get(`${this.serverApiUrl}${api}/${itemId}`, httpOptions).
      pipe(catchError(this.handleError));
  }
  //working fine
  //POST
  addNewItemToDb(item: any, api: string): Observable<Post> {
    return this.httpClient.post<any>(this.serverApiUrl + api, item, httpOptions).pipe(
      tap((u: any) => console.log(`added ${api} w/ id=${u.id}`)),
      catchError(this.handleError)
    );
  }
  //PUT
  update(id: number, item: any, api: string): Observable<any> {
    this.saveDate = new Date(this.newDate);
    item.Updatedate = this.saveDate;
    const url = `${this.serverApiUrl + api}/${id}`;
    return this.httpClient.put(url, item, httpOptions).pipe(
      tap(_ => console.log(`updated ${api}-id=${id}`)),
      catchError(this.handleError)
    );
  }
  //DELETE
  delete(id: string, api: string): Observable<any> {
    const url = `${this.serverApiUrl + api}/${id}`;
    return this.httpClient.delete<any>(url, httpOptions).pipe(
      tap(_ => console.log(`deleted ${api}-id=${id}`)),
      catchError(this.handleError)
    );
  }
  //UPLOAD FILE
   upload(formData) {
    return this.httpClient.post<any>(this.serverApiUrl, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
  //ERROR HANDLING
  handleError(error: HttpErrorResponse) {
    console.log(error);

    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
  parsePostHeader(header) {
    if (header.length == 0) {
      return;
    }

    let parts = header.split(',');
    var Posts = {};
    parts.forEach(p => {
      let section = p.split(';');
      var url = section[0].replace(/<(.*)>/, '$1').trim();
      var name = section[1].replace(/rel="(.*)"/, '$1').trim();
      Posts[name] = url;

    });

    this.first = Posts["first"];
    this.last = Posts["last"];
    this.prev = Posts["prev"];
    this.next = Posts["next"];
  }
  //GENERAL ERROR HANDLING FOR THE CRUD FUNCTIONS
  handleCrudError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
  //working fine
  regisrer(user: User) : Observable<User> {
    user.confirmPassword = user.password;
    return this.authService.regisrer(user)
  }
  //half working: CORS Error on unsafe chrome
  login(user: User): Observable<User> {
    return this.authService.login(user)
  }

}
