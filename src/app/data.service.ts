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

  public first: string = "";
  public prev: string = "";
  public next: string = "";
  public last: string = "";

  // private postsApiUrl = "https://cors-anywhere.herokuapp.com/http://localhost:3000/posts";
  private postsApiUrl = "https://localhost:44324/api/Posts";

  constructor(private httpClient: HttpClient) { }
  //GET posts
  public sendGetPostsRequest() {
    return this.httpClient.get(this.postsApiUrl, { withCredentials: true }).pipe(retry(3), catchError(this.handleError));
  }
  //GET FIRST 4 posts
  public sendGetFirstFourPostsRequest() {
    // Add safe, URL encoded _page and _limit parameters 
    return this.httpClient.get<Post>(this.postsApiUrl, { params: new HttpParams({ fromString: "_page=1&_limit=4" }), observe: "response" }).pipe(retry(3), catchError(this.handleError), tap(res => {
      console.log(res.headers.get('Post'));
      this.parsePostHeader(res.headers.get('Post'));
    }));
  }
  //GET FROM URL
  public sendGetRequestToUrl(url: string) {
    return this.httpClient.get<Post>(url, { withCredentials: true, observe: "response" }).pipe(retry(3), catchError(this.handleError), tap(res => {
      console.log(res.headers.get('Post'));
      this.parsePostHeader(res.headers.get('Post'));

    }));
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
  //SIMPLE CRUD FUNCTIONS
  getPosts(): Observable<Post[]> {
    return this.httpClient.get<Post[]>(this.postsApiUrl, httpOptions)
      .pipe(
        tap(posts => console.log('fetched posts')),
        catchError(this.handleCrudError('getPosts', []))
      );
  }

  getPostById(id: string): Observable<Post> {
    const url = `${this.postsApiUrl}/${id}`;
    return this.httpClient.get<Post>(url).pipe(
      tap(_ => console.log(`fetched posts id=${id}`)),
      catchError(this.handleCrudError<Post>(`getPostsById id=${id}`))
    );
  }
  //working fine
  addPost(post: Post): Observable<Post> {
    return this.httpClient.post<Post>(this.postsApiUrl, post, httpOptions).pipe(
      tap((u: Post) => console.log(`added posts w/ id=${u.id}`)),
      catchError(this.handleCrudError<Post>('addposts'))
    );
  }
  newDate = Date.now()
  saveDate: Date;
  updatePost(id: number, post: Post): Observable<any> {
    this.saveDate = new Date(this.newDate);
    post.Updatedate = this.saveDate;
    const url = `${this.postsApiUrl}/${id}`;
    return this.httpClient.put(url, post, httpOptions).pipe(
      tap(_ => console.log(`updated posts id=${id}`)),
      catchError(this.handleCrudError<any>('updateposts'))
    );
  }

  deletePost(id: string): Observable<Post> {
    const url = `${this.postsApiUrl}/${id}`;
    return this.httpClient.delete<Post>(url, httpOptions).pipe(
      tap(_ => console.log(`deleted posts id=${id}`)),
      catchError(this.handleCrudError<Post>('deleteposts'))
    );
  }

  public upload(formData) {
    return this.httpClient.post<any>(this.postsApiUrl, formData, {
      reportProgress: true,
      observe: 'events'
    });
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
    return this.httpClient.post<User>("https://localhost:44324/api/Account/Register", user, httpOptions).pipe(
      catchError(this.handleCrudError<User>('addUser'))
    );
  }
  //half working: CORS Error on unsafe chrome
  login(user: User): Observable<User> {
    return this.httpClient.post<User>("https://localhost:44324/Token", `userName=${user.email}&password=${user.password}&grant_type=password`, httpOptions).pipe(
      tap(user => {localStorage.setItem('user', JSON.stringify(user));return user;}),
      catchError(this.handleCrudError<User>('loginUser'))
    );
  }
  getUserNameFromLocStor(userName:string) {
    userName = JSON.parse(localStorage.getItem('user')).userName;
    return userName;
  }
  getUserIdFromLocStor(userId:string) {
    userId = JSON.parse(localStorage.getItem('user')).userId;
    return userId;
  }
}
// 66d4ad97-3df4-4cdf-bbd4-393f18a50b7d