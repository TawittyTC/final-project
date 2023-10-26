import { Injectable } from '@angular/core';
import { User } from './user';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
 // endpoint: string = 'http://localhost:4000/api';
  endpoint: string = 'http://localhost/jwt-server/';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};

  constructor(
    private http: HttpClient,
    public router: Router
  ) {
  }

  // Sign-up
  signUp(user: User): Observable<any> {
    let api = `${this.endpoint}register.php`;
    return this.http.post(api, user)
      .pipe(
        map((data: Response) => {
          console.log(data['success']);
          if(data && data['success'] && data['success'] == 'true'){
            return true;
          }else{
            return false;
          }
        })
      )
  }

  // Sign-in
  signIn(user: User) {
    return this.http.post<any>(`${this.endpoint}sigin.php`, user)
      .subscribe((res: any) => {
        if(res){
          localStorage.setItem('access_token', res.token)
          //console.log("token="+res.token);
          this.router.navigate(['profile/' + res.id]);
        }else{
          alert('ชื่อหรือรหัสไม่ถูกต้อง');
        }
      })
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('access_token');
    return (authToken !== null) ? true : false;
  }

  doLogout() {
    let removeToken = localStorage.removeItem('access_token');
    if (removeToken == null) {
      this.router.navigate(['log-in']);
    }
  }

  // User profile
  getUserProfile(): Observable<any> {
   // let api = `${this.endpoint}/user-profile/${id}`;
    let api = `${this.endpoint}get.php`;
    return this.http.get(api, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.handleError)
    )
  }

  // Error
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }
}
