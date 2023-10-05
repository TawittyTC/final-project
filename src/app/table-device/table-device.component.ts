import { Component, OnInit } from '@angular/core';
import { ApiService } from "src/app/api.service";
import { interval } from 'rxjs';

@Component({
  selector: 'app-table-device',
  templateUrl: './table-device.component.html',
  styleUrls: ['./table-device.component.scss']
})
export class TableDeviceComponent implements OnInit {
  data: any[] = [];
  editMode = false;
  editedData: any = {};
  newData: any = {};
  addMode = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadData();

    interval(2000).subscribe(() => {
      this.loadData();
    });

  }

  loadData() {
    this.apiService.getAllData().subscribe((response: any) => {
      this.data = response;
    });
  }
  // สร้างข้อมูลใหม่
  createNewData(newData:any) {
    this.apiService.createData(newData).subscribe(() => {
      this.loadData();
      this.newData = {}; // ล้างข้อมูลใหม่หลังจากสร้างข้อมูลเสร็จสิ้น
      this.addMode = false; // ปิดโหมดเพิ่มข้อมูลหลังจากสร้างข้อมูล
    });
  }
  
  refreshData(): void {
    // Call the fetchData method to refresh the data
    this.loadData();
  }

  updateData(ESP_id: any, updatedData: any) {
    this.apiService.updateData(ESP_id, updatedData).subscribe(() => {
      this.loadData();
    });
  }
  

  // ลบข้อมูล
  deleteData(ESP_id: string) {
    console.log("ESP_id:", ESP_id); // ตรวจสอบค่า ESP_id ในคอลโลจ์
    if (confirm('คุณต้องการลบข้อมูลนี้หรือไม่?')) {
      this.apiService.deleteData(ESP_id).subscribe(() => {
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
    this.apiService.updateData(this.editedData.ESP_id, this.editedData).subscribe(
      () => {
        this.editMode = false;
        this.loadData();
        this.editedData = {}; // เพิ่มบรรทัดนี้เพื่อล้างข้อมูลที่อยู่ใน editedData
      },
      (error) => {
        console.error('An error occurred while saving data:', error);
      }
    );
  }

  // ยกเลิกโหมดแก้ไข
  cancelEditMode() {
    this.editMode = false;
    this.editedData = {}; // เพิ่มบรรทัดนี้เพื่อล้างข้อมูลที่อยู่ใน editedData
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
