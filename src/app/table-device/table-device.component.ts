import { GetImageService } from '../_service/get-img.service';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { ApiService } from '../_service/api.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-table-device',
  templateUrl: './table-device.component.html',
  styleUrls: ['./table-device.component.scss']
})
export class TableDeviceComponent implements OnInit {
  isMapModalOpen = false;

  imageBlob: Blob | null = null;
  selectedFile: File | null = null;
  @Input() deviceData: any; // รับข้อมูลอุปกรณ์จากภายนอก
  device_id: [] = [];
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
  apiGroups: any[] = [];

  constructor(
    private apiService: ApiService,
    private http: HttpClient,
    private GetImageService: GetImageService
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      // Check the file size (in bytes)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        // File size is too large
        alert('ไฟล์มีขนาดใหญ่เกินไป (มากกว่า 5MB)');
        this.selectedFile = null;
      } else {
        this.selectedFile = file;

        // Set the currentDeviceId based on your logic, e.g., from the selected device's ID
        this.currentDeviceId = this.deviceData.device_id; // Set it to the selected device's ID
      }
    } else {
      this.selectedFile = null;
    }
  }

  onUpload() {
    if (this.selectedFile && this.currentDeviceId) {
      const formData = new FormData();

      // Change the file name to the currentDeviceId
      const fileName = `${this.currentDeviceId}.png`;

      formData.append('file', new File([this.selectedFile], fileName));

      // Use the ApiService to handle the file upload
      this.apiService.uploadFile(formData).subscribe(
        (response) => {
          console.log('File uploaded successfully');
        },
        (error) => {
          console.error('Error uploading file:', error);
        }
      );
    }
  }
  getMapImageUrl(): string {
    // Assuming currentDeviceId is a property in your component
    return this.apiService.getMapImageUrl(this.currentDeviceId);
  }
  ngOnInit(): void {
    this.loadImageByDeviceId('device_id');
    this.loadData();

    // ใช้ interval สำหรับโหลดข้อมูลอัปเดตทุก 2 วินาที
    this.dataSubscription = interval(2000).subscribe(() => {
      this.loadData();
      this.apiService.getAllGroups().subscribe((groups: any) => {
        this.apiGroups = groups;
      });
    });
  }

  ngOnDestroy() {
    // ยกเลิกการสมัครสมาชิกเมื่อคอมโพนนิ้งถูกทำลาย
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  // คำสั่งนี้จะทำการโหลดรูปภาพเมื่อมีข้อมูลใหม่
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

  // ที่อยู่ URL ของรูปภาพ ควรถูกเรียกใช้ใน HTML template
  getImageUrl(deviceId: string): string {
    if (this.imageBlob) {
      // มีรูปภาพใน this.imageBlob
      const imageUrl = `localhost:3000/uploads/${deviceId}.png`;
      return imageUrl;
    } else {
      // ไม่มีรูปภาพ
      return ''; // หรือ URL โดย default ในกรณีที่ไม่มีรูปภาพ
    }
  }

  loadData() {
    this.apiService.getAllDeviceData().subscribe((response: any) => {
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
        this.latestDeviceData[id] = latestEntry;

        // ตรวจสอบสถานะของอุปกรณ์และเพิ่มข้อมูลสถานะลงใน latestDeviceData
        this.latestDeviceData[id] = {
          ...latestEntry,
          status: this.checkOnlineStatus(latestEntry),
        };
      });
    });
  }

  // สร้างข้อมูลใหม่
  createNewData(newData: any) {
    this.apiService.createDeviceData(newData).subscribe(() => {
      this.loadData();
      this.newData = {}; // ล้างข้อมูลใหม่หลังจากสร้างข้อมูลเสร็จสิ้น
      this.addMode = false; // ปิดโหมดเพิ่มข้อมูลหลังจากสร้างข้อมูล
    });
  }

  // อัปเดตข้อมูล
  updateData(device_id: any, updatedData: any) {
    this.apiService.updateDeviceData(device_id, updatedData).subscribe(() => {
      this.loadData();
    });
  }

  //ลบข้อมูล
  deleteData(device_id: string) {
    // Use confirm() to request confirmation for data deletion
    const confirmed = confirm('คุณต้องการลบข้อมูลนี้หรือไม่?');
    if (confirmed) {
      this.apiService.deleteDeviceData(device_id).subscribe(() => {
        // You can optionally handle the result of the deletion here
        // this.loadData();
      });
    }
  }

  // เริ่มโหมดแก้ไขข้อมูล
  enableEditMode(device_id: string) {
    this.editMode = true;
    this.currentDeviceId = device_id; // Set the currentDeviceId when entering edit mode
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

  // เริ่มโหมดแสดงข้อมูล (Info Mode)
  enableInfoMode(device_id: string) {
  this.infoMode = true;
  this.currentDeviceId = device_id; // Set the currentDeviceId when entering info mode
}
  // บันทึกข้อมูลหลังแก้ไข
  saveData() {
    if (this.formIsValid) {
      this.apiService
        .updateDeviceData(this.editedData.device_id, this.editedData)
        .subscribe(
          () => {
            this.editMode = false;
            this.editedData = {}; // ล้างข้อมูลที่อยู่ใน editedData
          },
          (error) => {
            console.error('เกิดข้อผิดพลาดในระหว่างการบันทึกข้อมูล:', error);
          }
        );
    }
    this.apiService
      .updateDeviceData(this.editedData.device_id, this.editedData)
      .subscribe(
        () => {
          this.editMode = false;
          // ไม่ต้องโหลดข้อมูลใหม่เนื่องจากคุณแก้ไขข้อมูลในส่วนเดียวกัน
          this.editedData = {}; // ล้างข้อมูลที่อยู่ใน editedData
        },
        (error) => {
          //console.error('เกิดข้อผิดพลาดในระหว่างการบันทึกข้อมูล:', error);
        }
      );
  }

  // ยกเลิกโหมดแก้ไข
  cancelEditMode() {
    this.editMode = false;
    this.editedData = {}; // ล้างข้อมูลที่อยู่ใน editedData
  }

  // เริ่มโหมดเพิ่มข้อมูล
  enableAddMode() {
    this.addMode = true;
  }

  // ยกเลิกโหมดเพิ่มข้อมูล
  cancelAddMode() {
    this.addMode = false;
    this.newData = {}; // ล้างข้อมูลที่กรอกหลังยกเลิก
  }

  setCurrentDeviceId(deviceId: string) {
    this.currentDeviceId = deviceId;
  }

  reloadPage() {
    // รีโหลดหน้าเว็บ
    location.reload();
  }

  // สร้างฟังก์ชันเพื่อตรวจสอบสถานะ
  checkOnlineStatus(data: any): string {
    const createdTimestamp = new Date(data.created_timestamp).getTime(); // เวลาใน created_timestamp จาก API
    const latestCreatedTimestamp = new Date(
      data.latest_created_timestamp
    ).getTime(); // เวลาใน latest_created_timestamp จาก API
    const currentTimestamp = new Date().getTime(); // เวลาปัจจุบัน
    // console.log('currentTimestamp:', currentTimestamp);
    // console.log('createdTimestamp:', createdTimestamp);
    // console.log('latestCreatedTimestamp:', latestCreatedTimestamp);
    // ตรวจสอบความต่างเวลาระหว่างปัจจุบันและ created_timestamp
    if (currentTimestamp - latestCreatedTimestamp <= 3600000) {
      return 'ON';
    } else {
      return 'OFF';
    }
  }
}
