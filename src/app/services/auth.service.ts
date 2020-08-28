import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../user';
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders(environment.options)
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  serverApiUrl: string = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }

  //working fine
  regisrer(user: User): Observable<User> {
    return this.httpClient.post<User>(`${this.serverApiUrl}Account/Register`, user, httpOptions)
      .pipe(catchError(this.handleError)
      );
  }
  //half working: CORS Error on unsafe chrome
  login(user: User): Observable<User> {
    return this.httpClient.post<User>("https://lssocialwebapi.azurewebsites.net/Token", `userName=${user.email}&password=${user.password}&grant_type=password`, httpOptions).pipe(
      tap(user => { localStorage.setItem('user', JSON.stringify(user)); return user; }),
      catchError(this.handleError)
    );
  }
  getUserNameFromLocStor() {
    let userName = JSON.parse(localStorage.getItem('user')).userName;
    return userName;
  }
  getUserIdFromLocStor() {
    let userId = JSON.parse(localStorage.getItem('user')).userId;
    return userId;
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
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error.error_description}`;
      //TODO massage to Register error.ModelState
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
