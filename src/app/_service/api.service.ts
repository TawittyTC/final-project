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
  public baseUrl = 'http://localhost:3000'; // กำหนด URL base ของ API ที่ต้องการเรียกใช้

  private deviceUrl = `${this.baseUrl}/devices`;
  private userUrl = `${this.baseUrl}/users`;
  private groupUrl = `${this.baseUrl}/device-groups`;
  private dataSubscription: Subscription | undefined;

  constructor(private http: HttpClient) {}

  // ดึงข้อมูล Device ทั้งหมด
  getAllDeviceData(): Observable<any[]> {
    return this.http.get<any[]>(this.deviceUrl);
  }

  // สร้างข้อมูล Device ใหม่
  createDeviceData(data: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(data);
    return this.http.post(this.deviceUrl, data).pipe(
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
  // อัปเดตข้อมูล Device ผ่าน API
  updateDeviceData(device_id: any, data: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(data);
    const url = `${this.deviceUrl}/${device_id}`;
    return this.http.put<any>(url, data).pipe(
      catchError((error) => {
        //console.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล:', error);
        console.error('Error Details:', error); // Log the error details
        return throwError('เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
      })
    );
  }
  // ลบข้อมูล Device
  deleteDeviceData(device_id: any): Observable<any> {
    const url = `${this.deviceUrl}/${device_id}`;
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
  // อัปโหลดไฟล์
  uploadFile(formData: FormData): Observable<any> {
    const uploadUrl = `${this.baseUrl}/upload/`;

    return this.http.post(uploadUrl, formData).pipe(
      catchError((error) => {
        console.error('Error uploading file:', error);
        return throwError('Error uploading file');
      })
    );
  }

    // อัปโหลดไฟล์
    uploadFileIcon(formData: FormData): Observable<any> {
      const uploadUrl = `${this.baseUrl}/upload-icon/`;

      return this.http.post(uploadUrl, formData).pipe(
        catchError((error) => {
          console.error('Error uploading file:', error);
          return throwError('Error uploading file');
        })
      );
    }

  // รับ URL สำหรับแสดงรูปภาพของแผนที่ตาม deviceId
  getMapImageUrl(deviceId: string): string {
    return `${this.baseUrl}/uploads/${deviceId}`;
  }
  // อัปเดตราคาต่อหน่วย
  updateUnitCost(id: number, unitCost: number): Observable<any> {
    const url = `${this.baseUrl}/putUnitCost/${id}`;
    return this.http.put(url, { unitCost }).pipe(
      catchError((error) => {
        console.error('Error updating Unit Cost:', error);
        return throwError('Error updating Unit Cost');
      })
    );
  }

  // ดึงข้อมูลล่าสุดสำหรับอุปกรณ์
  getLatestData(deviceId: string): Observable<any[]> {
    const apiUrl = `${this.baseUrl}/latest_data?device_id=${deviceId}`;
    return this.http.get<any[]>(apiUrl);
  }
  // ดึงข้อมูลกลุ่มทั้งหมด
  getAllGroups(): Observable<any[]> {
    const apiUrl = `${this.baseUrl}/device-groups`;
    return this.http.get<any[]>(apiUrl);
  }
  // ดึงข้อมูลพลังงานสำหรับอุปกรณ์
  getEnergyData(deviceId: string): Observable<any[]> {
    const apiUrl = `${this.baseUrl}/energy?device_id=${deviceId}`;
    return this.http.get<any[]>(apiUrl);
  }
  // ดึงราคาต่อหน่วย
  getUnitCost(): Observable<number> {
    const apiUrl = `${this.baseUrl}/getUnitCost`;
    return this.http.get<number>(apiUrl);
  }
//**ข้อมูลรายวัน**
  //ข้อมูลรวมล่าสุดของ group นั้นๆ โดยมีค่าเฉลี่ยของ แรงดัน กระแส กำลังไฟ และ ผลรวมของ energy
  getDataByGroupName(groupid: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/data_by_group/${groupid}`);
  }

  //ดึงทั้งหมด แล้วคำนวน //โดยไม่ได้สนgroup  โดยมีค่าเฉลี่ยของ แรงดัน กระแส กำลังไฟ และ ผลรวมของ energy
  getAllDataGroup(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/sum_data`);
  }

  //ข้อมูลรวมทั้งหมดของกลุ่มนั้นๆ //ทำchart
  getAllDataByGroupName(groupid: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/all_data_group/${groupid}`);
  }

  //ดึงข้อมูลทั้งหมดของทุกอุปกรณ์โดยไม่มีการคำนวนอะไรเลย //ทำ chart
  getAllData(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/all_data`);
  }

 // ดึงข้อมูลล่าสุด energy ของอุปกรณ์ทั้งหมด และ ทำการ summ
  getLatestAllEnergy(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/latest_all_energy`);
  }
// ดึงข้อมูลล่าสุด energy ของอุปกรณ์แต่ละกลุ่ม และ ทำการ summ
  getLastestEnergyByGroupName(groupid:string){
    return this.http.get<any>(`${this.baseUrl}/latest_energy_group/${groupid}`);
  }
//**ข้อมูลรายเดือน**
//ข้อมูลพลังงานอุปกรณ์ รายเดือน ปัจจุบัน ใช้แสดงกราฟ
  getEnergyForDevice(deviceId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/energy_month?device_id=${deviceId}`);
  }
//ดึงข้อมูลค่าเฉี่ย ค่ารวม โดยอ้างอิงตาม group_name ใช้แสดงเป็นตัวเลข รายเดือน
  getDataByGroupForMonth(groupId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/data_by_group_month/${groupId}`);
  }
//ดึงข้อมูลทั้งหมด ตาม group_name ใช้แสดงในกราฟ แสดงข้อมูล 1 เดือน ทุก 1วัน แสดงกราฟ
  getAllDataForGroupMonth(groupId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/all_data_group_month/${groupId}`);
  }
//ข้อมูลพลังงานอุปกรณ์ทั้งหมด รายเดือน ปัจจุบัน ใช้แสดงกราฟ
  getAllDataForMonth(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/all_data_month`);
  }
//ดึงข้อมูล ค่าเฉลี่ย ค่ารวม ของทั้งหมด ใช้แสดงเป็นตัวเลข ในเดือนปัจจุบัน
  getSumDataForMonth(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/sum_data_month`);
  }

//**ข้อมูลรายปี**
//ข้อมูลพลังงานอุปกรณ์ รายปี ปัจจุบัน แสดงเป็นกราฟ
  getEnergyForYears(deviceId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/energy_years?device_id=${deviceId}`);
  }
  //ดึงข้อมูลค่าเฉี่ย ค่ารวม โดยอ้างอิงตาม group_name ใช้แสดงเป็นตัวเลข รายปี
  getDataByGroupForYears(groupId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/data_by_group_years/${groupId}`);
  }
  //ดึงข้อมูลทั้งหมด ตาม group_name ใช้แสดงในกราฟ แสดงข้อมูล 1 ปี ทุก 1เดือน แสดงกราฟ
  getAllDataForGroupYears(groupId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/all_data_group_years/${groupId}`);
  }
  //ข้อมูลพลังงานอุปกรณ์ทั้งหมด รายปี ปัจจุบัน ใช้แสดงกราฟ
  getAllDataForYears(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/all_data_years`);
  }
  //ดึงข้อมูล ค่าเฉลี่ย ค่ารวม ของทั้งหมด ใช้แสดงเป็นตัวเลข ในปีปัจจุบัน
  getSumDataForYears(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/sum_data_years`);
  }
}
