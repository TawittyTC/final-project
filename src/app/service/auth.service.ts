import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from './user';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  endpoint: string = 'http://localhost:3000/api'; // URL ของ Express.js API
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};
  private jwtHelper = new JwtHelperService();
  private secretKey = 'your-secret-key';
  constructor(
    private http: HttpClient,
    public router: Router
  ){

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
  signIn(user: User): Observable<any> {
    const api = `${this.endpoint}/login`;
    return this.http.post(api, user, { headers: this.headers }).pipe(
      map((data: any) => {
        if (data.token) {
          // Decode the JWT token
          const decodedToken = this.decodeToken(data.token);
  
          // Check if userId property exists in the decoded token
          if (decodedToken && decodedToken.userId) {
            const userIdData = decodedToken.userId;
            // Store the decoded data in local storage
            localStorage.setItem('access_token', data.token);
            localStorage.setItem('name', userIdData.name);
            localStorage.setItem('lname', userIdData.lname);
            localStorage.setItem('email', userIdData.email);
            localStorage.setItem('role', userIdData.role);
            localStorage.setItem('level', userIdData.level);
            localStorage.setItem('group', userIdData.group);
  
            // Set token expiration time
            const tokenExp = decodedToken.exp;
            localStorage.setItem('token_exp', tokenExp.toString());
  
            return data;
          } else {
            throw new Error('ชื่อหรือรหัสไม่ถูกต้อง');
          }
        } else {
          throw new Error('ชื่อหรือรหัสไม่ถูกต้อง');
        }
      }),
      catchError(this.handleError)
    );
  }
  
  // Decode the JWT token
  decodeToken(token: string): any {
    try {
      return this.jwtHelper.decodeToken(token);
    } catch (error) {
      console.error('Error decoding token:', error);
    }
    return null;
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
    localStorage.removeItem('userId');
    localStorage.removeItem('token_exp');
    this.router.navigate(['/home-component']); // นำทางไปยังหน้าล็อกอินหลังจากล็อกเอาท์
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
