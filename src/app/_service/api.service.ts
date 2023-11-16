//api.service.ts
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
  private userUrl = 'http://localhost:3000/users';
  private groupUrl = 'http://localhost:3000/device-groups';
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

  createGroup(group: any): Observable<any>{
    const headers = {'content-type': 'application/json'};
    const body = JSON.stringify(group);
    return this.http.post(this.groupUrl, group).pipe(
        catchError((error)=>{
            console.error('Error creating group:', error);
            return throwError('Error creating group');
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
    return this.http.post(this.userUrl, user).pipe(
      catchError((error) => {
        console.error('Error creating user:', error);
        return throwError('Error creating user');
      })
    );
  }

  // Get all users
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.userUrl);
  }



  // Get a user by ID
  getUserById(userId: any): Observable<any> {
    const url = `${this.userUrl}/${userId}`;
    return this.http.get<any>(url);
  }

  // Update a user by email
  updateUserByEmail(email: string, user: any): Observable<any> {
    const url = `${this.userUrl}/${encodeURIComponent(email)}`;
    return this.http.put(url, user).pipe(
      catchError((error) => {
        console.error('Error updating user by email:', error);
        return throwError('Error updating user by email');
      })
    );
  }

  // Delete a user by email
  deleteUserByEmail(email: string): Observable<any> {
    const url = `${this.userUrl}/${encodeURIComponent(email)}`;
    return this.http.delete(url).pipe(
      catchError((error) => {
        console.error('Error deleting user by email:', error);
        return throwError('Error deleting user by email');
      })
    );
  }

  // Get a user by their email address
  getUserByEmail(email: string): Observable<any> {
    const url = `${this.userUrl}/${encodeURIComponent(email)}`;
    return this.http.get<any>(url).pipe(
      catchError((error) => {
        console.error('Error getting user by email:', error);
        return throwError('Error getting user by email');
      })
    );
  }

  uploadFile(formData: FormData): Observable<any> {
    const uploadUrl = 'http://localhost:3000/upload/';

    return this.http.post(uploadUrl, formData).pipe(
      catchError((error) => {
        console.error('Error uploading file:', error);
        return throwError('Error uploading file');
      })
    );
  }
  getMapImageUrl(deviceId: string): string {
    return `http://localhost:3000/uploads/${deviceId}`;
  }
  updateUnitCost(unitCost: number): Observable<any> {
    const url = 'http://localhost:3000/putUnitCost';
    return this.http.put(url, { unitCost }).pipe(
      catchError((error) => {
        console.error('Error updating Unit Cost:', error);
        return throwError('Error updating Unit Cost');
      })
    );
  }
  // Fetch latest data for a device
  getLatestData(deviceId: string): Observable<any[]> {
    const apiUrl = `http://localhost:3000/latest_data?device_id=${deviceId}`;
    return this.http.get<any[]>(apiUrl);
  }

  // api.service.ts
getAllGroups(): Observable<any[]> {
  const apiUrl = 'http://localhost:3000/device-groups';
  return this.http.get<any[]>(apiUrl);
}


  // Fetch energy data for a device
  getEnergyData(deviceId: string): Observable<any[]> {
    const apiUrl = `http://localhost:3000/energy?device_id=${deviceId}`;
    return this.http.get<any[]>(apiUrl);
  }

  // Fetch unit cost
  getUnitCost(): Observable<number> {
    const apiUrl = 'http://localhost:3000/getUnitCost';
    return this.http.get<number>(apiUrl);
  }

  private baseUrl = 'http://localhost:3000'; // กำหนด URL base ของ API ที่ต้องการเรียกใช้


  //ข้อมูลรวมล่าสุดของ group นั้นๆ
  getDataByGroupName(groupName: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/data_group/${groupName}`);
  }

  //ดึงทั้งหมด แล้วคำนวน //โดยไม่ได้สนgroup
  getAllDataGroup(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/all_data`);
  }

  //ข้อมูลรวมทั้งหมดของกลุ่มนั้นๆ
  getAllDataByGroupName(groupName: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/all_data_group/${groupName}`);
  }

  //ดึงข้อมูลทั้งหมดของทุกอุปกรณ์โดยไม่มีการคำนวนอะไรเลย
  getCombinedData(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/combined_data`);
  }

 // ดึงข้อมูลล่าสุดของอุปกรณ์ทั้งหมด และ ทำการ summ
  getLatestAllEnergy(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/latest_all_energy`);
  }




}
