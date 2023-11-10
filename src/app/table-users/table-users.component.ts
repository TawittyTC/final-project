import { GetImageService } from './../get-img.service';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-table-users',
  templateUrl: './table-users.component.html',
  styleUrls: ['./table-users.component.scss']
})
export class TableUsersComponent implements OnInit, OnDestroy {
  isMapModalOpen = false;
  imageBlob: Blob | null = null;
  selectedFile: File | null = null;
  @Input() deviceData: any;
  device_id: string[] = [];
  latestDeviceData: any = {};
  editMode = false;
  editedData: any = {};
  newData: any = {};
  addMode = false;
  private dataSubscription: Subscription | undefined;
  data: any;
  formIsValid: boolean = false;
  formIncompleteAlert: string = '';
  public currentDeviceId!: string;
  infoMode: boolean | undefined;

  constructor(
    private apiService: ApiService,
    private http: HttpClient,
    private GetImageService: GetImageService
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('ไฟล์มีขนาดใหญ่เกินไป (มากกว่า 5MB)');
        this.selectedFile = null;
      } else {
        this.selectedFile = file;
        this.currentDeviceId = this.deviceData.device_id[0];
      }
    } else {
      this.selectedFile = null;
    }
  }

  onUpload() {
    if (this.selectedFile && this.currentDeviceId) {
      const formData = new FormData();
      const fileName = `${this.currentDeviceId}.png`;

      formData.append('file', new File([this.selectedFile], fileName));

      this.http.post('http://localhost:3000/upload/', formData).subscribe(
        (response) => {
          console.log('File uploaded successfully');
        },
        (error) => {
          console.error('Error uploading file:', error);
        }
      );
    }
  }

  ngOnInit(): void {
    this.loadImageByDeviceId('device_id');
    this.loadData();

    this.dataSubscription = interval(2000).subscribe(() => {
      this.loadData();
    });
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  loadImageByDeviceId(deviceId: string) {
    if (deviceId) {
      this.GetImageService.getImageByDeviceId(deviceId).subscribe(
        (data) => {
          this.imageBlob = data;
        },
        (error) => {
          console.error('Error loading image:', error);
        }
      );
    }
  }

  getImageUrl(deviceId: string): string {
    if (this.imageBlob) {
      const imageUrl = `http://localhost:3000/uploads/${deviceId}.png`;
      return imageUrl;
    } else {
      return '';
    }
  }

  loadData() {
    this.apiService.getAllData().subscribe((response: any) => {
      this.data = response;
      this.device_id = this.data.map((item: { device_id: any }) =>
        item.device_id.toString()
      );

      this.latestDeviceData = {};
      this.device_id.forEach((id) => {
        const filteredData = this.data.filter(
          (item: { device_id: string }) => item.device_id === id
        );
        const latestEntry = filteredData.reduce(
          (prev: { id: number }, current: { id: number }) =>
            prev.id > current.id ? prev : current
        );
        this.latestDeviceData[id] = {
          ...latestEntry,
          status: this.checkOnlineStatus(latestEntry),
        };
      });
    });
  }

  createNewData(newData: any) {
    this.apiService.createData(newData).subscribe(() => {
      this.loadData();
      this.newData = {};
      this.addMode = false;
    });
  }

  updateData(device_id: any, updatedData: any) {
    this.apiService.updateData(device_id, updatedData).subscribe(() => {
      this.loadData();
    });
  }

  deleteData(device_id: string) {
    const confirmed = confirm('คุณต้องการลบข้อมูลนี้หรือไม่?');
    if (confirmed) {
      this.apiService.deleteData(device_id).subscribe(() => {
        // You can optionally handle the result of the deletion here
        // this.loadData();
      });
    }
  }

  enableEditMode(device_id: string) {
    this.editMode = true;
    this.currentDeviceId = device_id;
    this.editedData = { ...this.latestDeviceData[device_id] };
  }

  checkFormValidity() {
    this.formIsValid =
      !!this.editedData.device_name &&
      !!this.editedData.device_detail &&
      !!this.editedData.device_location &&
      !!this.editedData.group_id;
    this.formIncompleteAlert = this.formIsValid
      ? ''
      : 'กรุณากรอกฟอร์มให้ครบทุกช่อง';
  }

  enableInfoMode(device_id: string) {
    this.infoMode = true;
    this.currentDeviceId = device_id;
  }

  saveData() {
    if (this.formIsValid) {
      this.apiService
        .updateData(this.editedData.device_id, this.editedData)
        .subscribe(
          () => {
            this.editMode = false;
            this.editedData = {};
          },
          (error) => {
            console.error('Error saving data:', error);
          }
        );
    }
  }

  cancelEditMode() {
    this.editMode = false;
    this.editedData = {};
  }

  enableAddMode() {
    this.addMode = true;
  }

  cancelAddMode() {
    this.addMode = false;
    this.newData = {};
  }

  setCurrentDeviceId(deviceId: string) {
    this.currentDeviceId = deviceId;
  }

  reloadPage() {
    location.reload();
  }

  checkOnlineStatus(data: any): string {
    const createdTimestamp = new Date(data.created_timestamp).getTime();
    const currentTimestamp = new Date().getTime();

    if (currentTimestamp - createdTimestamp <= 100000) {
      return 'ON';
    } else {
      return 'OFF';
    }
  }
}
