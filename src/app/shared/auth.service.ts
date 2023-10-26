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
  endpoint: string = 'http://localhost:4000/api'; // Replace with your API endpoint
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};

  constructor(
    private http: HttpClient,
    public router: Router
  ) {
  }

  // Sign-up
  signUp(user: User): Observable<boolean> {
    let api = `${this.endpoint}/register`; // Corrected API URL
    return this.http.post(api, user)
      .pipe(
        map((data: any) => {
          if (data.success === true) { // Check for boolean true, not string 'true'
            return true;
          } else {
            return false;
          }
        }),
        catchError(this.handleError) // Handle errors using the handleError method
      );
  }

  // Sign-in
  signIn(user: User): void {
    this.http.post<any>(`${this.endpoint}/signin`, user)
      .subscribe(
        (res: any) => {
          if (res.token) {
            localStorage.setItem('access_token', res.token);
            //this.router.navigate(['profile/' + res.id]);
          } else {
            alert('ชื่อหรือรหัสไม่ถูกต้อง');
          }
        },
        error => {
          console.error('Sign-in error:', error);
          alert('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
        }
      );
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean {
    let authToken = this.getToken();
    return authToken !== null;
  }

  doLogout(): void {
    localStorage.removeItem('access_token');
    this.router.navigate(['log-in']);
  }

  // Error
  handleError(error: HttpErrorResponse): Observable<never> {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error('API Error:', msg);
    return throwError('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
  }
}
