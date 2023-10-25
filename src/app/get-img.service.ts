import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GetImageService {
  constructor(private http: HttpClient) {}

  getImageByDeviceId(deviceId: string) {
    return this.http.get(`http://localhost:3000/uploads/${deviceId}`, { responseType: 'blob' });
  }
}
