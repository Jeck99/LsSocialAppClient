import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders, HttpEvent, HttpEventType } from '@angular/common/http';
import { throwError, Observable, of } from 'rxjs';
import { retry, catchError, tap, map } from 'rxjs/operators';
import { Post } from './post';
import { User } from './user';

const httpOptions = {
  headers: new HttpHeaders({
    'Accept': '*/*', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, HEAD', 'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': 'X-Requested-With,content-type', 'withCredentials': 'true'
  })
};

@Injectable({
  providedIn: 'root'
})
export class DataService {
  newDate = Date.now()
  saveDate: Date;
  public first: string = "";
  public prev: string = "";
  public next: string = "";
  public last: string = "";

  private serverApiUrl = "https://lssocialwebapi.azurewebsites.net/api/";

  constructor(private httpClient: HttpClient) { }
  //SIMPLE CRUD FUNCTIONS
  //GET
  public sendGetRequest(api: string) {
    return this.httpClient.get(this.serverApiUrl + api, httpOptions).
      pipe(retry(3), catchError(this.handleError));
  }
  //GET FIRST 4 
  public sendGetFirstFourPostsRequest(api: string) {
    // Add safe, URL encoded _page and _limit parameters 
    return this.httpClient.get(this.serverApiUrl + api,
      { params: new HttpParams({ fromString: "_page=1&_limit=4" }), observe: "response" })
      .pipe(retry(3), catchError(this.handleError), tap(res => {
        console.log(res.headers.get('Post'));
        this.parsePostHeader(res.headers.get('Post'));
      }));
  }
  //GET/:id
  public sendGetByIdRequest(itemId: string, api: string) {
    return this.httpClient.get(`${this.serverApiUrl}${api}/${itemId}`, httpOptions).
      pipe(catchError(this.handleError));
  }
  //working fine
  addNewItemToDb(item: any, api: string): Observable<Post> {
    return this.httpClient.post<any>(this.serverApiUrl + api, item, httpOptions).pipe(
      tap((u: any) => console.log(`added ${api} w/ id=${u.id}`)),
      catchError(this.handleCrudError<any>(`addposts${api}`))
    );
  }
  //PUT
  update(id: number, item: any, api: string): Observable<any> {
    this.saveDate = new Date(this.newDate);
    item.Updatedate = this.saveDate;
    const url = `${this.serverApiUrl + api}/${id}`;
    return this.httpClient.put(url, item, httpOptions).pipe(
      tap(_ => console.log(`updated ${api}-id=${id}`)),
      catchError(this.handleCrudError<any>(`update${api}`))
    );
  }
  //DELETE
  delete(id: string, api: string): Observable<any> {
    const url = `${this.serverApiUrl + api}/${id}`;
    return this.httpClient.delete<any>(url, httpOptions).pipe(
      tap(_ => console.log(`deleted ${api}-id=${id}`)),
      catchError(this.handleCrudError<any>(`delete${api}`))
    );
  }
  //UPLOAD FILE
  public upload(formData) {
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
  regisrer(user: User): Observable<User> {
    user.confirmPassword = user.password;
    return this.httpClient.post<User>(`${this.serverApiUrl}Account/Register`, user, httpOptions)
      .pipe(
        catchError(this.handleCrudError<User>('addUser'))
      );
  }
  //half working: CORS Error on unsafe chrome
  login(user: User): Observable<User> {
    return this.httpClient.post<User>("https://lssocialwebapi.azurewebsites.net/Token", `userName=${user.email}&password=${user.password}&grant_type=password`, httpOptions).pipe(
      tap(user => { localStorage.setItem('user', JSON.stringify(user)); return user; }),
      catchError(this.handleCrudError<User>('loginUser'))
    );
  }
  getUserNameFromLocStor(userName: string) {
    userName = JSON.parse(localStorage.getItem('user')).userName;
    return userName;
  }
  getUserIdFromLocStor(userId: string) {
    userId = JSON.parse(localStorage.getItem('user')).userId;
    return userId;
  }
}
