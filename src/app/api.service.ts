import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/devices'; // URL ของ API ของ Express.js
  private userurl = 'http://localhost:3000/users';
  private dataSubscription: Subscription | undefined;

  constructor(private http: HttpClient) {}

  // ดึงข้อมูลทั้งหมด
  getAllData(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // สร้างข้อมูลใหม่
  createData(data: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(data);
    return this.http.post(this.apiUrl, data).pipe(
      catchError((error) => {
        console.error('เกิดข้อผิดพลาดในการสร้างข้อมูล:', error);
        return throwError('เกิดข้อผิดพลาดในการสร้างข้อมูล');
      })
    );
  }

  // อัปเดตข้อมูลผ่าน API
  updateData(device_id: any, data: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(data);
    const url = `${this.apiUrl}/${device_id}`;
    return this.http.put<any>(url, data).pipe(
      catchError((error) => {
        //console.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล:', error);
        console.error('Error Details:', error); // Log the error details
        return throwError('เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
      })
    );
  }

  

  // ลบข้อมูล
  deleteData(device_id: any): Observable<any> {
    const url = `${this.apiUrl}/${device_id}`;
    return this.http.delete(url).pipe(
      catchError((error) => {
        console.error('เกิดข้อผิดพลาดในการลบข้อมูล:', error);
        return throwError('เกิดข้อผิดพลาดในการลบข้อมูล');
      })
    );
  }

  // Create a new user
  createUser(user: any): Observable<any> {
    return this.http.post(this.userurl, user).pipe(
      catchError((error) => {
        console.error('Error creating user:', error);
        return throwError('Error creating user');
      })
    );
  }

  // Get all users
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.userurl);
  }

  // Get a user by ID
  getUserById(userId: any): Observable<any> {
    const url = `${this.userurl}/${userId}`;
    return this.http.get<any>(url);
  }

  // Update a user
  updateUser(userId: any, user: any): Observable<any> {
    const url = `${this.userurl}/${userId}`;
    return this.http.put(url, user).pipe(
      catchError((error) => {
        console.error('Error updating user:', error);
        return throwError('Error updating user');
      })
    );
  }

  // Delete a user
  deleteUser(userId: any): Observable<any> {
    const url = `${this.userurl}/${userId}`;
    return this.http.delete(url).pipe(
      catchError((error) => {
        console.error('Error deleting user:', error);
        return throwError('Error deleting user');
      })
    );
  }
  // Get a user by their email address
  getUserByEmail(email: string): Observable<any> {
    const url = `${this.userurl}/${encodeURIComponent(email)}`;
    return this.http.get<any>(url).pipe(
      catchError((error) => {
        console.error('Error getting user by email:', error);
        return throwError('Error getting user by email');
      })
    );
  }
}
