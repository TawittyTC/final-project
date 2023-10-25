import { GetImageService } from './../get-img.service';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { HttpClient } from '@angular/common/http'; // Import HttpClient here

@Component({
  selector: 'app-device-card',
  templateUrl: './device-card.component.html',
  styleUrls: ['./device-card.component.scss']
})
export class DeviceCardComponent implements OnInit, OnDestroy {
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
  currentDeviceId: string | null = null;



  constructor(private apiService: ApiService, private http: HttpClient, private GetImageService: GetImageService) { }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    if (this.selectedFile && this.currentDeviceId) {
      const formData = new FormData();

      // Change the file name to the currentDeviceId
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



  ngOnInit():void {
    this.loadImageByDeviceId('device_id');
    this.loadData();

    // ใช้ interval สำหรับโหลดข้อมูลอัปเดตทุก 2 วินาที
    this.dataSubscription = interval(2000).subscribe(() => {
      this.loadData();
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
getImageUrl(deviceId: string) {
  const imageUrl = `localhost:3000/uploads/${deviceId}.png`;
  console.log('Image URL:', imageUrl);
  if (this.imageBlob) {
    return imageUrl;
  }
  return ''; // หรือ URL โดย default ในกรณีที่ไม่มีรูปภาพ
}




  loadData() {
    this.apiService.getAllData().subscribe((response: any) => {
      this.data = response;
      this.device_id = this.data.map((item: { device_id: any; }) => item.device_id.toString());

      this.latestDeviceData = {};
      this.device_id.forEach(id => {
        const filteredData = this.data.filter((item: { device_id: string; }) => item.device_id === id);
        const latestEntry = filteredData.reduce((prev: { id: number; }, current: { id: number; }) => (prev.id > current.id) ? prev : current);
        this.latestDeviceData[id] = latestEntry;
      });
    });
  }

  // สร้างข้อมูลใหม่
  createNewData(newData: any) {
    this.apiService.createData(newData).subscribe(() => {

      this.loadData();
      this.newData = {}; // ล้างข้อมูลใหม่หลังจากสร้างข้อมูลเสร็จสิ้น
      this.addMode = false; // ปิดโหมดเพิ่มข้อมูลหลังจากสร้างข้อมูล
    });
  }

  // อัปเดตข้อมูล
  updateData(device_id: any, updatedData: any) {
    this.apiService.updateData(device_id, updatedData).subscribe(() => {
      this.loadData();
    });
  }

  //ลบข้อมูล
  deleteData(device_id: string) {

    // Use confirm() to request confirmation for data deletion
    const confirmed = confirm('คุณต้องการลบข้อมูลนี้หรือไม่?');
    if (confirmed) {
      this.apiService.deleteData(device_id).subscribe(() => {
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
      !!this.editedData.device_location&&
      !!this.editedData.device_map_img&&
      !!this.editedData.group_id;
    this.formIncompleteAlert = this.formIsValid ? '' : 'กรุณากรอกฟอร์มให้ครบทุกช่อง';
  }


  // บันทึกข้อมูลหลังแก้ไข
  saveData() {
    if (this.formIsValid) {
      this.apiService.updateData(this.editedData.device_id, this.editedData).subscribe(
        () => {
          this.editMode = false;
          this.editedData = {}; // ล้างข้อมูลที่อยู่ใน editedData
        },
        (error) => {
          console.error('เกิดข้อผิดพลาดในระหว่างการบันทึกข้อมูล:', error);
        }
      );
    }
    this.apiService.updateData(this.editedData.device_id, this.editedData).subscribe(
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

}
