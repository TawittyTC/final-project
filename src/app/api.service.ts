import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/devices'; // URL ของ API ของ Express.js

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
        console.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล:', error);
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
}
