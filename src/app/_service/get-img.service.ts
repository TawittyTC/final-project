import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class GetImageService {
  constructor(private http: HttpClient, private apiService: ApiService) {}

  getImageByDeviceId(deviceId: string) {
    const imageUrl = `${this.apiService.baseUrl}/uploads/${deviceId}`;
    return this.http.get(imageUrl, { responseType: 'blob' });
  }
}
