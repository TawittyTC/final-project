import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getCurrentUserEmail() {
    throw new Error('Method not implemented.');
  }
  endpoint: string = 'http://localhost:3000/api'; // URL ของ Express.js API
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};

  constructor(
    private http: HttpClient,
    public router: Router
  ) {
  }

  // Sign-up
  signUp(user: User): Observable<boolean> {
    const api = `${this.endpoint}/register`;
    return this.http.post(api, user, { headers: this.headers })
      .pipe(
        map((data: any) => {
          return data.success === true;
        }),
        catchError(this.handleError)
      );
  }

  // Sign-in
  signIn(user: User): Observable<any> {
    const api = `${this.endpoint}/login`;
    return this.http.post(api, user, { headers: this.headers })
      .pipe(
        map((data: any) => {
          if (data.token) {
            localStorage.setItem('access_token', data.token);
            localStorage.setItem('name', data.name);
            localStorage.setItem('lname', data.lname);
            localStorage.setItem('email', data.email);
            localStorage.setItem('role', data.role);
            localStorage.setItem('level', data.level);
            localStorage.setItem('group', data.group);

            return data;
          } else {
            throw new Error('ชื่อหรือรหัสไม่ถูกต้อง');
          }
        }),
        catchError(this.handleError)
      );
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('name');
    localStorage.removeItem('lname');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('level');
    localStorage.removeItem('group');
    this.router.navigate(['/home-componet']); // นำทางไปยังหน้าล็อกอินหลังจากล็อกเอาท์
  }
  // User profile
  getUserProfile(email: string): Observable<any> {
    const api = `${this.endpoint}/profile/${email}`;
    return this.http.get(api, { headers: this.headers }).pipe(
      map((res: any) => res),
      catchError(this.handleError)
    );
  }
  
  
  // Error
  private handleError(error: HttpErrorResponse) {
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
