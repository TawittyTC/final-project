import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})
export class DeviceComponent implements OnInit{
  showGroupDropdown: boolean = false;
  selectedGroup: string = '';
  groups: string[] = ['Group A', 'Group B', 'Group C'];
  data: any[] = [];
  editMode = false;
  editedData: any = {};
  newData: any = {};
  addMode = false;
  private dataSubscription: Subscription | undefined;

  constructor(private apiService: ApiService){}

  toggleGroupDropdown() {
    this.showGroupDropdown = !this.showGroupDropdown;
  }
 // ฟังก์ชันเลือกกลุ่ม
 selectGroup(group: string) {
  this.selectedGroup = group;
  this.showGroupDropdown = false;
}

// สร้างฟังก์ชันเรียกข้อมูลของ device ตามกลุ่มที่เลือก
getDevicesByGroup(group: string) {
  // ทำงานเรียกข้อมูลของ device ตามกลุ่มที่เลือก
}

  ngOnInit(){
    this.loadData();

    this.dataSubscription = interval (2000).subscribe(()=>{
      this.loadData
    })
  }

  ngOnDestroy() {
    // ยกเลิกการสมัครสมาชิกเมื่อคอมโพนนิ้งถูกทำลาย
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  // โหลดข้อมูลจาก API
  loadData() {
    this.apiService.getAllData().subscribe((response: any) => {
      this.data = response;
      console.log('123');
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

  // ลบข้อมูล
  deleteData(device_id: string) {
    console.log('device_id:', device_id); // ตรวจสอบค่า device_id ในคอลัมน์

    // ใช้ confirm() เพื่อขอยืนยันการลบข้อมูล
    const confirmed = confirm('คุณต้องการลบข้อมูลนี้หรือไม่?');
    if (confirmed) {
      this.apiService.deleteData(device_id).subscribe(() => {
        this.loadData();
      });
    }
  }

  // เริ่มโหมดแก้ไขข้อมูล
  enableEditMode(item: any) {
    this.editMode = true;
    this.editedData = { ...item };
  }

  // บันทึกข้อมูลหลังแก้ไข
  saveData() {
    this.apiService.updateData(this.editedData.device_id, this.editedData).subscribe(
      () => {
        this.editMode = false;
        this.loadData();
        this.editedData = {}; // ล้างข้อมูลที่อยู่ใน editedData
      },
      (error) => {
        console.error('เกิดข้อผิดพลาดในระหว่างการบันทึกข้อมูล:', error);
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
}

